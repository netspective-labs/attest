#!/usr/bin/env -S deno run --allow-read --allow-write
/**
 * @file r4q-runtime.ts
 * Shared utilities used by generated TypeScript modules from FHIR R4 Questionnaire resources.
 * This file is imported by every generated `*.auto.ts` file.
 *
 * Design goals:
 * - Keep generated files thin and deterministic.
 * - Centralize FHIR traversal, coercion, and string-building helpers.
 * - Provide small, composable primitives that are easy to unit-test.
 */

// this shape is written in the generated code
export interface ModuleSignature {
    title: string;
    filename: string;
    titleCamel: string;
    titlePascal: string;
    titleKebab: string;
    lhcFormResponseAdapterFnName: string;
    fhirQuestionnaireResponseAdapterFnName: string;
    sourceTextConstName: string;
}

/**
 * Searches through the top-level variables of an imported Deno module
 * to find and return the value of a variable whose name ends with 'ModuleSignature'.
 *
 * This function assumes that the 'ModuleSignature' variable is a top-level
 * 'export const' within the module, making it accessible as a property
 * of the imported module object.
 *
 * @param module The module object obtained from an `await import("./module.ts")` call.
 * @returns The value of the first variable found ending with 'ModuleSignature',
 * or `undefined` if no such variable is found.
 */
export function moduleSignature(
    module: Record<string, unknown>,
): ModuleSignature | undefined {
    // Iterate over all enumerable properties (which include exported variables)
    // of the imported module object.
    for (const key in module) {
        // Check if the current property key (variable name) ends with the
        // desired suffix 'ModuleSignature'.
        if (key.endsWith("ModuleSignature")) {
            // If a match is found, return the value associated with that key.
            // We return the first match found, as the requirement is to find "any variable".
            return module[key] as ModuleSignature;
        }
    }

    // If the loop completes and no matching variable is found, return undefined.
    return undefined;
}

/* ========================================================================== *
 * Types
 * ========================================================================== */

/** Minimal Coding representation used across helpers. */
export type FhirCoding = {
    system?: string;
    code?: string;
    display?: string;
};

/** Minimal Extension representation used across helpers. */
export type FhirExtension = {
    url: string;
    valueString?: string;
    valueInteger?: number;
    valueDecimal?: number;
    valueBoolean?: boolean;
    valueCoding?: FhirCoding;
    /** For `questionnaire-itemControl` we receive a CodeableConcept-like object. */
    valueCodeableConcept?: {
        text?: string;
        coding?: FhirCoding[];
    };
    [k: string]: unknown;
};

/** Minimal Questionnaire.item representation used across helpers. */
export type FhirQItem = {
    type: string; // 'group' | 'string' | 'text' | 'integer' | 'decimal' | 'boolean' | 'date' | 'dateTime' | 'choice' | 'display' | ...
    linkId: string;
    text?: string;
    item?: FhirQItem[];
    required?: boolean;
    extension?: FhirExtension[];
    answerOption?: Array<{
        valueString?: string;
        valueInteger?: number;
        valueCoding?: FhirCoding;
    }>;
    [k: string]: unknown;
};

/** Minimal Questionnaire resource shape for generation. */
export type FhirQuestionnaire = {
    resourceType: "Questionnaire";
    title?: string;
    name?: string;
    meta?: {
        profile?: string[];
    };
    item?: FhirQItem[];
    [k: string]: unknown;
};

/** Metadata captured for each emitted field in the generated interface. */
export type FieldMeta = {
    formTitleCamelCase: string; // Title of the form in camelCase
    formTitlePascalCase: string; // Title of the form in PascalCase
    propName: string;
    linkId: string;
    fhirType: string;
    tsType: string; // "string" | "number" | "boolean" | "Date" | string-literal union
    required: boolean;
    text?: string;
    entryFormat?: string;
    helpNotes?: string[];
    groupTrail: string[]; // Section/group titles encountered along the path
    choiceLiterals?: string[];
};

/* ========================================================================== *
 * Case & name utils
 * ========================================================================== */

/** Normalize any string to words split by non-alphanumerics. */
export function splitWords(s: string): string[] {
    return (s ?? "")
        .replace(/['’`]/g, "") // drop quotes
        .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
        .toLowerCase()
        .split(/[^a-z0-9]+/g)
        .filter(Boolean);
}

/** Convert to PascalCase. */
export function toPascalCase(s: string): string {
    const parts = splitWords(s);
    if (parts.length === 0) return "";
    return parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join("");
}

/** Convert to camelCase. */
export function toCamelCase(s: string): string {
    const pas = toPascalCase(s);
    return pas ? pas.charAt(0).toLowerCase() + pas.slice(1) : "";
}

/** Convert to kebab-case. */
export function toKebabCase(s: string): string {
    const parts = splitWords(s);
    return parts.join("-");
}

/**
 * Guarantee a unique property name by suffixing integers as needed.
 * Preserves the original base when possible.
 */
export function uniqueName(base: string, used: Set<string>): string {
    const name = base || "field";
    if (!used.has(name)) {
        used.add(name);
        return name;
    }
    let i = 2;
    while (used.has(`${name}${i}`)) i++;
    const finalName = `${name}${i}`;
    used.add(finalName);
    return finalName;
}

/* ========================================================================== *
 * FHIR helpers
 * ========================================================================== */

/** True when the item is a `display` of control type `help`. */
export function isDisplayHelp(item: FhirQItem): boolean {
    if (item.type !== "display") return false;
    const ext = item.extension ?? [];
    return ext.some((e) => {
        if (
            e.url !==
                "http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl"
        ) return false;
        const codings = e.valueCodeableConcept?.coding ?? [];
        return codings.some((c) => c.code === "help");
    });
}

/** Extract `entryFormat` extension value if present. */
export function getEntryFormat(item: FhirQItem): string | undefined {
    const ext = item.extension ?? [];
    const ef = ext.find((e) =>
        e.url === "http://hl7.org/fhir/StructureDefinition/entryFormat"
    );
    return ef?.valueString ?? undefined;
}

/**
 * Collect `choice` literals from `answerOption`.
 * Prefers `valueString`, else `valueCoding.code`, else numeric to string.
 */
export function collectChoiceLiterals(item: FhirQItem): string[] | undefined {
    if (item.type !== "choice" || !Array.isArray(item.answerOption)) {
        return undefined;
    }
    const vals = new Set<string>();
    for (const opt of item.answerOption) {
        if (typeof opt.valueString === "string") {
            vals.add(opt.valueString);
        } else if (opt.valueCoding) {
            const { code, display, system } = opt.valueCoding;
            if (code) vals.add(code);
            else if (display) vals.add(display);
            else if (system) vals.add(system);
        } else if (typeof opt.valueInteger === "number") {
            vals.add(String(opt.valueInteger));
        }
    }
    return vals.size ? Array.from(vals) : undefined;
}

/** Map FHIR primitive types to TypeScript types. */
export function fhirTypeToTs(fhirType: string): string {
    switch (fhirType) {
        case "integer":
        case "decimal":
            return "number";
        case "boolean":
            return "boolean";
        case "date":
        case "dateTime":
            return "Date";
        // FHIR "text" is a long string; treat as string
        case "string":
        case "text":
        default:
            return "string";
    }
}

/* ========================================================================== *
 * Traversal & extraction
 * ========================================================================== */

/**
 * Flatten Questionnaire items into an ordered list of FieldMeta.
 * Also aggregate any top-level or section-scoped help displays.
 */
export function flattenItems(
    titleCamelCase: string,
    titlePascalCase: string,
    items: FhirQItem[] | undefined,
    usedNames: Set<string>,
    trail: string[] = [],
    formHelp: string[] = [],
    acc: FieldMeta[] = [],
): { fields: FieldMeta[]; formHelp: string[] } {
    if (!Array.isArray(items)) {
        return { fields: acc, formHelp };
    }

    for (const it of items) {
        if (isDisplayHelp(it)) {
            if (it.text) formHelp.push(it.text);
            continue;
        }

        if (it.type === "group") {
            const nextTrail = it.text ? [...trail, it.text] : trail.slice();
            flattenItems(
                titleCamelCase,
                titlePascalCase,
                it.item,
                usedNames,
                nextTrail,
                formHelp,
                acc,
            );
            continue;
        }

        // Leaf question node
        const baseName = toCamelCase(it.text ?? it.linkId ?? "field");
        const propName = uniqueName(baseName, usedNames);
        const entryFormat = getEntryFormat(it);
        const choiceLits = collectChoiceLiterals(it);
        const tsType = choiceLits?.length
            ? choiceLits.map((s) => JSON.stringify(s)).join(" | ")
            : fhirTypeToTs(it.type);

        acc.push({
            formTitleCamelCase: titleCamelCase,
            formTitlePascalCase: titlePascalCase,
            propName,
            linkId: String(it.linkId),
            fhirType: it.type,
            tsType,
            required: it.required === true,
            text: it.text,
            entryFormat,
            helpNotes: undefined, // Reserved for future localized per-field help
            groupTrail: trail.slice(),
            choiceLiterals: choiceLits,
        });
    }

    return { fields: acc, formHelp };
}

/* ========================================================================== *
 * Coercers
 * ========================================================================== */

/** General blankness check used by validators. */
export function isBlank(v: unknown): boolean {
    if (v === null || v === undefined) return true;
    if (typeof v === "string") return v.trim().length === 0;
    if (Array.isArray(v)) return v.length === 0;
    if (v instanceof Date) return isNaN(v.getTime());
    if (typeof v === "number") return Number.isNaN(v);
    return false;
}

export function coerceString(v: unknown, defaultValue = ""): string {
    return coerceOptionalString(v) ?? defaultValue;
}

export function coerceNumber(v: unknown, defaultValue = 0): number {
    return coerceOptionalNumber(v) ?? defaultValue;
}

export function coerceBoolean(v: unknown, defaultValue = false): boolean {
    const value = coerceOptionalBoolean(v);
    return value !== undefined ? value : defaultValue;
}

export function coerceDate(v: unknown, defaultValue = new Date()): Date {
    return coerceOptionalDate(v) ?? defaultValue;
}

export function coerceOptionalString(v: unknown): string | undefined {
    if (v === null || v === undefined) return undefined;
    if (typeof v === "string") return v;
    if (typeof v === "number" || typeof v === "boolean") return String(v);
    if (v instanceof Date && !isNaN(v.getTime())) return v.toISOString();
    return undefined;
}

export function coerceOptionalNumber(v: unknown): number | undefined {
    if (v === null || v === undefined) return undefined;
    if (typeof v === "number" && !Number.isNaN(v)) return v;
    if (typeof v === "string" && v.trim().length) {
        const n = Number(v);
        return Number.isNaN(n) ? undefined : n;
    }
    return undefined;
}

export function coerceOptionalBoolean(v: unknown): boolean | undefined {
    if (v === null || v === undefined) return undefined;
    if (typeof v === "boolean") return v;
    if (typeof v === "string") {
        const s = v.trim().toLowerCase();
        if (["true", "t", "yes", "y", "1"].includes(s)) return true;
        if (["false", "f", "no", "n", "0"].includes(s)) return false;
    }
    if (typeof v === "number") {
        if (v === 1) return true;
        if (v === 0) return false;
    }
    return undefined;
}

export function coerceOptionalDate(v: unknown): Date | undefined {
    if (v === null || v === undefined) return undefined;
    if (v instanceof Date && !isNaN(v.getTime())) return v;
    if (typeof v === "string" || typeof v === "number") {
        const d = new Date(v);
        return isNaN(d.getTime()) ? undefined : d;
    }
    return undefined;
}

/* ========================================================================== *
 * Adapter helpers (finders)
 * ========================================================================== */

// deno-lint-ignore no-explicit-any
export function lhcFormTitle(node: any) {
    if (!node) return undefined;
    return node.title ?? node.name;
}

/**
 * Depth-first search within an LHC JSON object to find an item's `value` by linkId.
 * Expects an object with an `items` array where each element can contain nested `items`.
 */
// deno-lint-ignore no-explicit-any
export function findLhcValueByLinkId(node: any, linkId: string): unknown {
    if (!node) return undefined;
    // deno-lint-ignore no-explicit-any
    const items: any[] = Array.isArray(node)
        ? node
        : Array.isArray(node.items)
        ? node.items
        : [];
    for (const it of items) {
        if (it?.linkId === linkId) {
            return "value" in it ? it.value : undefined;
        }
        const nested = findLhcValueByLinkId(it?.items ?? [], linkId);
        if (nested !== undefined) return nested;
    }
    return undefined;
}

/**
 * Depth-first search within a QuestionnaireResponse to get the first answer's scalar.
 * Prefers valueCoding.code, then display, then system when coding present.
 */
// deno-lint-ignore no-explicit-any
export function findQrAnswerByLinkId(qr: any, linkId: string): unknown {
    if (!qr) return undefined;
    // deno-lint-ignore no-explicit-any
    const stack: any[] = [];
    if (Array.isArray(qr.item)) stack.push(...qr.item);

    while (stack.length) {
        const it = stack.pop();
        if (!it) continue;
        if (
            it.linkId === linkId && Array.isArray(it.answer) && it.answer.length
        ) {
            const a = it.answer[0];
            if (!a) return undefined;
            // Prioritize coding then scalar primitives
            if (a.valueCoding) {
                const c = a.valueCoding as FhirCoding;
                return c.code ?? c.display ?? c.system ?? undefined;
            }
            for (const k of Object.keys(a)) {
                if (!k.startsWith("value")) continue;
                // deno-lint-ignore no-explicit-any
                const val = (a as any)[k];
                if (val !== undefined) return val;
            }
            return undefined;
        }
        if (Array.isArray(it.item)) stack.push(...it.item);
    }
    return undefined;
}
