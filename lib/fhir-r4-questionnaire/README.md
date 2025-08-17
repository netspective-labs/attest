# Attest FHIR R4 Questionnaire → Type-Safe Module Generator

> See [example workflow](example-workflow.md) for technical details.

## Purpose

This library automates the conversion of FHIR R4 Questionnaire resources into
type-safe TypeScript modules. Each Questionnaire JSON is transformed into a
`.auto.ts` file containing:

- A normalized interface describing the data model.
- Constants mapping field names to `linkId`s.
- Adapters to consume either:

  - LHC Forms JSON responses, or
  - FHIR `QuestionnaireResponse` resources.
- An _example_ Interpreter class that wraps the adapters and provides validation
  and readiness checks that developers can use as a starting point.

This library gives you:

- Automation: Convert any FHIR R4 Questionnaire into TypeScript.
- Safety: Strict typings and adapters for both LHC JSON and FHIR
  QuestionnaireResponse.
- Extensibility: Maintainable design with centralized helpers.
- Flexibility: Use in back-end rules engines or front-end frameworks, but not as
  a form renderer.

It is designed for long-term maintainability: keep shared code in
`r4q-runtime.ts`, regenerate `.auto.ts` files when Questionnaires change, and
extend only the common helpers when new functionality is required.

### Not a Form UI Framework

This library is not intended to render forms or provide UI widgets. Instead:

```
FHIR Questionnaire JSON ──▶  TypeScript Types
                            + Adapters
                            + Interpreter
```

You can then use:

- The generated types and adapters in rules engines,
- Validation pipelines,
- Or front-end frameworks like Astro, React, Vue, etc.

UI libraries are responsible for data entry. This tool ensures that once
responses are collected, they can be normalized into strict TypeScript objects.

## High-Level Flow

Here’s the text-based flow of how data moves through the library:

```
             ┌────────────────────────┐
             │ FHIR R4 Questionnaire  │ <-- Created by business analysts
             │    (definition JSON)   │
             └─────────────┬──────────┘
                           │
                           ▼
             ┌────────────────────────┐
             │ CLI Generator          │ <-- Run by business analysts or devs
             │ r4qctl.ts              │
             └─────────────┬──────────┘
                           │
                           ▼
             ┌────────────────────────┐
             │ Generated *.auto.ts    │
             │ (interface + adapters) │
             └─────────────┬──────────┘
                           │
                           ▼
        ┌─────────────────────────┐
        │  LHC Form JSON Response │─────┐
        └─────────────────────────┘     │
                                        ▼ 
        ┌─────────────────────────┐     │
        │ QuestionnaireResponse   │─────┘
        │  (FHIR JSON)            │
        └─────────────────────────┘

                  ▼
      ┌───────────────────────────┐
      │  Interpreter.fromLhc()    │ <-- examples for developers to use as a starting point
      │  Interpreter.fromQR()     │
      └─────────────┬─────────────┘
                    │
                    ▼
      ┌───────────────────────────┐
      │ Normalized TypeScript Obj │
      │ (type-safe & validated)   │
      └───────────────────────────┘
```

<mark>See [example workflow](example-workflow.md) for a full technical
workflow.</mark>.

## Project Structure

- `r4q-runtime.ts` Shared helpers for type coercion, traversal, string-builders,
  and renderers. Maintainers should keep all reusable logic here to avoid
  duplication.

- `r4qctl.ts` CLI generator. Parses input JSON files and generates `*.auto.ts`
  outputs.

- Generated Files (`[title-kebab].auto.ts`) Questionnaire-specific modules that:

  - Import helpers from `r4q-runtime.ts` only.
  - Provide `LinkIds`, `interface`, adapters, and sample interpreter.
  - Contain no CLI logic or reusable helpers.

## CLI Usage

```bash
deno run -A ./r4qctl.ts --help
```

### Generate TypeScript from a single Questionnaire

```bash
deno run -A ./r4qctl.ts ./Company-Information.fhir-R4-questionnaire.json
deno run -A ./r4qctl.ts ./Company-Information.fhir-R4-questionnaire.json --include-src
```

Produces:

```
./company-information.auto.ts
```

If you specify `--include-src` then the actual contents of the
`*.fhir-R4-questionnaire.json` specified will also be included as an export
`const` in the generated TypeScript.

### Multiple inputs into a directory

```bash
deno run -A ./r4qctl.ts ./A.json ./B.json --outDir ./out --force
```

### Print code to STDOUT (no files written)

```bash
deno run -A ./r4qctl.ts ./Company-Information.json --stdout
```

## Generated Code Anatomy

Every generated `.auto.ts` looks like this (simplified):

```ts
/
 * @file company-information.auto.ts
 * @generated from Questionnaire "Company Information"
 */

import {
  coerceString, coerceDate, findLhcValueByLinkId, findQrAnswerByLinkId, isBlank
} from "./r4q-runtime.ts";

export const CompanyInformationLinkIds = {
  organizationName: "715544477968",
  formCompletedBy: "655141523763",
  // ...
} as const;

export interface CompanyInformation {
  / Organization Name (required) */
  organizationName: string;
  / Assessment Date */
  assessmentDate?: Date;
}

export function CompanyInformationLhcFormResponseAdapter(input: any): CompanyInformation { ... }

export function CompanyInformationFhirQuestionnaireResponseAdapter(qr: any): CompanyInformation { ... }

/**
 * This Interpreter class is provided only as an EXAMPLE scaffold to demonstrate
 * how to consume the normalized type-safe interface generated for this Questionnaire. 
 * Best practice: use the generated TypeScript interface (`<TitlePascal>`) 
 * as your contract for normalized data, then integrate with your own rules processors,
 * compliance engines, or plain TypeScript/JavaScript functions as needed.
 */
export class CompanyInformationInterpreter {
  static fromLhc(input: any): CompanyInformationInterpreter { ... }
  static fromQuestionnaireResponse(qr: any): CompanyInformationInterpreter { ... }
  validateRequiredFields(): { ok: boolean; missing: Array<keyof CompanyInformation> } { ... }
  assessReadiness(): { requiredCovered: number; ... } { ... }
}
```

When reviewing the generated `[*Questionnaire*]Interpreter` class inside each
`*.auto.ts` file, engineers should understand that this class is **deliberately
simplistic** and is included primarily as an **illustrative scaffold**. Its
methods—`fromLhc()`, `fromQuestionnaireResponse()`, `validateRequiredFields()`,
and `assessReadiness()`—demonstrate how normalized data can be pulled into the
strongly-typed interface and then checked for completeness. This is meant to
give developers a concrete starting point for working with normalized objects,
but it is **not intended for production use as-is**. The interpreter shows
what’s possible (basic coercion, required field checks, readiness scoring), but
it is not comprehensive enough for the complexity of real-world healthcare
workflows or compliance-heavy scenarios.

In a production system, these generated type-safe modules should be **paired
with a proper rules engine or downstream processing layer**. The generated
interface (`CompanyInformation`, for example) gives you the strict typing and
normalized field mapping, which ensures type safety across your application.
What you do with the typed object afterward—feeding it into a rules engine,
validation framework, business logic processor, or even plain
JavaScript/TypeScript functions—is up to the application design. The generated
`Interpreter` exists to show developers how to bootstrap that process quickly,
but production-ready validation, scoring, and workflow logic should live outside
of these auto-generated files. Think of the `Interpreter` as a **sample
harness**: it demonstrates the pattern, enforces consistency, and teaches usage,
but you should treat it as scaffolding to replace with domain-specific logic in
your own codebase.

## Maintenance Notes

### Key Principles

1. Generated files must only import from `r4q-runtime.ts`. This avoids code
   duplication and ensures central fixes propagate.

2. Stable output. Property order matches Questionnaire traversal order → output
   is deterministic.

3. Adapters rely on coercers. All type normalization (`string → number`,
   `string → Date`, etc.) must happen in `r4q-runtime.ts`.

4. Sample Interpreter is intentionally simple.

   - Validates required fields.
   - Produces readiness metrics (percent filled).
   - Does not implement complex scoring.
   - Meant to show developers how to use the rest of the `.auto.ts` content

5. Not a form renderer.

   - UI is decoupled.
   - This library’s output feeds data into rules engines, APIs, or UI
     frameworks.

### ASCII Architecture View

```
+----------------------------+
| r4q-runtime.ts              | <-- shared core (needed by your application for *.auto.ts)
+----------------------------+
            ▲
            │
+----------------------------+
| r4q-resource-code-gen.ts   | <-- code generator library (not needed by generated files)
+----------------------------+
            ▲
            │
+----------------------------+
| r4qctl.ts                  | <-- CLI generator (needed only at codegen time)
+----------------------------+
            │
            ▼
+----------------------------+
| *.auto.ts (per form)       | <-- Generated code (used in your application)
+----------------------------+
```

### Maintenance Guidelines

- When FHIR spec evolves (e.g., R5): update type mapping in `fhirTypeToTs()`.
- When new coercion rules are needed: add to `r4q-runtime.ts`, never inline.
- When bugs in adapters appear: check `findLhcValueByLinkId` and
  `findQrAnswerByLinkId` logic first.
- When adding new render features: extend render helpers in `r4q-runtime.ts`.

## Example: Using in an Application

Suppose you have collected an LHC Form QuestionnaireResponse from your UI:

```ts
import { CompanyInformationInterpreter } from "./company-information.auto.ts";

const qr = await fetch("/api/questionnaireResponse").then((r) => r.json());

const interp = CompanyInformationInterpreter.fromQuestionnaireResponse(qr);

const validation = interp.validateRequiredFields();
if (!validation.ok) {
  console.error("Missing fields:", validation.missing);
}

console.log("Readiness:", interp.assessReadiness());
```

## Future Extensions

- R5 Support: adjust to handle Questionnaire differences.
- Localization: expand `helpNotes` and `entryFormat` parsing.
- Better readiness scoring: add configurable weighting.
