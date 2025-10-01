import { zod as z } from "./deps.ts";
import { open, strict } from "./commons.ts";

/* ──────────────────────────────────────────────────────────────────────────
 * Shared FHIR primitives (only what Questionnaire needs)
 * ────────────────────────────────────────────────────────────────────────── */

export const fhirIdSchema = z.string();
export const fhirUriSchema = z.string();
export const fhirCanonicalSchema = z.string();
export const fhirMarkdownSchema = z.string();
export const fhirDateSchema = z.string();
export const fhirDateTimeSchema = z.string();
export const fhirTimeSchema = z.string();

const codingShape = {
  system: z.string().optional(),
  version: z.string().optional(),
  code: z.string().optional(),
  display: z.string().optional(),
  userSelected: z.boolean().optional(),
} as const;
export const codingSchema = open(codingShape);
export const codingStrictSchema = strict(codingShape);

const codeableConceptShape = {
  coding: z.array(codingSchema).optional(),
  text: z.string().optional(),
} as const;
export const codeableConceptSchema = open(codeableConceptShape);
export const codeableConceptStrictSchema = strict({
  ...codeableConceptShape,
  coding: z.array(codingStrictSchema).optional(),
});

const quantityShape = {
  value: z.number().optional(),
  comparator: z.enum(["<", "<=", ">=", ">"]).optional(),
  unit: z.string().optional(),
  system: z.string().optional(),
  code: z.string().optional(),
} as const;
export const quantitySchema = open(quantityShape);
export const quantityStrictSchema = strict(quantityShape);

const periodShape = {
  start: fhirDateTimeSchema.optional(),
  end: fhirDateTimeSchema.optional(),
} as const;
export const periodSchema = open(periodShape);
export const periodStrictSchema = strict(periodShape);

const identifierShape = {
  use: z.enum(["usual", "official", "temp", "secondary", "old"]).optional(),
  type: codeableConceptSchema.optional(),
  system: z.string().optional(),
  value: z.string().optional(),
  period: periodSchema.optional(),
  assigner: open({
    reference: z.string().optional(),
    display: z.string().optional(),
  }).optional(),
} as const;
export const identifierSchema = open(identifierShape);
export const identifierStrictSchema = strict({
  ...identifierShape,
  type: codeableConceptStrictSchema.optional(),
  period: periodStrictSchema.optional(),
  assigner: strict({
    reference: z.string().optional(),
    display: z.string().optional(),
  }).optional(),
});

const referenceShape = {
  reference: z.string().optional(),
  type: z.string().optional(),
  identifier: identifierSchema.optional(),
  display: z.string().optional(),
} as const;
export const referenceSchema = open(referenceShape);
export const referenceStrictSchema = strict({
  ...referenceShape,
  identifier: identifierStrictSchema.optional(),
});

const narrativeShape = {
  status: z.enum(["generated", "extensions", "additional", "empty"]),
  div: z.string(),
} as const;
export const narrativeSchema = open(narrativeShape);
export const narrativeStrictSchema = strict(narrativeShape);

const contactPointShape = {
  system: z.enum(["phone", "fax", "email", "pager", "url", "sms", "other"])
    .optional(),
  value: z.string().optional(),
  use: z.enum(["home", "work", "temp", "old", "mobile"]).optional(),
  rank: z.number().int().optional(),
  period: periodSchema.optional(),
} as const;
export const contactPointSchema = open(contactPointShape);
export const contactPointStrictSchema = strict({
  ...contactPointShape,
  period: periodStrictSchema.optional(),
});

const contactDetailShape = {
  name: z.string().optional(),
  telecom: z.array(contactPointSchema).optional(),
} as const;
export const contactDetailSchema = open(contactDetailShape);
export const contactDetailStrictSchema = strict({
  ...contactDetailShape,
  telecom: z.array(contactPointStrictSchema).optional(),
});

const usageContextShape = {
  code: codingSchema,
  valueCodeableConcept: codeableConceptSchema.optional(),
  valueQuantity: quantitySchema.optional(),
  valueRange: open({
    low: quantitySchema.optional(),
    high: quantitySchema.optional(),
  }).optional(),
  valueReference: referenceSchema.optional(),
} as const;
export const usageContextSchema = open(usageContextShape);
export const usageContextStrictSchema = strict({
  code: codingStrictSchema,
  valueCodeableConcept: codeableConceptStrictSchema.optional(),
  valueQuantity: quantityStrictSchema.optional(),
  valueRange: strict({
    low: quantityStrictSchema.optional(),
    high: quantityStrictSchema.optional(),
  }).optional(),
  valueReference: referenceStrictSchema.optional(),
});

const metaShape = {
  versionId: z.string().optional(),
  lastUpdated: fhirDateTimeSchema.optional(),
  source: z.string().optional(),
  profile: z.array(fhirCanonicalSchema).optional(),
  security: z.array(codingSchema).optional(),
  tag: z.array(codingSchema).optional(),
} as const;
export const metaSchema = open(metaShape);
export const metaStrictSchema = strict({
  ...metaShape,
  security: z.array(codingStrictSchema).optional(),
  tag: z.array(codingStrictSchema).optional(),
});

const extensionShape = {
  url: z.string(),
  valueBoolean: z.boolean().optional(),
  valueInteger: z.number().int().optional(),
  valueDecimal: z.number().optional(),
  valueString: z.string().optional(),
  valueUri: fhirUriSchema.optional(),
  valueCoding: codingSchema.optional(),
  valueCodeableConcept: codeableConceptSchema.optional(),
  valueDate: fhirDateSchema.optional(),
  valueDateTime: fhirDateTimeSchema.optional(),
  valueTime: fhirTimeSchema.optional(),
  valueQuantity: quantitySchema.optional(),
  valueReference: referenceSchema.optional(),
  valueExpression: z.object({
    name: z.string().optional(),
    language: z.string().optional(),
    expression: z.string().optional(),
  }).optional(),
} as const;
export const extensionSchema = open(extensionShape);
export const extensionStrictSchema = strict({
  ...extensionShape,
  valueCoding: codingStrictSchema.optional(),
  valueCodeableConcept: codeableConceptStrictSchema.optional(),
  valueQuantity: quantityStrictSchema.optional(),
  valueReference: referenceStrictSchema.optional(),
  valueExpression: z.object({
    name: z.string().optional(),
    language: z.string().optional(),
    expression: z.string().optional(),
  }).optional(),
});

/* ──────────────────────────────────────────────────────────────────────────
 * Questionnaire (open + strict)
 * ────────────────────────────────────────────────────────────────────────── */

export const questionnaireItemTypeSchema = z.enum([
  "group",
  "display",
  "boolean",
  "decimal",
  "integer",
  "date",
  "dateTime",
  "time",
  "string",
  "text",
  "url",
  "choice",
  "open-choice",
  "attachment",
  "reference",
  "quantity",
]);

export const questionnaireEnableOperatorSchema = z.enum([
  "exists",
  "=",
  "!=",
  " >",
  ">=",
  "<",
  "<=",
]); // keep tight but resilient to accidental spaces

// value[x] unions — OPEN & STRICT (for answerOption and initial)
const oneOfAnswerValueOpenSchema = z.union([
  open({ valueBoolean: z.boolean() }),
  open({ valueDecimal: z.number() }),
  open({ valueInteger: z.number().int() }),
  open({ valueDate: fhirDateSchema }),
  open({ valueDateTime: fhirDateTimeSchema }),
  open({ valueTime: fhirTimeSchema }),
  open({ valueString: z.string() }),
  open({ valueCoding: codingSchema }),
  open({ valueQuantity: quantitySchema }),
  open({ valueReference: referenceSchema }),
]);

const oneOfAnswerValueStrictSchema = z.union([
  strict({ valueBoolean: z.boolean() }),
  strict({ valueDecimal: z.number() }),
  strict({ valueInteger: z.number().int() }),
  strict({ valueDate: fhirDateSchema }),
  strict({ valueDateTime: fhirDateTimeSchema }),
  strict({ valueTime: fhirTimeSchema }),
  strict({ valueString: z.string() }),
  strict({ valueCoding: codingStrictSchema }),
  strict({ valueQuantity: quantityStrictSchema }),
  strict({ valueReference: referenceStrictSchema }),
]);

// answer[x] unions — OPEN & STRICT (for enableWhen)
const oneOfEnableWhenAnswerValueOpenSchema = z.union([
  open({ answerBoolean: z.boolean() }),
  open({ answerDecimal: z.number() }),
  open({ answerInteger: z.number().int() }),
  open({ answerDate: fhirDateSchema }),
  open({ answerDateTime: fhirDateTimeSchema }),
  open({ answerTime: fhirTimeSchema }),
  open({ answerString: z.string() }),
  open({ answerCoding: codingSchema }),
  open({ answerQuantity: quantitySchema }),
  open({ answerReference: referenceSchema }),
]);

const oneOfEnableWhenAnswerValueStrictSchema = z.union([
  strict({ answerBoolean: z.boolean() }),
  strict({ answerDecimal: z.number() }),
  strict({ answerInteger: z.number().int() }),
  strict({ answerDate: fhirDateSchema }),
  strict({ answerDateTime: fhirDateTimeSchema }),
  strict({ answerTime: fhirTimeSchema }),
  strict({ answerString: z.string() }),
  strict({ answerCoding: codingStrictSchema }),
  strict({ answerQuantity: quantityStrictSchema }),
  strict({ answerReference: referenceStrictSchema }),
]);

// enableWhen — OPEN & STRICT (second branch excludes 'exists')
const questionnaireItemEnableWhenOpenSchema = z.union([
  open({
    question: z.string(),
    operator: z.literal("exists"),
    answerBoolean: z.boolean().nullable().optional(),
    valueExpression: z.object({
      name: z.string().optional(),
      language: z.string().optional(),
      expression: z.string().optional(),
    }).optional(),
  }),
  open({
    question: z.string(),
    operator: questionnaireEnableOperatorSchema.refine(
      (op) => op !== "exists",
      {
        message: "operator must not be 'exists' in this branch",
      },
    ),
    valueExpression: z.object({
      name: z.string().optional(),
      language: z.string().optional(),
      expression: z.string().optional(),
    }).optional(),
  }).and(oneOfEnableWhenAnswerValueOpenSchema),
]);

const questionnaireItemEnableWhenStrictSchema = z.union([
  strict({
    question: z.string(),
    operator: z.literal("exists"),
    answerBoolean: z.boolean().nullable().optional(),
    valueExpression: z.object({
      name: z.string().optional(),
      language: z.string().optional(),
      expression: z.string().optional(),
    }).optional(),
  }),
  strict({
    question: z.string(),
    operator: questionnaireEnableOperatorSchema.refine(
      (op) => op !== "exists",
      {
        message: "operator must not be 'exists' in this branch",
      },
    ),
    valueExpression: z.object({
      name: z.string().optional(),
      language: z.string().optional(),
      expression: z.string().optional(),
    }).optional(),
  }).and(oneOfEnableWhenAnswerValueStrictSchema),
]);

// answerOption — need to ADD `initialSelected` to each union branch (no .shape!)
const answerOptionInitialOpenSchema = open({
  initialSelected: z.boolean().optional(),
  extension: z.array(extensionSchema).optional(),
});
const answerOptionInitialStrictSchema = strict({
  initialSelected: z.boolean().optional(),
  extension: z.array(extensionStrictSchema).optional(),
});

const questionnaireItemAnswerOptionOpenSchema = z.union(
  oneOfAnswerValueOpenSchema.options.map((opt) =>
    opt.and(answerOptionInitialOpenSchema)
  ) as unknown as [z.ZodTypeAny, z.ZodTypeAny], // satisfies tuple requirement; union supports >=2
);

const questionnaireItemAnswerOptionStrictSchema = z.union(
  oneOfAnswerValueStrictSchema.options.map((opt) =>
    opt.and(answerOptionInitialStrictSchema)
  ) as unknown as [z.ZodTypeAny, z.ZodTypeAny],
);

// initial — just the value[x] union
const questionnaireItemInitialOpenSchema = oneOfAnswerValueOpenSchema;
const questionnaireItemInitialStrictSchema = oneOfAnswerValueStrictSchema;

/** Strong TS shape for an OPEN Questionnaire.item (unknowns retained) */
export type QuestionnaireItem = {
  linkId: string;
  definition?: z.infer<typeof fhirUriSchema>;
  code?: z.infer<typeof codingSchema>[];
  prefix?: string;
  text?: string;
  type: z.infer<typeof questionnaireItemTypeSchema>;

  enableWhen?: z.infer<typeof questionnaireItemEnableWhenOpenSchema>[];
  enableBehavior?: "all" | "any";

  required?: boolean;
  repeats?: boolean;
  readOnly?: boolean;
  maxLength?: number;

  answerValueSet?: z.infer<typeof fhirCanonicalSchema>;
  answerOption?: z.infer<typeof questionnaireItemAnswerOptionOpenSchema>[];
  initial?: z.infer<typeof questionnaireItemInitialOpenSchema>[];

  item?: QuestionnaireItem[]; // recursion
  extension?: z.infer<typeof extensionSchema>[];
  modifierExtension?: z.infer<typeof extensionSchema>[];
} & Record<string, unknown>; // open objects retain unknown keys

/** Strong TS shape for a STRICT Questionnaire.item (no unknown keys) */
export type QuestionnaireItemStrict = Omit<
  QuestionnaireItem,
  keyof Record<string, unknown>
>;

/* OPEN recursive schema (now typed) */
export const questionnaireItemSchema: z.ZodType<QuestionnaireItem> = z.lazy(
  () =>
    open({
      linkId: z.string(),
      definition: fhirUriSchema.optional(),
      code: z.array(codingSchema).optional(),
      prefix: z.string().optional(),
      text: z.string().optional(),
      type: questionnaireItemTypeSchema,

      enableWhen: z.array(questionnaireItemEnableWhenOpenSchema)
        .optional(),
      enableBehavior: z.enum(["all", "any"]).optional(),

      required: z.boolean().optional(),
      repeats: z.boolean().optional(),
      readOnly: z.boolean().optional(),
      maxLength: z.number().int().optional(),

      answerValueSet: fhirCanonicalSchema.optional(),
      answerOption: z.array(questionnaireItemAnswerOptionOpenSchema)
        .optional(),
      initial: z.array(questionnaireItemInitialOpenSchema).optional(),

      item: z.array(z.lazy(() => questionnaireItemSchema)).optional(),

      extension: z.array(extensionSchema).optional(),
      modifierExtension: z.array(extensionSchema).optional(),
    }),
);

/* STRICT recursive schema (now typed) */
export const questionnaireItemStrictSchema: z.ZodType<QuestionnaireItemStrict> =
  z.lazy(() =>
    strict({
      linkId: z.string(),
      definition: fhirUriSchema.optional(),
      code: z.array(codingStrictSchema).optional(),
      prefix: z.string().optional(),
      text: z.string().optional(),
      type: questionnaireItemTypeSchema,

      enableWhen: z.array(questionnaireItemEnableWhenStrictSchema)
        .optional(),
      enableBehavior: z.enum(["all", "any"]).optional(),

      required: z.boolean().optional(),
      repeats: z.boolean().optional(),
      readOnly: z.boolean().optional(),
      maxLength: z.number().int().optional(),

      answerValueSet: fhirCanonicalSchema.optional(),
      answerOption: z.array(questionnaireItemAnswerOptionStrictSchema)
        .optional(),
      initial: z.array(questionnaireItemInitialStrictSchema).optional(),

      item: z.array(z.lazy(() => questionnaireItemStrictSchema))
        .optional(),

      extension: z.array(extensionStrictSchema).optional(),
      modifierExtension: z.array(extensionStrictSchema).optional(),
    }).strict()
  );

// Status
const questionnaireStatusSchema = z.enum([
  "draft",
  "active",
  "retired",
  "unknown",
]);

// Root — OPEN & STRICT
export const questionnaireSchema = open({
  resourceType: z.literal("Questionnaire"),
  id: fhirIdSchema.optional(),
  meta: metaSchema.optional(),
  implicitRules: fhirUriSchema.optional(),
  language: z.string().optional(),
  text: narrativeSchema.optional(),
  contained: z.array(z.record(z.string(), z.unknown())).optional(),

  extension: z.array(extensionSchema).optional(),
  modifierExtension: z.array(extensionSchema).optional(),

  url: fhirCanonicalSchema.optional(),
  identifier: z.array(identifierSchema).optional(),
  version: z.string().optional(),
  name: z.string().optional(),
  title: z.string().optional(),
  derivedFrom: z.array(fhirCanonicalSchema).optional(),
  status: questionnaireStatusSchema,
  experimental: z.boolean().optional(),
  subjectType: z.array(z.string()).optional(),
  date: fhirDateTimeSchema.optional(),
  publisher: z.string().optional(),
  contact: z.array(contactDetailSchema).optional(),
  description: fhirMarkdownSchema.optional(),
  useContext: z.array(usageContextSchema).optional(),
  jurisdiction: z.array(codeableConceptSchema).optional(),
  purpose: fhirMarkdownSchema.optional(),
  copyright: fhirMarkdownSchema.optional(),
  approvalDate: fhirDateSchema.optional(),
  lastReviewDate: fhirDateSchema.optional(),
  effectivePeriod: periodSchema.optional(),
  code: z.array(codingSchema).optional(),

  item: z.array(questionnaireItemSchema).optional(),
});

export const questionnaireStrictSchema = strict({
  resourceType: z.literal("Questionnaire"),
  id: fhirIdSchema.optional(),
  meta: metaStrictSchema.optional(),
  implicitRules: fhirUriSchema.optional(),
  language: z.string().optional(),
  text: narrativeStrictSchema.optional(),
  contained: z.array(z.record(z.string(), z.unknown())).optional(),

  extension: z.array(extensionStrictSchema).optional(),
  modifierExtension: z.array(extensionStrictSchema).optional(),

  url: fhirCanonicalSchema.optional(),
  identifier: z.array(identifierStrictSchema).optional(),
  version: z.string().optional(),
  name: z.string().optional(),
  title: z.string().optional(),
  derivedFrom: z.array(fhirCanonicalSchema).optional(),
  status: questionnaireStatusSchema,
  experimental: z.boolean().optional(),
  subjectType: z.array(z.string()).optional(),
  date: fhirDateTimeSchema.optional(),
  publisher: z.string().optional(),
  contact: z.array(contactDetailStrictSchema).optional(),
  description: fhirMarkdownSchema.optional(),
  useContext: z.array(usageContextStrictSchema).optional(),
  jurisdiction: z.array(codeableConceptStrictSchema).optional(),
  purpose: fhirMarkdownSchema.optional(),
  copyright: fhirMarkdownSchema.optional(),
  approvalDate: fhirDateSchema.optional(),
  lastReviewDate: fhirDateSchema.optional(),
  effectivePeriod: periodStrictSchema.optional(),
  code: z.array(codingStrictSchema).optional(),

  item: z.array(questionnaireItemStrictSchema).optional(),
});

/** Types (PascalCase) */
export type Questionnaire = z.infer<typeof questionnaireSchema>;
export type QuestionnaireStrict = z.infer<typeof questionnaireStrictSchema>;

/* ──────────────────────────────────────────────────────────────────────────
 * Attachment (used by answer.valueAttachment)
 * ────────────────────────────────────────────────────────────────────────── */

const attachmentShape = {
  contentType: z.string().optional(),
  language: z.string().optional(),
  data: z.string().optional(), // base64
  url: z.string().optional(),
  size: z.number().int().optional(),
  hash: z.string().optional(), // base64
  title: z.string().optional(),
  creation: fhirDateTimeSchema.optional(),
} as const;

export const attachmentSchema = open(attachmentShape);
export const attachmentStrictSchema = strict(attachmentShape);

/* ──────────────────────────────────────────────────────────────────────────
 * Status enum
 * ────────────────────────────────────────────────────────────────────────── */

export const questionnaireResponseStatusSchema = z.enum([
  "in-progress",
  "completed",
  "amended",
  "entered-in-error",
  "stopped",
]);

/* ──────────────────────────────────────────────────────────────────────────
 * answer.value[x] – OPEN & STRICT unions
 * ────────────────────────────────────────────────────────────────────────── */

const qrAnswerValueOpenSchema = z.union([
  open({ valueBoolean: z.boolean() }),
  open({ valueDecimal: z.number() }),
  open({ valueInteger: z.number().int() }),
  open({ valueDate: fhirDateSchema }),
  open({ valueDateTime: fhirDateTimeSchema }),
  open({ valueTime: fhirTimeSchema }),
  open({ valueString: z.string() }),
  open({ valueCoding: codingSchema }),
  open({ valueQuantity: quantitySchema }),
  open({ valueReference: referenceSchema }),
  open({ valueAttachment: attachmentSchema }),
]);

/* ──────────────────────────────────────────────────────────────────────────
 * QuestionnaireResponse.item.answer – OPEN & STRICT
 * (we add tail fields to each union member via .and(...))
 * ────────────────────────────────────────────────────────────────────────── */

const answerTailOpenSchema = open({
  // nested items allowed when an answer opens sub-questions
  item: z.array(z.lazy(() => questionnaireResponseItemSchema)).optional(),
  extension: z.array(extensionSchema).optional(),
  modifierExtension: z.array(extensionSchema).optional(),
});

const answerTailStrictShape = {
  item: z.array(z.lazy(() => questionnaireResponseItemStrictSchema))
    .optional(),
  extension: z.array(extensionStrictSchema).optional(),
  modifierExtension: z.array(extensionStrictSchema).optional(),
} as const;

// helper: merge a value[x] shape with the strict tail, producing a strict object
const withAnswerTailStrict = <S extends z.ZodRawShape>(s: S) =>
  z.object({ ...s, ...answerTailStrictShape }).strict();

// Strict union: each branch has its own value[x] plus the tail fields
export const questionnaireResponseItemAnswerStrictSchema = z.union([
  withAnswerTailStrict({ valueBoolean: z.boolean() }),
  withAnswerTailStrict({ valueDecimal: z.number() }),
  withAnswerTailStrict({ valueInteger: z.number().int() }),
  withAnswerTailStrict({ valueDate: fhirDateSchema }),
  withAnswerTailStrict({ valueDateTime: fhirDateTimeSchema }),
  withAnswerTailStrict({ valueTime: fhirTimeSchema }),
  withAnswerTailStrict({ valueString: z.string() }),
  withAnswerTailStrict({ valueCoding: codingStrictSchema }),
  withAnswerTailStrict({ valueQuantity: quantityStrictSchema }),
  withAnswerTailStrict({ valueReference: referenceStrictSchema }),
  withAnswerTailStrict({ valueAttachment: attachmentStrictSchema }),
]);

export const questionnaireResponseItemAnswerOpenMembers =
  qrAnswerValueOpenSchema.options.map((opt) =>
    opt.and(answerTailOpenSchema)
  ) as unknown as [z.ZodTypeAny, z.ZodTypeAny];

export const questionnaireResponseItemAnswerSchema = z.union(
  questionnaireResponseItemAnswerOpenMembers,
);

/* ──────────────────────────────────────────────────────────────────────────
 * QuestionnaireResponse.item – OPEN & STRICT (recursive)
 * ────────────────────────────────────────────────────────────────────────── */

export const questionnaireResponseItemSchema: z.ZodTypeAny = z.lazy(() =>
  open({
    linkId: z.string(),
    definition: fhirUriSchema.optional(),
    text: z.string().optional(),

    answer: z.array(questionnaireResponseItemAnswerSchema).optional(),
    item: z.array(z.lazy(() => questionnaireResponseItemSchema)).optional(),

    extension: z.array(extensionSchema).optional(),
    modifierExtension: z.array(extensionSchema).optional(),
  })
);

export const questionnaireResponseItemStrictSchema: z.ZodTypeAny = z.lazy(() =>
  strict({
    linkId: z.string(),
    definition: fhirUriSchema.optional(),
    text: z.string().optional(),

    answer: z.array(questionnaireResponseItemAnswerStrictSchema).optional(),
    item: z.array(z.lazy(() => questionnaireResponseItemStrictSchema))
      .optional(),

    extension: z.array(extensionStrictSchema).optional(),
    modifierExtension: z.array(extensionStrictSchema).optional(),
  })
);

/* ──────────────────────────────────────────────────────────────────────────
 * QuestionnaireResponse root – OPEN & STRICT
 * ────────────────────────────────────────────────────────────────────────── */

export const questionnaireResponseSchema = open({
  resourceType: z.literal("QuestionnaireResponse"),

  id: fhirIdSchema.optional(),
  meta: metaSchema.optional(),
  implicitRules: fhirUriSchema.optional(),
  language: z.string().optional(),
  text: narrativeSchema.optional(),
  contained: z.array(z.record(z.string(), z.unknown())).optional(),

  extension: z.array(extensionSchema).optional(),
  modifierExtension: z.array(extensionSchema).optional(),

  identifier: identifierSchema.optional(),
  basedOn: z.array(referenceSchema).optional(),
  partOf: z.array(referenceSchema).optional(),

  questionnaire: fhirCanonicalSchema.optional(),
  status: questionnaireResponseStatusSchema,

  subject: referenceSchema.optional(),
  encounter: referenceSchema.optional(),
  authored: fhirDateTimeSchema.optional(),
  author: referenceSchema.optional(),
  source: referenceSchema.optional(),

  item: z.array(questionnaireResponseItemSchema).optional(),
});

export const questionnaireResponseStrictSchema = strict({
  resourceType: z.literal("QuestionnaireResponse"),

  id: fhirIdSchema.optional(),
  meta: metaStrictSchema.optional(),
  implicitRules: fhirUriSchema.optional(),
  language: z.string().optional(),
  text: narrativeStrictSchema.optional(),
  contained: z.array(z.record(z.string(), z.unknown())).optional(),

  extension: z.array(extensionStrictSchema).optional(),
  modifierExtension: z.array(extensionStrictSchema).optional(),

  identifier: identifierStrictSchema.optional(),
  basedOn: z.array(referenceStrictSchema).optional(),
  partOf: z.array(referenceStrictSchema).optional(),

  questionnaire: fhirCanonicalSchema.optional(),
  status: questionnaireResponseStatusSchema,

  subject: referenceStrictSchema.optional(),
  encounter: referenceStrictSchema.optional(),
  authored: fhirDateTimeSchema.optional(),
  author: referenceStrictSchema.optional(),
  source: referenceStrictSchema.optional(),

  item: z.array(questionnaireResponseItemStrictSchema).optional(),
});

/* ──────────────────────────────────────────────────────────────────────────
 * Types (PascalCase)
 * ────────────────────────────────────────────────────────────────────────── */

export type QuestionnaireResponse = z.infer<typeof questionnaireResponseSchema>;
export type QuestionnaireResponseStrict = z.infer<
  typeof questionnaireResponseStrictSchema
>;
