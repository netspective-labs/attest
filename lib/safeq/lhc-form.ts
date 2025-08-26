import { zod as z } from "./deps.ts";
import { open, strict } from "./commons.ts";

/* ──────────────────────────────────────────────────────────────────────────
 * LHC Form — leaf shapes & schemas
 * ────────────────────────────────────────────────────────────────────────── */

export const lhcDataTypeSchema = z.enum([
    "ST", // string
    "TX", // text / long string
    "INT", // integer
    "REAL", // decimal
    "DT", // date
    "DTM", // dateTime
    "TM", // time
    "BL", // boolean
    "CNE", // coded, single select (no exceptions)
    "CWE", // coded, multi/with exceptions
    "QTY", // quantity with units
    "URL", // URL
]);

// Answer choice
const lhcAnswerShape = {
    text: z.string(),
    code: z.string().optional(),
    system: z.string().optional(),
    score: z.number().optional(),
} as const;
export const lhcAnswerSchema = open(lhcAnswerShape);
export const lhcAnswerStrictSchema = strict(lhcAnswerShape);

// Unit (UCUM, etc.)
const lhcUnitShape = {
    name: z.string(),
    code: z.string().optional(),
    system: z.string().optional(),
    default: z.boolean().optional(),
    normalRange: z.unknown().optional(),
    absoluteRange: z.unknown().optional(),
} as const;
export const lhcUnitSchema = open(lhcUnitShape);
export const lhcUnitStrictSchema = strict(lhcUnitShape);

// Cardinality
const lhcCardinalityShape = {
    min: z.number().int().nonnegative().default(0),
    max: z.union([z.number().int().nonnegative(), z.literal("*")]).default(1),
} as const;
export const lhcCardinalitySchema = open(lhcCardinalityShape);
export const lhcCardinalityStrictSchema = strict(lhcCardinalityShape);

// Skip condition & logic
const lhcSkipConditionShape = {
    source: z.string(),
    operator: z.enum(["exists", "=", "!=", ">", ">=", "<", "<="]),
    value: z.unknown().optional(),
} as const;
export const lhcSkipConditionSchema = open(lhcSkipConditionShape);
export const lhcSkipConditionStrictSchema = strict(lhcSkipConditionShape);

const lhcSkipLogicShape = {
    action: z.enum(["show", "hide"]).default("show"),
    conditions: z.array(lhcSkipConditionSchema).min(1),
    logic: z.enum(["all", "any"]).default("all"),
} as const;
export const lhcSkipLogicSchema = open(lhcSkipLogicShape);
export const lhcSkipLogicStrictSchema = strict({
    ...lhcSkipLogicShape,
    conditions: z.array(lhcSkipConditionStrictSchema).min(1),
});

/* ──────────────────────────────────────────────────────────────────────────
 * LHC Form — recursive item (open & strict)
 * ────────────────────────────────────────────────────────────────────────── */

export const lhcItemSchema: z.ZodTypeAny = z.lazy(() =>
    open({
        // identity/label
        linkId: z.string().optional(),
        questionCode: z.string().optional(),
        questionCodeSystem: z.string().optional(),
        question: z.string().optional(),

        // typing & constraints
        dataType: lhcDataTypeSchema.optional(),
        cardinality: lhcCardinalitySchema.optional(),
        required: z.boolean().optional(),
        readOnly: z.boolean().optional(),
        min: z.number().optional(),
        max: z.number().optional(),
        maxLength: z.number().int().optional(),

        // coded & units
        answers: z.array(lhcAnswerSchema).optional(),
        units: z.array(lhcUnitSchema).optional(),

        // behavior / UI
        skipLogic: lhcSkipLogicSchema.optional(),
        displayControl: z.record(z.string(), z.unknown()).optional(),
        templateOptions: z.record(z.string(), z.unknown()).optional(),

        // children
        items: z.array(z.lazy(() => lhcItemSchema)).optional(),
    })
);

export const lhcItemStrictSchema: z.ZodTypeAny = z.lazy(() =>
    strict({
        linkId: z.string().optional(),
        questionCode: z.string().optional(),
        questionCodeSystem: z.string().optional(),
        question: z.string().optional(),

        dataType: lhcDataTypeSchema.optional(),
        cardinality: lhcCardinalityStrictSchema.optional(),
        required: z.boolean().optional(),
        readOnly: z.boolean().optional(),
        min: z.number().optional(),
        max: z.number().optional(),
        maxLength: z.number().int().optional(),

        answers: z.array(lhcAnswerStrictSchema).optional(),
        units: z.array(lhcUnitStrictSchema).optional(),

        skipLogic: lhcSkipLogicStrictSchema.optional(),
        displayControl: z.record(z.string(), z.unknown()).optional(),
        templateOptions: z.record(z.string(), z.unknown()).optional(),

        items: z.array(z.lazy(() => lhcItemStrictSchema)).optional(),
    })
);

/* ──────────────────────────────────────────────────────────────────────────
 * LHC Form — root (open & strict)
 * ────────────────────────────────────────────────────────────────────────── */

const lhcFormShape = {
    name: z.string(),
    title: z.string().optional(),
    code: z.string().optional(),
    codeSystem: z.string().optional(),
    codeSystemName: z.string().optional(),
    version: z.string().optional(),

    templateOptions: z.record(z.string(), z.unknown()).optional(),

    items: z.array(lhcItemSchema).default([]),
} as const;

export const lhcFormSchema = open(lhcFormShape);

export const lhcFormStrictSchema = strict({
    ...lhcFormShape,
    items: z.array(lhcItemStrictSchema).default([]),
});

/* ──────────────────────────────────────────────────────────────────────────
 * Types (PascalCase)
 * ────────────────────────────────────────────────────────────────────────── */

export type LhcForm = z.infer<typeof lhcFormSchema>;
export type LhcFormStrict = z.infer<typeof lhcFormStrictSchema>;
