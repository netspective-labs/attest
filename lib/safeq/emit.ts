// emitter.ts
import { Questionnaire, questionnaireSchema } from "./questionnaire.ts";
import type { CompiledQuestionnaire } from "./compile.ts";

// deno-lint-ignore no-explicit-any
type Any = any;

/* ────────────────────────────────────────────────────────────────────────── *
 * Instructions
 * ────────────────────────────────────────────────────────────────────────── */

export type EmitInstructions = {
    /** The exported const name of the schema (required). */
    schemaTsIdentifier: string;

    /** The exported type name of the schema (optional). */
    tsTypeIdentifier?: string;

    /** If true (default), add the Zod import line in the emitted code. */
    includeZodImport?: boolean;

    /** Custom Zod import line (default: `import { z } from "npm:zod@4.1.1";`). */
    zImportLine?: string;

    /** Add header banner with title and hash (default: true). */
    includeHeaderComment?: boolean;

    /** If true, add `.catchall(z.unknown())` to the root object (default: false). */
    openRoot?: boolean;

    /** Omit empty groups (default: true; mirrors compiler default). */
    omitEmptyGroups?: boolean;
};

/* ────────────────────────────────────────────────────────────────────────── *
 * Emitter
 * ────────────────────────────────────────────────────────────────────────── */

export function emitZodTs(
    compiled: CompiledQuestionnaire,
    instructions: EmitInstructions,
): { tsCode: string[] } {
    const {
        schemaTsIdentifier,
        tsTypeIdentifier,
        includeZodImport = true,
        zImportLine = `import { z } from "npm:zod@4.1.1";`,
        includeHeaderComment = true,
        openRoot = false,
        omitEmptyGroups = true,
    } = instructions;

    if (!schemaTsIdentifier?.trim()) {
        throw new Error("emitZodTs: `schemaTsIdentifier` is required.");
    }
    const schemaConst = ensureTsIdent(schemaTsIdentifier);
    const tsType = tsTypeIdentifier
        ? ensureTsIdent(tsTypeIdentifier)
        : undefined;

    // validated source Questionnaire (same one compileQuestionnaire used)
    const src = compiled.provenance?.src ?? {};
    const q: Questionnaire = questionnaireSchema.parse(src);

    const keyByPath = compiled.introspect?.keyByPath ?? {};
    const title = compiled.identifier("human-friendly");
    const kebab = compiled.identifier("kebab-case");
    const srcHash = compiled.provenance?.srcHash ?? "unknown";

    const L: string[] = [];
    const push = (...xs: (string | null | undefined)[]) => {
        for (const x of xs) if (typeof x === "string") L.push(x);
    };
    const J = JSON.stringify;
    const ind = (n: number) => "  ".repeat(n);

    // Build object body
    const emitShape = (
        items: Questionnaire["item"] = [],
        depth = 1,
        path: string[] = [],
    ): string[] => {
        const out: string[] = [];
        const pad = ind(depth);

        for (const it of items ?? []) {
            if (!it || it.type === "display") continue;

            const thisPath = [...path, it.linkId ?? "<unknown>"];
            const rawKey = keyByPath[thisPath.join(".")] ??
                camelCase(it.text ?? it.linkId ?? "field");
            const key = ensureTsIdent(rawKey);

            // describe/brand meta (same for groups and leaves)
            const desc = buildDescription(it, thisPath);
            const brand = buildBrand(it, thisPath);

            if (it.type === "group") {
                const inner = emitShape(it.item ?? [], depth + 1, thisPath);
                if (inner.length === 0 && omitEmptyGroups) continue;

                let expr = `z.object({\n${
                    inner.join("\n")
                }\n${pad}})${brand}.describe(${J(desc)})`;
                if (it.repeats) expr = `z.array(${expr})`;
                if (!it.required) expr += ".optional()";
                out.push(`${pad}${key}: ${expr},`);
                continue;
            }

            // leaf
            let leaf = emitLeaf(it);

            // Attach meta
            leaf = `${leaf}${brand}.describe(${J(desc)})`;

            // Allow arrays for repeats OR when itemControl says "check-box"
            const multi = it.type === "choice" || it.type === "open-choice"
                ? isCheckboxMultiSelect(it)
                : Boolean(it.repeats);

            if (multi) leaf = `z.array(${leaf})`;
            if (!it.required) leaf += ".optional()";
            out.push(`${pad}${key}: ${leaf},`);
        }
        return out;
    };

    // header
    if (includeHeaderComment) {
        push(
            `/* AUTO-GENERATED for ${title} (${kebab})`,
            ` * Source hash: ${srcHash}`,
            ` * Standalone Zod schema (${schemaConst}). No external dependencies besides Zod.`,
            ` */`,
            ``,
        );
    }
    if (includeZodImport) push(zImportLine, "");

    // schema const
    const body = emitShape(q.item ?? [], 1, []);
    const meta = {
        title: compiled.identifier("human-friendly"),
        tsType: compiled.identifier("pascal-case"),
        schemaConst: schemaConst,
    };
    let rootExpr = `z.object({\n${body.join("\n")}\n}).meta(${
        JSON.stringify(meta)
    })`;
    if (openRoot) rootExpr += `.catchall(z.unknown())`;
    push(`export const ${schemaConst} = ${rootExpr};`, "");
    if (tsType) {
        push(`export type ${tsType} = z.infer<typeof ${schemaConst}>;`, "");
    }

    return { tsCode: L };
}

/* ────────────────────────────────────────────────────────────────────────── *
 * Helpers (standalone / native leafs only)
 * ────────────────────────────────────────────────────────────────────────── */

function ensureTsIdent(s: string): string {
    let k = s.replace(/[^\w$]/g, "_");
    if (!/^[A-Za-z_$]/.test(k)) k = "_" + k;
    return k;
}

function toWords(s: string): string[] {
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
}

function camelCase(s: string): string {
    const parts = toWords(s);
    if (!parts.length) return "field";
    const [h, ...t] = parts;
    return ensureTsIdent(
        h + t.map((p) => p[0].toUpperCase() + p.slice(1)).join(""),
    );
}

function buildDescription(
    it: NonNullable<Questionnaire["item"]>[number],
    _path: string[],
): string {
    const bits: string[] = [];
    if (it.text) bits.push(it.text);
    const link = it.linkId ? `linkId=${it.linkId}` : "";
    const defn = it.definition ? `definition=${it.definition}` : "";
    const codes = (it.code ?? []).map((c) => c.code).filter(Boolean).join(",");
    const codex = codes ? `codes=[${codes}]` : "";
    const meta = [link, defn, codex].filter(Boolean).join(" | ");
    const tail = meta ? ` [${meta}]` : "";
    return `${bits.join(" ")}${tail}` || (it.linkId ?? "field");
}

function escapeTplType(s: string): string {
    // safe for template literal types in .brand<`...`>()
    return s.replace(/[`\\]/g, "").replace(/\r?\n/g, " ");
}

function buildBrand(
    it: NonNullable<Questionnaire["item"]>[number],
    _path: string[],
): string {
    const a = `\`linkId:${escapeTplType(it.linkId ?? "")}\``;
    const b = `\`text:${escapeTplType(it.text ?? "")}\``;
    const c = it.type ? ` | \`type:${escapeTplType(it.type)}\`` : "";
    const d = it.definition
        ? ` | \`definition:${escapeTplType(it.definition)}\``
        : "";
    return `.brand<${a} | ${b}${c}${d}>()`;
}

/** Detect checkbox-style multi-select via itemControl extension, or repeats flag. */
function isCheckboxMultiSelect(
    it: NonNullable<Questionnaire["item"]>[number],
): boolean {
    if (it.type !== "choice" && it.type !== "open-choice") return false;
    if (it.repeats) return true;
    const exts = (it as Any).extension as Any[] | undefined;
    if (!Array.isArray(exts)) return false;
    for (const ex of exts) {
        if (
            ex?.url ===
                "http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl"
        ) {
            const codings: Any[] = ex?.valueCodeableConcept?.coding ?? [];
            for (const c of codings) {
                const code = String(c?.code ?? c?.display ?? "").toLowerCase();
                if (
                    code === "check-box" || code === "checkbox" ||
                    code === "check"
                ) {
                    return true;
                }
            }
        }
    }
    return false;
}

/** Build enum or union-of-literals from AnswerOption content. */
function enumOrLiteralsFromAnswerOptions(
    it: NonNullable<Questionnaire["item"]>[number],
): string | null {
    const options = it.answerOption ?? [];
    if (!options.length) return null;

    type V = { kind: "string" | "number"; v: string | number };
    const vals: V[] = [];

    for (const ao of options) {
        const a = ao as Any;

        // Prefer code, then display, then valueString/date/dateTime/time
        let sv: string | number | undefined = a?.valueCoding?.code ??
            a?.valueCoding?.display ??
            a?.valueString ??
            a?.valueDate ??
            a?.valueDateTime ??
            a?.valueTime;

        let kind: V["kind"] | null = null;

        if (sv !== undefined) {
            kind = "string";
        } else if (typeof a?.valueInteger === "number") {
            sv = a.valueInteger;
            kind = "number";
        } else if (typeof a?.valueDecimal === "number") {
            sv = a.valueDecimal;
            kind = "number";
        }

        if (kind && (typeof sv === "string" || typeof sv === "number")) {
            vals.push({ kind, v: sv });
        }
    }

    if (!vals.length) return null;

    const isAllString = vals.every((x) => x.kind === "string");
    const isAllNumber = vals.every((x) => x.kind === "number");

    if (isAllString) {
        const uniq = Array.from(new Set(vals.map((x) => String(x.v))));
        return `z.enum([${uniq.map((s) => JSON.stringify(s)).join(", ")}])`;
    }

    if (isAllNumber) {
        const uniqNums = Array.from(new Set(vals.map((x) => Number(x.v))));
        if (uniqNums.length === 1) return `z.literal(${uniqNums[0]})`;
        return `z.union([${
            uniqNums.map((n) => `z.literal(${n})`).join(", ")
        }])`;
    }

    // Mixed types → fall back to string
    return null;
}

function emitLeaf(it: NonNullable<Questionnaire["item"]>[number]): string {
    switch (it.type) {
        case "boolean":
            return "z.boolean()";
        case "decimal":
            return "z.number()";
        case "integer":
            return "z.number().int()";
        case "date":
            return "z.string()"; // FHIR date → string (standalone)
        case "dateTime":
            return "z.string()"; // FHIR dateTime → string
        case "time":
            return "z.string()"; // FHIR time → string
        case "string": {
            const base = "z.string()";
            return it.maxLength ? `z.string().max(${it.maxLength})` : base;
        }
        case "text": {
            const base = "z.string()";
            return it.maxLength ? `z.string().max(${it.maxLength})` : base;
        }
        case "url":
            return "z.string().url()";
        case "attachment":
        case "reference":
        case "quantity":
            // Standalone representation: generic object
            return "z.record(z.string(), z.unknown())";

        case "choice":
        case "open-choice": {
            const unionOrEnum = enumOrLiteralsFromAnswerOptions(it);
            if (unionOrEnum) {
                // open-choice permits free text in addition to fixed options
                return it.type === "open-choice"
                    ? `z.union([${unionOrEnum}, z.string()])`
                    : unionOrEnum;
            }
            // No inline options -> string fallback
            return "z.string()";
        }

        default:
            return "z.unknown()";
    }
}
