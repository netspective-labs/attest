# PROMPT FOR CODING AGENT

You are an expert Deno/TypeScript engineer. Create **two** production-ready
source files for a FHIR R4 Questionnaire → type-safe module generator. Use
**JSR** module imports only (not `deno.land/x` URLs).

## Objective

Implement a code generator that takes one or more FHIR R4 **Questionnaire** JSON
files as input and generates, for each, a fully typed, self-contained
`*.auto.ts` module that normalizes answers from both **LHC Forms** JSON and
**FHIR R4 QuestionnaireResponse**. The generator is split into two files:

1. `r4q-runtime.ts` — shared helpers/types used by all generated files with no
   Questionnairre-specific content.
2. `r4q-resource-to-ts.ts` — the CLI generator that parses Questionnaire(s) and
   writes out `[title-kebab].auto.ts` files which import from
   `./r4q-runtime.ts`.

- Build a normalized interface named after the Questionnaire title in
  **PascalCase** (e.g., `CompanyInformation`).
- Emit `LinkIds` constant mapping normalized property names → `linkId`.
- Emit **two adapters**:

  - `<TitlePascal>LhcFormResponseAdapter` (walks `items[*].linkId/value`
    recursively).
  - `<TitlePascal>FhirQuestionnaireResponseAdapter` (walks standard
    `QuestionnaireResponse.item[].answer[]`).
- Emit an `<TitlePascal>Interpreter` class with:

  - `fromLhcFormResponse()` and `fromQuestionnaireResponse()` factories.
  - `validateRequiredFields()` and `assessReadiness()` methods.
- Enrich JSDoc from questionnaire `text`, `entryFormat` extension,
  `display(help)` items, and section trail.
- Correct type coercion: `date/dateTime → Date`, `integer/decimal → number`,
  `boolean → boolean`, else `string`. `choice` becomes union of string literals
  when `answerOption` exists; otherwise `string`. **type-safety is crucial**.

## Constraints

- Deno, TypeScript, **JSR** imports only:
  - CLI: `jsr:@cliffy/command@^1.0.0-rc.3` (or current CLI package under
    `@cliffy` that includes `Command`).
  - Path utilities: `jsr:@std/path@^1.0.0`.
- Shebang: `#!/usr/bin/env -S deno run --allow-read --allow-write`.
- No external HTTP fetches at runtime; read local JSON files.
- Generated files must import **only** from `./r4q-runtime.ts`.
- The CLI must accept multiple positional arguments: `<paths...>` (one or more
  files). For each input file:

  - Read the JSON.
  - Validate `resourceType === "Questionnaire"`.
  - Generate a `[kebab-of-title].auto.ts` file **alongside** the input by
    default.
- Add flags:

  - `--stdout` / `-p`: print generated code to STDOUT (for a single input). If
    multiple paths are given with `--stdout`, concatenate with a
    `\n\n/* --- NEXT FILE --- */\n\n` delimiter.
  - `--outDir <dir>`: write outputs into a directory instead of adjacent to
    inputs (create if missing).
  - `--force`: overwrite existing `.auto.ts`.
- Deterministic output formatting, stable property order (walk order of items).
- Provide helpful error messages (invalid JSON, not Questionnaire, empty items).

### Input Specifications

1. **FHIR R4 Questionnaire Resource JSON:** This is the definitional source for
   the form's structure, questions, and expected data types. The agent must
   parse this JSON to infer the necessary TypeScript interfaces and mapping
   logic.

   - **Example Input (for context of types and structure, NOT to be
     hardcoded):**
     ```json
     {
       "resourceType": "Questionnaire",
       "meta": {
         "profile": [
           "http://hl7.org/fhir/4.0/StructureDefinition/Questionnaire"
         ]
       },
       "title": "Company Information",
       "status": "draft",
       "item": [
         {
           "type": "group",
           "linkId": "158032884208",
           "text": "Organization Details",
           "item": [
             {
               "linkId": "158032884208_helpText",
               "type": "display",
               "text": "Provide essential information about your organization for CMMC compliance tracking.",
               "extension": [
                 {
                   "url": "http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl",
                   "valueCodeableConcept": {
                     "coding": [
                       {
                         "system": "http://hl7.org/fhir/questionnaire-item-control",
                         "code": "help",
                         "display": "Help-Button"
                       }
                     ],
                     "text": "Help-Button"
                   }
                 }
               ]
             }
           ]
         },
         {
           "type": "string",
           "extension": [
             {
               "url": "http://hl7.org/fhir/StructureDefinition/entryFormat",
               "valueString": "Enter your organization name"
             }
           ],
           "linkId": "715544477968",
           "text": "Organization Name",
           "required": true
         },
         {
           "type": "string",
           "extension": [
             {
               "url": "http://hl7.org/fhir/StructureDefinition/entryFormat",
               "valueString": "Your full name"
             }
           ],
           "linkId": "655141523763",
           "text": "Form Completed By",
           "required": true
         },
         {
           "type": "string",
           "extension": [
             {
               "url": "http://hl7.org/fhir/StructureDefinition/entryFormat",
               "valueString": "Your job title"
             }
           ],
           "linkId": "761144039651",
           "text": "Position/Title"
         },
         {
           "type": "string",
           "extension": [
             {
               "url": "http://hl7.org/fhir/StructureDefinition/entryFormat",
               "valueString": "your.email@company.com"
             }
           ],
           "linkId": "441278853405",
           "text": "Email Address",
           "required": true
         },
         {
           "type": "string",
           "extension": [
             {
               "url": "http://hl7.org/fhir/StructureDefinition/entryFormat",
               "valueString": "(555) 121-2345"
             }
           ],
           "linkId": "375736159279",
           "text": "Work Phone",
           "required": true
         },
         {
           "type": "string",
           "extension": [
             {
               "url": "http://hl7.org/fhir/StructureDefinition/entryFormat",
               "valueString": "(555) 987-4756"
             }
           ],
           "linkId": "948589414714",
           "text": "Mobile Phone",
           "required": true
         },
         {
           "type": "date",
           "linkId": "276403539223",
           "text": "Assessment Date"
         },
         {
           "type": "string",
           "extension": [
             {
               "url": "http://hl7.org/fhir/StructureDefinition/entryFormat",
               "valueString": "Defense, Technology, etc."
             }
           ],
           "linkId": "789286873476",
           "text": "Industry"
         },
         {
           "type": "string",
           "extension": [
             {
               "url": "http://hl7.org/fhir/StructureDefinition/entryFormat",
               "valueString": "1-10, 11-50, 51-200, etc."
             }
           ],
           "linkId": "697235963218",
           "text": "Employee Count"
         },
         {
           "type": "text",
           "extension": [
             {
               "url": "http://hl7.org/fhir/StructureDefinition/entryFormat",
               "valueString": "Prime contracts, subcontracts, etc. (comma-separated)"
             }
           ],
           "linkId": "863463230823",
           "text": "Contract Types"
         },
         {
           "item": [
             {
               "type": "string",
               "extension": [
                 {
                   "url": "http://hl7.org/fhir/StructureDefinition/entryFormat",
                   "valueString": "5-character CAGE code"
                 }
               ],
               "linkId": "805221373063",
               "text": "CAGE Code"
             },
             {
               "type": "string",
               "extension": [
                 {
                   "url": "http://hl7.org/fhir/StructureDefinition/entryFormat",
                   "valueString": "9-digit DUNS number"
                 }
               ],
               "linkId": "374784155003",
               "text": "DUNS Number"
             }
           ],
           "type": "group",
           "linkId": "127163950314",
           "text": "Organization Identifiers"
         }
       ]
     }
     ```

2. **LHC Form JSON Response Example:** This is the definitional source for the
   LHC JSON response to the questions mapped to FHIR R4 JSON where `linkId`s are
   direct keys to the values in the item `value` key. The agent must parse this
   JSON to infer the necessary TypeScript interfaces and mapping logic.

   - **Example LHC Response Structure (for context, derived from the above
     Questionnaire):**
     ```json
     {
       "lformsVersion": "38.2.0",
       "PATH_DELIMITER": "/",
       "code": null,
       "codeList": null,
       "identifier": null,
       "name": "Company Information",
       "template": "table",
       "items": [
         {
           "header": true,
           "dataType": "SECTION",
           "question": "Organization Details",
           "questionCode": "158032884208",
           "questionCodeSystem": "LinkId",
           "linkId": "158032884208",
           "questionCardinality": {
             "max": "1",
             "min": "1"
           },
           "items": [],
           "codingInstructions": "Provide essential information about your organization for CMMC compliance tracking.",
           "codingInstructionsFormat": "text",
           "codingInstructionsPlain": "Provide essential information about your organization for CMMC compliance tracking.",
           "codingInstructionsLinkId": "158032884208_helpText",
           "codeList": [],
           "displayControl": {
             "questionLayout": "vertical"
           },
           "answerCardinality": {
             "min": "0",
             "max": "1"
           }
         },
         {
           "extension": [
             {
               "url": "http://hl7.org/fhir/StructureDefinition/entryFormat",
               "valueString": "Enter your organization name"
             }
           ],
           "dataType": "ST",
           "question": "Organization Name",
           "questionCode": "715544477968",
           "questionCodeSystem": "LinkId",
           "linkId": "715544477968",
           "questionCardinality": {
             "max": "1",
             "min": "1"
           },
           "answerCardinality": {
             "min": "1"
           },
           "codeList": [],
           "value": "Netspective Communications LLC"
         },
         {
           "extension": [
             {
               "url": "http://hl7.org/fhir/StructureDefinition/entryFormat",
               "valueString": "Your full name"
             }
           ],
           "dataType": "ST",
           "question": "Form Completed By",
           "questionCode": "655141523763",
           "questionCodeSystem": "LinkId",
           "linkId": "655141523763",
           "questionCardinality": {
             "max": "1",
             "min": "1"
           },
           "answerCardinality": {
             "min": "1"
           },
           "codeList": [],
           "value": "Shahid N. Shah"
         },
         {
           "extension": [
             {
               "url": "http://hl7.org/fhir/StructureDefinition/entryFormat",
               "valueString": "Your job title"
             }
           ],
           "dataType": "ST",
           "question": "Position/Title",
           "questionCode": "761144039651",
           "questionCodeSystem": "LinkId",
           "linkId": "761144039651",
           "questionCardinality": {
             "max": "1",
             "min": "1"
           },
           "codeList": [],
           "answerCardinality": {
             "min": "0",
             "max": "1"
           },
           "value": "Principal"
         },
         {
           "extension": [
             {
               "url": "http://hl7.org/fhir/StructureDefinition/entryFormat",
               "valueString": "your.email@company.com"
             }
           ],
           "dataType": "ST",
           "question": "Email Address",
           "questionCode": "441278853405",
           "questionCodeSystem": "LinkId",
           "linkId": "441278853405",
           "questionCardinality": {
             "max": "1",
             "min": "1"
           },
           "answerCardinality": {
             "min": "1"
           },
           "codeList": [],
           "value": "dont-spam@spam.com"
         },
         {
           "extension": [
             {
               "url": "http://hl7.org/fhir/StructureDefinition/entryFormat",
               "valueString": "(555) 121-2345"
             }
           ],
           "dataType": "ST",
           "question": "Work Phone",
           "questionCode": "375736159279",
           "questionCodeSystem": "LinkId",
           "linkId": "375736159279",
           "questionCardinality": {
             "max": "1",
             "min": "1"
           },
           "answerCardinality": {
             "min": "1"
           },
           "codeList": [],
           "value": "+1 123-456-7891"
         },
         {
           "extension": [
             {
               "url": "http://hl7.org/fhir/StructureDefinition/entryFormat",
               "valueString": "(555) 987-4756"
             }
           ],
           "dataType": "ST",
           "question": "Mobile Phone",
           "questionCode": "948589414714",
           "questionCodeSystem": "LinkId",
           "linkId": "948589414714",
           "questionCardinality": {
             "max": "1",
             "min": "1"
           },
           "answerCardinality": {
             "min": "1"
           },
           "codeList": [],
           "value": "+1 123-456-7891"
         },
         {
           "dataType": "DT",
           "question": "Assessment Date",
           "questionCode": "276403539223",
           "questionCodeSystem": "LinkId",
           "linkId": "276403539223",
           "questionCardinality": {
             "max": "1",
             "min": "1"
           },
           "codeList": [],
           "answerCardinality": {
             "min": "0",
             "max": "1"
           },
           "value": "2025-08-16"
         },
         {
           "extension": [
             {
               "url": "http://hl7.org/fhir/StructureDefinition/entryFormat",
               "valueString": "Defense, Technology, etc."
             }
           ],
           "dataType": "ST",
           "question": "Industry",
           "questionCode": "789286873476",
           "questionCodeSystem": "LinkId",
           "linkId": "789286873476",
           "questionCardinality": {
             "max": "1",
             "min": "1"
           },
           "codeList": [],
           "answerCardinality": {
             "min": "0",
             "max": "1"
           },
           "value": "Frontier AI"
         },
         {
           "extension": [
             {
               "url": "http://hl7.org/fhir/StructureDefinition/entryFormat",
               "valueString": "1-10, 11-50, 51-200, etc."
             }
           ],
           "dataType": "ST",
           "question": "Employee Count",
           "questionCode": "697235963218",
           "questionCodeSystem": "LinkId",
           "linkId": "697235963218",
           "questionCardinality": {
             "max": "1",
             "min": "1"
           },
           "codeList": [],
           "answerCardinality": {
             "min": "0",
             "max": "1"
           },
           "value": "50"
         },
         {
           "extension": [
             {
               "url": "http://hl7.org/fhir/StructureDefinition/entryFormat",
               "valueString": "Prime contracts, subcontracts, etc. (comma-separated)"
             }
           ],
           "dataType": "TX",
           "question": "Contract Types",
           "questionCode": "863463230823",
           "questionCodeSystem": "LinkId",
           "linkId": "863463230823",
           "questionCardinality": {
             "max": "1",
             "min": "1"
           },
           "codeList": [],
           "answerCardinality": {
             "min": "0",
             "max": "1"
           },
           "value": "Subcontract"
         },
         {
           "header": true,
           "dataType": "SECTION",
           "question": "Organization Identifiers",
           "questionCode": "127163950314",
           "questionCodeSystem": "LinkId",
           "linkId": "127163950314",
           "questionCardinality": {
             "max": "1",
             "min": "1"
           },
           "items": [
             {
               "extension": [
                 {
                   "url": "http://hl7.org/fhir/StructureDefinition/entryFormat",
                   "valueString": "5-character CAGE code"
                 }
               ],
               "dataType": "ST",
               "question": "CAGE Code",
               "questionCode": "805221373063",
               "questionCodeSystem": "LinkId",
               "linkId": "805221373063",
               "questionCardinality": {
                 "max": "1",
                 "min": "1"
               },
               "codeList": [],
               "answerCardinality": {
                 "min": "0",
                 "max": "1"
               },
               "value": "12345"
             },
             {
               "extension": [
                 {
                   "url": "http://hl7.org/fhir/StructureDefinition/entryFormat",
                   "valueString": "9-digit DUNS number"
                 }
               ],
               "dataType": "ST",
               "question": "DUNS Number",
               "questionCode": "374784155003",
               "questionCodeSystem": "LinkId",
               "linkId": "374784155003",
               "questionCardinality": {
                 "max": "1",
                 "min": "1"
               },
               "codeList": [],
               "answerCardinality": {
                 "min": "0",
                 "max": "1"
               },
               "value": "123456789"
             }
           ],
           "codeList": [],
           "displayControl": {
             "questionLayout": "vertical"
           },
           "answerCardinality": {
             "min": "0",
             "max": "1"
           }
         }
       ],
       "templateOptions": {
         "showQuestionCode": false,
         "showCodingInstruction": false,
         "allowMultipleEmptyRepeatingItems": false,
         "allowHTML": true,
         "displayControl": {
           "questionLayout": "vertical"
         },
         "viewMode": "auto",
         "defaultAnswerLayout": {
           "answerLayout": {
             "type": "COMBO_BOX",
             "columns": "0"
           }
         },
         "hideTreeLine": false,
         "hideIndentation": false,
         "hideRepetitionNumber": false,
         "displayScoreWithAnswerText": true,
         "displayInvalidHTML": false,
         "messageLevel": "error"
       },
       "hasSavedData": true,
       "fhirVersion": "R4"
     }
     ```

---

## File 1: r4q-runtime.ts (shared library)

**Purpose:** centralize all shared logic so generated files remain thin and
never copy/paste helpers.

**Export the following:**

- **Types**

  - `FhirCoding`, `FhirExtension`, `FhirQItem`, `FhirQuestionnaire`.
- **Case & name utils**

  - `toPascalCase(s: string): string`
  - `toCamelCase(s: string): string`
  - `toKebabCase(s: string): string`
  - `uniqueName(base: string, used: Set<string>): string`
- **FHIR helpers**

  - `isDisplayHelp(item: FhirQItem): boolean`
  - `getEntryFormat(item: FhirQItem): string | undefined`
  - `collectChoiceLiterals(item: FhirQItem): string[] | undefined`
  - `fhirTypeToTs(fhirType: string): string` // returns TS type name (“string”,
    “number”, “boolean”, “Date”)
- **Traversal & extraction**

  - `flattenItems(items: FhirQItem[] | undefined, usedNames: Set<string>, trail?: string[], formHelp?: string[], acc?: FieldMeta[]): { fields: FieldMeta[]; formHelp: string[] }`
  - `type FieldMeta = { propName: string; linkId: string; fhirType: string; tsType: string; required: boolean; text?: string; entryFormat?: string; helpNotes?: string[]; groupTrail: string[]; choiceLiterals?: string[] }`
- **Coercers (used by adapters & interpreters)**

  - `isBlank(v: unknown): boolean`
  - `coerceString(v: unknown): string`
  - `coerceNumber(v: unknown): number`
  - `coerceBoolean(v: unknown): boolean`
  - `coerceDate(v: unknown): Date`
  - `coerceOptionalString(v: unknown): string | undefined`
  - `coerceOptionalNumber(v: unknown): number | undefined`
  - `coerceOptionalBoolean(v: unknown): boolean | undefined`
  - `coerceOptionalDate(v: unknown): Date | undefined`
- **Adapter helpers**

  - `findLhcValueByLinkId(node: any, linkId: string): unknown` // DFS over LHC
    `items`
  - `findQrAnswerByLinkId(qr: any, linkId: string): unknown` // DFS over
    `QuestionnaireResponse.item[]`
- **Render helpers for the generator (string builders)**

  - Functions that **return strings** to be concatenated into the generated
    file:

    - `renderHeaderBanner(filename: string, form: FhirQuestionnaire, titlePascal: string): string`
    - `renderFormHelpsBlock(formHelps: string[]): string`
    - `renderLinkIdMap(titlePascal: string, fields: FieldMeta[]): string`
    - `renderInterface(titlePascal: string, formTitle: string, fields: FieldMeta[]): string`
    - `renderSharedImports(): string` // returns
      `import { ... } from "./r4q-runtime.ts";`
    - `renderLhcAdapter(titlePascal: string, fields: FieldMeta[]): string`
    - `renderQrAdapter(titlePascal: string, fields: FieldMeta[]): string`
    - `renderInterpreter(titlePascal: string, formTitle: string, fields: FieldMeta[]): string`
    - `coerceExprByType(f: FieldMeta, rawExpr: string): string`
- **Misc**

  - `indent(s: string, n?: number): string`

**Implementation notes:**

- Keep `renderSharedImports()` as the **only** import line needed by any
  generated `.auto.ts` file; it must include named imports for everything
  generated code uses (`coerce*`, `find*ByLinkId`, types, etc.).
- All helpers should be well-documented with JSDoc.

## File 2: r4q-resource-to-ts.ts (CLI generator)

**Responsibilities:**

- Parse command-line args via **Cliffy** (`jsr:@cliffy/command`).
- Accept positional `<paths...>` (one or more). Options:

  - `--stdout, -p` (print only; if multiple, concatenate with delimiters).
  - `--outDir <dir>` (default: sibling to input).
  - `--force` (overwrite).
- For each path:

  - `readTextFile`, `JSON.parse`.
  - Validate `resourceType === "Questionnaire"`.
  - Derive `titlePascal`, `kebab`, and `output filename = <kebab>.auto.ts`.
  - Use `flattenItems` to produce fields & form help.
  - Assemble output by concatenating:

    1. `renderHeaderBanner(...)`
    2. `renderFormHelpsBlock(...)`
    3. `renderSharedImports()`
    4. `renderLinkIdMap(...)`
    5. `renderInterface(...)`
    6. **Adapters** (LHC & QR)
    7. **Interpreter**
- If writing to disk, ensure directory exists (`Deno.mkdir` with
  `{ recursive:true }`).
- If file exists and `--force` not set, fail with message.
- Exit codes: 0 success; non-zero on any failure. Print per-file errors but
  continue to next input unless `--stdout` (then fail fast).

**JSR Imports to use:**

```ts
import { Command } from "jsr:@cliffy/command@^1.0.0-rc.8";
import * as path from "jsr:@std/path@^1.1.2";
import {
  // (named imports from r4q-runtime.ts used by the generator)
  FhirQuestionnaire,
  FieldMeta,
  flattenItems,
  renderFormHelpsBlock,
  renderHeaderBanner,
  renderInterface,
  renderInterpreter,
  renderLhcAdapter,
  renderLinkIdMap,
  renderQrAdapter,
  renderSharedImports,
  toKebabCase,
  toPascalCase,
} from "./r4q-runtime.ts";
```

## Generated File Contract (`[title-kebab].auto.ts`)

Each generated file must begin with:

- A banner comment including `@file`, `@generated`, and the form’s title and
  profiles.
- Then `renderSharedImports()` line:

  ```ts
  import {
    coerceBoolean,
    coerceDate,
    coerceNumber,
    coerceOptionalBoolean,
    coerceOptionalDate,
    coerceOptionalNumber,
    coerceOptionalString,
    coerceString,
    findLhcValueByLinkId,
    findQrAnswerByLinkId,
    // ...any additional helpers the file relies on
  } from "./r4q-runtime.ts";
  ```
- Followed by the emitted `LinkIds`, `interface`, adapters, interpreter.

No additional imports are allowed.

## Implementation Details & Quality Gates

- **Choice typing:** when `answerOption` present, create union of string
  literals. Prefer `valueString`; else use `valueCoding.code`; else
  `String(valueInteger)`.
- **JSDoc enrichment:** include:

  - Question `text`
  - `linkId`
  - FHIR `type`
  - `entryFormat` (from `http://hl7.org/fhir/StructureDefinition/entryFormat`)
  - “Section” trail (group titles joined by `>`)
- **Required fields:** `item.required === true` → non-optional in interface and
  checked in `validateRequiredFields()`.
- **Coercion:** centralize in `r4q-runtime.ts`. Generated code must call
  coercers.
- **LHC finder:** search recursively through `items`, return `value` when
  `linkId` matches.
- **QR finder:** DFS over `item[]`; for first `answer[0]`, return first `value*`
  found; for `valueCoding`, prefer `code`, then `display`, then `system`.
- **Stability:** keep property order equal to source traversal order.
- **Errors:** meaningful diagnostics with path included; skip bad files unless
  `--stdout` is used.
- **Shebang & permissions:** both files must compile and run under Deno with the
  stated shebang and permissions.

## Deliverables

Produce **exactly two files** with the following content. Do **not** include
anything else in the output.

### FILE: r4q-runtime.ts

(Implement everything specified in “File 1: r4q-runtime.ts”. Use comprehensive
JSDoc and clean, readable code. No CLI code here.)

### FILE: r4q-resource-to-ts.ts

(Implement the CLI as specified in “File 2: r4q-resource-to-ts.ts”. Parse args;
loop inputs; generate per file; support `--stdout`, `--outDir`, `--force`.)

## Acceptance Tests (you must self-verify)

1. Running:

   ```
   deno run -A ./r4q-resource-to-ts.ts ./Company-Information.fhir-r4-questionnaire.json
   ```

   creates `./company-information.auto.ts` importing from `./r4q-runtime.ts`.

2. Multi-input:

   ```
   deno run -A ./r4q-resource-to-ts.ts ./A.json ./B.json --outDir ./out --force
   ```

   produces `./out/a.auto.ts`, `./out/b.auto.ts`, each with a single import from
   `../r4q-runtime.ts` or `./r4q-runtime.ts` per relative path.

3. STDOUT:

   ```
   deno run -A ./r4q-resource-to-ts.ts ./Company-Information.json --stdout
   ```

   prints one generated file to STDOUT; with two paths, prints both with a clear
   delimiter.

4. Type safety:

   - In `company-information.auto.ts`, `assessmentDate?: Date`, required fields
     non-optional, `choice` mapped to union when options exist.

5. No duplication:

   - Generated files contain **no copies** of coercers/finders/casing helpers;
     they only import from `./r4q-runtime.ts`.

6. LHC/QR adapters:

   - Using the provided LHC example and a synthetically crafted
     QuestionnaireResponse, `fromLhcFormResponse()` and
     `fromQuestionnaireResponse()` both produce the same normalized object
     (modulo types), and `validateRequiredFields()` reports missing fields
     correctly.
