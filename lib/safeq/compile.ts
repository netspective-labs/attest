// content.ts
// Turn a FHIR R4 Questionnaire into a strongly typed Zod schema + codec
// Deno 2 / Zod 4

import { zod as z } from "./deps.ts";
import {
    attachmentSchema,
    codingSchema,
    fhirDateSchema,
    fhirDateTimeSchema,
    fhirTimeSchema,
    quantitySchema,
    Questionnaire,
    questionnaireSchema,
    referenceSchema,
} from "./mod.ts";

// deno-lint-ignore no-explicit-any
type Any = any;

/* ──────────────────────────────────────────────────────────────────────────
 * Options & types
 * ────────────────────────────────────────────────────────────────────────── */

export type CompileOptions = {
    /**
     * Choose the **property name** for each item (default: human label → camelCase).
     * Receives the item definition and its linkId path.
     */
    propNameResolver?: (item: QuestionnaireItemNode, path: string[]) => string;

    /**
     * Provide identity info for the Questionnaire (title + identifiers).
     * Used by `identifier(nature)` for human- and code-friendly names.
     */
    qIdentityResolver?: (q: Questionnaire) => {
        title?: string;
        identifiers?: string[]; // e.g., canonical url, id, identifier[].value, codes, etc.
    };

    /**
     * For 'choice'/'open-choice':
     * - "code" (default): emit a z.enum([...codes]) if answerOptions provide codes.
     * - "coding": emit Coding objects (system/code/display).
     * - "code-or-coding": z.union([enum(codes), Coding]).
     */
    choiceValue?: "code" | "coding" | "code-or-coding";

    /** If true (default), groups with no children are omitted from the schema. */
    omitEmptyGroups?: boolean;

    /** If true, top-level object keeps unknowns. Default: true (open root). */
    openRoot?: boolean;
};

export type QuestionnaireItemNode = NonNullable<Questionnaire["item"]>[number];

export type CompiledQuestionnaire = {
    // Title/identifiers → friendly/cased names
    identifier: (
        nature:
            | "human-friendly"
            | "camel-case"
            | "kebab-case"
            | "pascal-case"
            | "snake-case",
    ) => string;

    /** The Zod schema describing the typed response object keyed by resolved property names. */
    schema: z.ZodTypeAny;

    /** Introspection helpers */
    introspect: {
        keyByPath: Record<string, string>; // "linkId path" -> property key
        pathByKey: Record<string, string>; // property key -> path
    };

    /** What we compiled + a stable digest to detect changes */
    provenance: {
        src: unknown;
        srcHash: string;
    };

    /** Parse LHC Form answers OR QuestionnaireResponse into the DTO validated by `schema`. */
    parse: (answers: unknown) => unknown;
};

/* ──────────────────────────────────────────────────────────────────────────
 * Helpers
 * ────────────────────────────────────────────────────────────────────────── */

const sanitizeProp = (key: string) => key.replace(/[^\p{L}\p{N}_$]/gu, "_"); // safe-ish identifier

const toWords = (s: string): string[] => {
    const n = s
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[_\-]+/g, " ")
        .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
        .trim();
    return n
        .split(/[^A-Za-z0-9]+/g)
        .filter(Boolean)
        .map((w) => w.toLowerCase());
};

const toCamelCase = (s: string) => {
    const parts = toWords(s);
    if (!parts.length) return "field";
    const [h, ...t] = parts;
    return sanitizeProp(
        h + t.map((p) => p[0].toUpperCase() + p.slice(1)).join(""),
    );
};
const toPascalCase = (s: string) => {
    const parts = toWords(s);
    if (!parts.length) return "Field";
    return sanitizeProp(
        parts.map((p) => p[0].toUpperCase() + p.slice(1)).join(""),
    );
};
const toKebabCase = (s: string) => {
    const parts = toWords(s);
    return parts.length ? parts.join("-") : "field";
};
const toSnakeCase = (s: string) => {
    const parts = toWords(s);
    return parts.length ? parts.join("_") : "field";
};

const labelFor = (item: QuestionnaireItemNode): string =>
    item.text ??
        item.code?.[0]?.display ??
        item.code?.[0]?.code ??
        item.linkId ??
        "field";

/** Default: use human label → camelCase (not linkId). */
const defaultPropNameResolver = (
    item: QuestionnaireItemNode,
    _path: string[],
) => toCamelCase(labelFor(item));

/** Default Questionnaire identity */
const defaultQIdentityResolver = (q: Questionnaire) => {
    const title = q.title ??
        q.name ??
        q.code?.[0]?.display ??
        q.code?.[0]?.code ??
        q.url ??
        "Questionnaire";
    const identifiers: string[] = [];
    if (q.url) identifiers.push(q.url);
    if (q.id) identifiers.push(q.id);
    if (q.version) identifiers.push(`v:${q.version}`);
    for (const i of q.identifier ?? []) if (i.value) identifiers.push(i.value);
    for (const d of q.derivedFrom ?? []) identifiers.push(d);
    return { title, identifiers };
};

/** Turn answerOption(s) into z.enum of codes or strings when possible. */
function enumFromAnswerOptions(item: QuestionnaireItemNode) {
    if (!item.answerOption?.length) return null;
    const codes: string[] = [];
    for (const ao of item.answerOption) {
        const c = (ao as Any).valueCoding?.code ?? (ao as Any).valueString;
        if (typeof c === "string") codes.push(String(c));
    }
    const uniq = Array.from(new Set(codes));
    if (!uniq.length) return null;
    const [h, ...rest] = uniq as [string, ...string[]];
    return z.enum([h, ...rest]);
}

/** Read value[x] from either an LHC "item" node or a QR.item.answer[x] node. */
function readValueX(node: Any): unknown {
    const keys = [
        "valueBoolean",
        "valueDecimal",
        "valueInteger",
        "valueDate",
        "valueDateTime",
        "valueTime",
        "valueString",
        "valueCoding",
        "valueQuantity",
        "valueReference",
        "valueAttachment",
    ];
    for (const k of keys) if (k in node) return node[k];
    if ("value" in node) return (node as Any).value;
    return undefined;
}

/** Build a fast index of answers by linkId for QR or LHC shapes. */
function indexAnswersByLinkId(root: Any): Record<string, Any[]> {
    const out: Record<string, Any[]> = {};
    const push = (lid: string, n: Any) => {
        if (!out[lid]) out[lid] = [];
        out[lid].push(n);
    };

    const walkQRItems = (items: Any[]) => {
        for (const it of items ?? []) {
            if (typeof it?.linkId === "string") push(it.linkId, it);
            for (const ans of it?.answer ?? []) {
                for (const sub of ans?.item ?? []) walkQRItems([sub]);
            }
            if (Array.isArray(it?.item)) walkQRItems(it.item);
        }
    };

    const walkLHCItems = (items: Any[]) => {
        for (const it of items ?? []) {
            if (typeof it?.linkId === "string") push(it.linkId, it);
            if (Array.isArray(it?.items)) walkLHCItems(it.items);
        }
    };

    if (Array.isArray(root?.item)) {
        walkQRItems(root.item);
    } else if (Array.isArray(root?.items)) {
        walkLHCItems(root.items);
    }
    return out;
}

/** stable stringify (sorted keys) for hashing */
function stableStringify(v: unknown): string {
    const seen = new WeakSet<object>();
    const stringify = (x: unknown): string => {
        if (x === null || typeof x !== "object") return JSON.stringify(x);
        if (seen.has(x as object)) return '"[Circular]"';
        seen.add(x as object);
        if (Array.isArray(x)) return `[${x.map(stringify).join(",")}]`;
        const o = x as Record<string, unknown>;
        const keys = Object.keys(o).sort();
        return `{${
            keys.map((k) => `${JSON.stringify(k)}:${stringify(o[k])}`).join(",")
        }}`;
    };
    return stringify(v);
}

/** FNV-1a 32-bit hash → hex string */
function fnv1a32Hex(str: string): string {
    let h = 0x811c9dc5 >>> 0;
    for (let i = 0; i < str.length; i++) {
        h ^= str.charCodeAt(i);
        h = Math.imul(h, 0x01000193) >>> 0;
    }
    return ("00000000" + h.toString(16)).slice(-8);
}

/* ──────────────────────────────────────────────────────────────────────────
 * Leaf schema selector
 * ────────────────────────────────────────────────────────────────────────── */

function leafSchemaForItem(
    item: QuestionnaireItemNode,
    opts: CompileOptions,
): z.ZodTypeAny {
    const t = item.type;
    switch (t) {
        case "boolean":
            return z.boolean();
        case "decimal":
            return z.number();
        case "integer":
            return z.number().int();
        case "date":
            return fhirDateSchema;
        case "dateTime":
            return fhirDateTimeSchema;
        case "time":
            return fhirTimeSchema;
        case "string":
        case "text": {
            let s = z.string();
            if (item.maxLength) s = s.max(item.maxLength);
            return s;
        }
        case "url":
            return z.string().url();
        case "attachment":
            return attachmentSchema;
        case "reference":
            return referenceSchema;
        case "quantity":
            return quantitySchema;
        case "choice":
        case "open-choice": {
            const mode = opts.choiceValue ?? "code";
            const fromOptions = enumFromAnswerOptions(item);
            const allowFree = t === "open-choice" ? z.string() : null;
            if (mode === "coding") {
                return allowFree
                    ? z.union([codingSchema, allowFree])
                    : codingSchema;
            }
            if (mode === "code-or-coding") {
                const base = fromOptions ?? z.never();
                const u = z.union([base, codingSchema]);
                return allowFree ? z.union([u, allowFree]) : u;
            }
            if (fromOptions) {
                return allowFree
                    ? z.union([fromOptions, allowFree])
                    : fromOptions;
            }
            return allowFree
                ? z.union([codingSchema, allowFree])
                : codingSchema;
        }
        default:
            return z.unknown();
    }
}

/* ──────────────────────────────────────────────────────────────────────────
 * Compiler
 * ────────────────────────────────────────────────────────────────────────── */

export function compileQuestionnaire(
    questionnaire: Questionnaire,
    options: CompileOptions = {},
): CompiledQuestionnaire {
    // validate Questionnaire (devs may pass raw JSON)
    const q = questionnaireSchema.parse(questionnaire);

    // finalize options
    const propNameResolver = options.propNameResolver ??
        defaultPropNameResolver;
    const qIdentity = (options.qIdentityResolver ?? defaultQIdentityResolver)(
        q,
    );
    const choiceValue = options.choiceValue ?? "code";
    const omitEmptyGroups = options.omitEmptyGroups ?? true;
    const openRoot = options.openRoot ?? true;

    const keyByPath: Record<string, string> = {};
    const pathByKey: Record<string, string> = {};

    // sibling-collision resolver (adds numeric suffix)
    const allocKey = (base: string, used: Set<string>, fallback: string) => {
        const k = base || fallback;
        if (!used.has(k)) {
            used.add(k);
            return k;
        }
        let i = 2;
        while (used.has(`${k}${i}`)) i++;
        const finalKey = `${k}${i}`;
        used.add(finalKey);
        return finalKey;
    };

    const build = (
        items: QuestionnaireItemNode[],
        path: string[],
    ): z.ZodRawShape => {
        const shape: z.ZodRawShape = {};
        const used = new Set<string>();

        for (const it of items ?? []) {
            if (it.type === "display") continue;
            const thisPath = [...path, it.linkId ?? "<unknown>"];
            const baseKey = propNameResolver(it, thisPath);
            const fallback = toCamelCase(it.linkId ?? "field");
            const key = allocKey(baseKey, used, fallback);

            keyByPath[thisPath.join(".")] = key;
            pathByKey[key] = thisPath.join(".");

            if (it.type === "group") {
                const childShape = build(it.item ?? [], thisPath);
                const isEmpty = Object.keys(childShape).length === 0;
                if (isEmpty && omitEmptyGroups) continue;
                let s = z.object(childShape);
                if (it.repeats) s = z.array(s) as Any;
                (shape[key] as Any) = it.required ? s : s.optional();
                continue;
            }

            let s = leafSchemaForItem(it, { choiceValue } as CompileOptions);
            if (it.repeats) s = z.array(s);
            (shape[key] as Any) = it.required ? s : s.optional();
        }
        return shape;
    };

    const rootShape = build(q.item ?? [], []);
    const rootObj = z.object(rootShape);
    const schema = openRoot ? rootObj.catchall(z.unknown()) : rootObj;

    function parse(answers: unknown): unknown {
        const byLinkId = indexAnswersByLinkId(answers as Any);

        const materialize = (
            items: QuestionnaireItemNode[],
            path: string[],
        ): Any => {
            const out: Record<string, unknown> = {};
            for (const it of items ?? []) {
                if (it.type === "display") continue;

                const thisPath = [...path, it.linkId ?? "<unknown>"];
                const key = keyByPath[thisPath.join(".")] ??
                    propNameResolver(it, thisPath);

                if (it.type === "group") {
                    const nodes = (byLinkId[it.linkId ?? ""] ?? []) as Any[];
                    if (!nodes.length) continue;

                    const projectChild = (node: Any) => {
                        const childItems = it.item ?? [];
                        const scopedIndex = indexAnswersByLinkId({
                            item: node.item ?? node.items ?? [],
                        });

                        const obj: Record<string, unknown> = {};
                        for (const child of childItems) {
                            if (child.type === "display") continue;
                            const childPath = [
                                ...thisPath,
                                child.linkId ?? "<unknown>",
                            ];
                            const ck = keyByPath[childPath.join(".")] ??
                                propNameResolver(child, childPath);

                            if (child.type === "group") {
                                const groupNodes =
                                    scopedIndex[child.linkId ?? ""] ?? [];
                                if (!groupNodes.length) continue;
                                const groupVals = groupNodes.map(projectChild);
                                obj[ck] = child.repeats
                                    ? groupVals
                                    : groupVals[0];
                            } else {
                                obj[ck] = readLeaf(
                                    child,
                                    scopedIndex[child.linkId ?? ""] ?? [],
                                );
                            }
                        }
                        return obj;
                    };

                    const vals = nodes.map(projectChild);
                    out[key] = it.repeats ? vals : vals[0];
                    continue;
                }

                const nodes = (byLinkId[it.linkId ?? ""] ?? []) as Any[];
                const value = readLeaf(it, nodes);
                if (value !== undefined) out[key] = value;
            }
            return out;
        };

        const readLeaf = (it: QuestionnaireItemNode, nodes: Any[]): unknown => {
            const vals: unknown[] = [];
            for (const n of nodes) {
                if (Array.isArray(n?.answer)) {
                    for (const a of n.answer) vals.push(readValueX(a));
                } else {
                    const v = readValueX(n);
                    if (v !== undefined) vals.push(v);
                }
            }
            if (!vals.length) return undefined;
            return it.repeats ? vals : vals.find((v) => v !== undefined);
        };

        const candidate = materialize(q.item ?? [], []);
        return schema.parse(candidate);
    }

    // identifier(nature) implementation
    const idTitle = qIdentity.title ?? "Questionnaire";
    const identifier = (
        nature:
            | "human-friendly"
            | "camel-case"
            | "kebab-case"
            | "pascal-case"
            | "snake-case",
    ) => {
        switch (nature) {
            case "human-friendly":
                return idTitle;
            case "camel-case":
                return toCamelCase(idTitle);
            case "kebab-case":
                return toKebabCase(idTitle);
            case "pascal-case":
                return toPascalCase(idTitle);
            case "snake-case":
                return toSnakeCase(idTitle);
        }
    };

    const src = questionnaire; // keep exactly what caller passed
    const srcHash = fnv1a32Hex(stableStringify(src));

    return {
        identifier,
        schema,
        introspect: { keyByPath, pathByKey },
        provenance: { src, srcHash },
        parse,
    };
}
