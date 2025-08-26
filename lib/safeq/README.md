# Attest `safeq` — FHIR R4 Questionnaire → Type-Safe Module Generator

> See FHIR R4 Questionnaire & LHC Form structures in
> `fhir-r4-questionnaire-lhc-form-structure.md` for the raw JSON shapes.

This guide walks you from simple usage to advanced customization to turn a FHIR
Questionnaire into a standalone TypeScript module that exports a Zod schema
describing the typed content of that questionnaire. It also shows how to parse
either LHC Form answers or a FHIR QuestionnaireResponse into that typed shape.

## Quick Start

1. Compile your Questionnaire JSON → a runtime compiler produces a typed model
   and a parser:

```ts
import { compileQuestionnaire } from "./mod.ts";
import qDef from "./questionnaires/patient-intake.json" with { type: "json" };

const compiled = compileQuestionnaire(qDef);
// compiled.schema: Zod schema for normalized DTO (runtime)
// compiled.parse(): (LHC answers | QuestionnaireResponse) -> DTO
```

2. Emit a standalone Zod module (no FHIR deps) you can commit alongside your
   code:

```ts
import { emitZodTs } from "./mod.ts";

const { tsCode } = emitZodTs(compiled, {
    schemaTsIdentifier: "patientIntakeSchema", // export const name
    includeZodImport: true, // emit `import { z } from "..."`
    openRoot: false, // strict root by default
});
await Deno.writeTextFile("auto/patient-intake.auto.ts", tsCode.join("\n"));
```

3. Use the emitted schema everywhere (CI, back end, front end):

```ts
// auto/patient-intake.auto.ts
import { z } from "npm:zod@4.1.1";
export const patientIntakeSchema = z.object({/* …generated… */});

// app code
import { patientIntakeSchema } from "./auto/patient-intake.auto.ts";

type PatientIntake = z.infer<typeof patientIntakeSchema>;
const dto: PatientIntake = patientIntakeSchema.parse(anyJsonYouGot);
```

## Why this exists

- Automation: Convert any FHIR R4 Questionnaire into TS/Zod without hand-writing
  DTOs.
- Safety: The derived DTO is strictly validated; choices become enums; repeats
  become arrays.
- Flexibility: Parse either LHC answers or FHIR QuestionnaireResponse into the
  DTO.
- Maintainability: Regenerate `*.auto.ts` when the Questionnaire changes. No UI
  rendering—just robust types & validation.

## Getting started

### 1) Project expectations

- Deno 2 runtime
- Zod 4 (`npm:zod@4.1.1`)
- You have:

  - `questionnaire.ts` → the Zod schemas for FHIR resources
  - `lhc-form.ts` → the Zod schema for LHC Form definition
  - `compile.ts` → the compiler (builds a DTO schema & a `parse()` codec)
  - `emitter.ts` → the emitter (generates a standalone Zod schema module)
  - `questionnaires/*.json` → your FHIR Questionnaire definitions

### 2) Minimal compile + emit

```ts
import { compileQuestionnaire, emitZodTs } from "../mod.ts";
import qDef from "../questionnaires/patient-intake.json" with { type: "json" };

const compiled = compileQuestionnaire(qDef);
const { tsCode } = emitZodTs(compiled, {
    schemaTsIdentifier: "patientIntakeSchema",
    includeZodImport: true,
    openRoot: false,
});

await Deno.mkdir("auto", { recursive: true });
await Deno.writeTextFile("auto/patient-intake.auto.ts", tsCode.join("\n"));
console.log("Generated: auto/patient-intake.auto.ts");
```

Run it:

```
deno run -A tools/generate.ts
```

### 3) Validate some JSON

```ts
// demo.ts
import { z } from "npm:zod@4.1.1";
import { patientIntakeSchema } from "./auto/patient-intake.auto.ts";

type PatientIntake = z.infer<typeof patientIntakeSchema>;

const dto: PatientIntake = patientIntakeSchema.parse({
    demographics: {
        firstName: "Alice",
        age: 30,
    },
    symptoms: [
        { primarySymptom: "Cough" }, // choice → enum
        { primarySymptom: "Fever" },
    ],
    homepage: "https://example.org",
});
console.log(dto);
```

## What the generator produces (concepts)

- An object schema keyed by friendly camelCase names (not raw `linkId`s).
- Groups become nested objects (arrays when `repeats` is true).
- Leaves become Zod primitives:

  - `boolean`, `number().int()`, `string()` (date/time/uri → string)
  - choice/open-choice → `z.enum([...])` _(and)_ `open-choice` allows free text
    (`z.union([enum, z.string()])`)
  - checkbox controls: arrays are allowed even if `repeats` isn’t set (detected
    via the standard itemControl extension).
- Metadata for each field via `.describe("…")` and a brand: `.brand<\`linkId:…\`
  | \`text:…\` | \`type:…\` | \`definition:…\`>()\`

Example (excerpt of an emitted file):

```ts
/* AUTO-GENERATED for Patient Intake Form (patient-intake-form)
 * Source hash: 9b2f3e10
 * Standalone Zod schema (patientIntakeSchema). No external dependencies besides Zod.
 */

import { z } from "npm:zod@4.1.1";

export const patientIntakeSchema = z.object({
    demographics: z.object({
        firstName: z.string()
            .brand<`linkId:q1a` | `text:First Name` | `type:string`>()
            .describe("First Name [linkId=q1a]"),
        age: z.number().int()
            .brand<`linkId:q2` | `text:Age` | `type:integer`>()
            .describe("Age [linkId=q2]"),
    }).describe("Demographics [linkId=grp1]"),

    symptoms: z.array(
        z.object({
            primarySymptom: z.enum(["Cough", "Fever", "Headache"])
                .brand<`linkId:s1` | `text:Primary Symptom` | `type:choice`>()
                .describe("Primary Symptom [linkId=s1]"),
            otherSymptom: z.union([
                z.enum(["Sneezing", "Itchy eyes"]),
                z.string(),
            ]).brand<`linkId:s2` | `text:Other Symptom` | `type:open-choice`>()
                .describe("Other Symptom [linkId=s2]"),
        }).describe("Symptoms [linkId=grp2]"),
    ),
});
```

## Parsing real responses

You usually won’t hand-craft DTOs. Instead, let the compiler materialize data
from either LHC answers JSON or a FHIR QuestionnaireResponse.

```ts
import { compileQuestionnaire } from "./mod.ts";
import qDef from "./questionnaires/patient-intake.json" with { type: "json" };

// answers could be LHC JSON or QuestionnaireResponse
import qr from "./responses/my-response.json" with { type: "json" };

const compiled = compileQuestionnaire(qDef);
// create DTO using the compiler's parser (normalizes the response)
const dto = compiled.parse(qr);

// validate with emitted schema (optional but recommended)
import { patientIntakeSchema } from "./auto/patient-intake.auto.ts";
const validated = patientIntakeSchema.parse(dto);
```

### What `compileQuestionnaire()` gives you

```ts
type CompiledQuestionnaire = {
    identifier: (
        nature:
            | "human-friendly"
            | "camel-case"
            | "kebab-case"
            | "pascal-case"
            | "snake-case",
    ) => string;
    schema: z.ZodTypeAny; // runtime schema for DTO (built programmatically)
    introspect: {
        keyByPath: Record<string, string>; // "grp1.q1a" -> "firstName"
        pathByKey: Record<string, string>; // "firstName" -> "grp1.q1a"
    };
    provenance: {
        src: unknown; // original Questionnaire JSON
        srcHash: string; // stable digest (FNV-1a of stable JSON)
    };
    parse: (answers: unknown) => unknown; // LHC or QuestionnaireResponse -> DTO
};
```

## Emission instructions

The emitter produces a standalone TS file that depends only on Zod.

```ts
type EmitInstructions = {
    schemaTsIdentifier: string; // required: export const name

    includeZodImport?: boolean; // default: true
    zImportLine?: string; // default: import { z } from "npm:zod@4.1.1";

    includeHeaderComment?: boolean; // default: true
    openRoot?: boolean; // default: false (strict root)
    omitEmptyGroups?: boolean; // default: true
};
```

- `openRoot`: If true, the emitted root schema uses `.catchall(z.unknown())`.
- `omitEmptyGroups` mirrors the compiler default (groups with no children are
  skipped).
- `includeZodImport` lets you omit the import (e.g., if bundling elsewhere).

## Property names, identity, enums, and checkboxes

### Friendly property names (instead of `linkId`)

The compiler chooses property names via `propNameResolver` (default: label →
camelCase, falling back to `code.display` → `code` → `linkId`). Sibling
collisions are handled (`firstName`, `firstName2`, …). The emitter then reuses
that mapping so the generated code matches the compiler’s output.

Override property naming:

```ts
const compiled = compileQuestionnaire(qDef, {
    // use the first code (e.g., LOINC) when present, else linkId
    propNameResolver: (item) => {
        const loinc = item.code?.[0]?.code ?? item.linkId ?? "field";
        return loinc.replace(/[^\w$]/g, "_"); // keep identifier-safe
    },
});
```

### Questionnaire identity

`compiled.identifier(nature)` converts the Questionnaire’s title/name/code/url
into:

- `"human-friendly"` → `Patient Intake Form`
- `"kebab-case"` → `patient-intake-form`
- `"camel-case"` → `patientIntakeForm`
- etc.

You can customize the source via `qIdentityResolver` inside
`compileQuestionnaire` (if you extend it).

### Choice → enum and open-choice → union

The emitter inspects `answerOption` and builds:

- `z.enum(["A","B","C"])` when it finds string values (from `valueCoding.code`,
  `valueCoding.display`, or `valueString`)
- If options are numeric (`valueInteger`/`valueDecimal`) it emits
  `z.union([z.literal(1), z.literal(2)])`
- `open-choice` adds `∪ z.string()` to allow free text

If there are no answer options, it falls back to `z.string()` (standalone mode
has no FHIR leaf schemas).

### Checkboxes without `repeats`

Many UIs mark multiple choice via an itemControl extension (checkbox) and forget
`repeats:true`. The emitter detects the standard extension:

```
url: "http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl"
valueCodeableConcept.coding[*].code = "check-box" | "checkbox" | "check"
```

If present, it wraps the leaf in `z.array(...)` so multiple selections are
valid.

## Schema metadata

Every generated field (and group) includes:

- `.describe("…")` → a readable description with `[linkId=…]`, optional
  `definition`, and codes
- `.brand< ... >()` → a compile-time “brand” embedding template literal types
  like `` `linkId:q1a` | `text:First Name` | `type:string` | `definition:…` ``
  You can retrieve this metadata via Zod’s `._def` if needed for introspection.

## Strict vs open models

- Compiler (`compileQuestionnaire`) can be configured with `openRoot` (default:
  `true`), making the runtime schema permissive at the root (unknowns retained).
- Emitter defaults to `openRoot: false` (strict) because generated modules are
  usually used as the final DTO that downstream code relies on.

Pick the behavior you need per environment.

## Validating both at once

A robust pattern is to normalize with the compiler’s `parse()` and validate with
the emitted schema:

```ts
const compiled = compileQuestionnaire(qDef, { openRoot: true }); // permissive ingest
const dto = compiled.parse(lhcOrQrJson);

// Final validation (strict)
import { patientIntakeSchema } from "./auto/patient-intake.auto.ts";
const final = patientIntakeSchema.parse(dto);
```

This gives you friendly errors _and_ a hardened final object.

## Advanced recipes

### Always use `linkId` as property names

```ts
const compiled = compileQuestionnaire(qDef, {
    propNameResolver: (item) =>
        (item.linkId ?? "field").replace(/[^\w$]/g, "_"),
});
```

### Always keep groups (even empty ones)

- At compile time, pass `omitEmptyGroups: false`
- At emit time, pass `omitEmptyGroups: false`

```ts
const compiled = compileQuestionnaire(qDef, { omitEmptyGroups: false });
const { tsCode } = emitZodTs(compiled, {
    schemaTsIdentifier: "schema",
    omitEmptyGroups: false,
});
```

### Quote-free keys are required

The emitter never quotes keys; it sanitizes them into valid TS identifiers:

- Replaces invalid characters with `_`
- Prefixes `_` if the key doesn’t start with `[A-Za-z_$]`

If you need exact labels for UI, keep a side map (see
`compiled.introspect.keyByPath`).

## Troubleshooting

“Enum not generated for choices” Make sure your Questionnaire has `answerOption`
entries. The emitter checks, in order:

- `valueCoding.code`, then `valueCoding.display`, then `valueString`,
- numeric `valueInteger` / `valueDecimal`,
- `valueDate` / `valueDateTime` / `valueTime` (treated as string enums)

“Checkboxes accept only a single value” Confirm either `repeats: true` or the
itemControl extension with code `"check-box"`/`"checkbox"`. The emitter respects
both.

“Unknown keys rejected at root” Set `openRoot: true` in emit instructions to
allow unknown properties at the top level:

```ts
emitZodTs(compiled, { schemaTsIdentifier: "schema", openRoot: true });
```

“Property names collided” The compiler auto-suffixes sibling collisions (`name`,
`name2`, `name3`). Use a custom `propNameResolver` to choose unique keys (e.g.,
`code` + `linkId`).

## Reference: the emitter function

```ts
// emitter.ts (core surface)
export type EmitInstructions = {
    schemaTsIdentifier: string;
    includeZodImport?: boolean;
    zImportLine?: string;
    includeHeaderComment?: boolean;
    openRoot?: boolean;
    omitEmptyGroups?: boolean;
};

export function emitZodTs(
    compiled: CompiledQuestionnaire,
    instructions: EmitInstructions,
): { tsCode: string[] };
```

- Standalone output: Only depends on Zod (import line can be omitted if you want
  to inline).
- Metadata: Each property has `.describe()` and a `brand` with `linkId`,
  original `text`, `type`, and `definition`.

## Testing

You can test the emitter by compiling a tiny Questionnaire and importing the
emitted file:

```ts
import { compileQuestionnaire } from "./mod.ts";
import { emitZodTs } from "./emitter.ts";
import qDef from "./questionnaires/minimal.json" with { type: "json" };

const compiled = compileQuestionnaire(qDef);
const { tsCode } = emitZodTs(compiled, {
    schemaTsIdentifier: "minimalSchema",
});

await Deno.writeTextFile("auto/minimal.auto.ts", tsCode.join("\n"));
const mod = await import(
    new URL("./auto/minimal.auto.ts", import.meta.url).href
);

const schema = mod.minimalSchema;
const dto = compiled.parse({/* LHC or QuestionnaireResponse */});
console.log(schema.parse(dto)); // should pass
```

## Final notes

- Generated files are deterministic: we record a source hash
  (`provenance.srcHash`) to help detect changes.
- The approach is UI-agnostic: pair it with any renderer; this library’s job is
  to normalize and validate data.
- Everything is Zod-first: adopting Zod means you can reuse a rich ecosystem of
  transformers, effects, and validators later.

If you want the emitter to also write a type alias (e.g.,
`export type PatientIntake = z.infer<typeof patientIntakeSchema>`), it’s trivial
to extend—just append one line to the generated `tsCode`.
