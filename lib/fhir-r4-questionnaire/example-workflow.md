# Worked example: “Company Information” form

> Below is a complete, self-contained worked example engineers can use to
> understand the flow end-to-end: FHIR R4 Questionnaire JSON → run the CLI →
> generated `*.auto.ts` → normalize both LHC JSON and FHIR QuestionnaireResponse
> → validate and score readiness. It also includes a tiny E2E test.

## Directory layout

```
your-app/
├─ r4q-runtime.ts
├─ r4qctl.ts
├─ fixtures/
│  ├─ company-information.fhir-r4-questionnaire.json
│  ├─ company-information.lhc-form-response.json
│  └─ company-information.fhir-r4-questionnaire-response.json
└─ examples/
   └─ company-information.example.ts
```

## 1) Fixture: FHIR R4 Questionnaire JSON

`fixtures/company-information.fhir-r4-questionnaire.json` (trimmed but
realistic; includes required fields and a date)

```json
{
    "resourceType": "Questionnaire",
    "meta": {
        "profile": ["http://hl7.org/fhir/4.0/StructureDefinition/Questionnaire"]
    },
    "title": "Company Information",
    "status": "draft",
    "item": [
        {
            "type": "group",
            "linkId": "org-details",
            "text": "Organization Details",
            "item": [
                {
                    "linkId": "help-org-details",
                    "type": "display",
                    "text": "Provide essential information about your organization.",
                    "extension": [
                        {
                            "url": "http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl",
                            "valueCodeableConcept": {
                                "coding": [
                                    {
                                        "system": "http://hl7.org/fhir/questionnaire-item-control",
                                        "code": "help"
                                    }
                                ]
                            }
                        }
                    ]
                }
            ]
        },
        {
            "type": "string",
            "linkId": "715544477968",
            "text": "Organization Name",
            "required": true,
            "extension": [
                {
                    "url": "http://hl7.org/fhir/StructureDefinition/entryFormat",
                    "valueString": "Enter your organization name"
                }
            ]
        },
        {
            "type": "string",
            "linkId": "655141523763",
            "text": "Form Completed By",
            "required": true,
            "extension": [
                {
                    "url": "http://hl7.org/fhir/StructureDefinition/entryFormat",
                    "valueString": "Your full name"
                }
            ]
        },
        {
            "type": "date",
            "linkId": "276403539223",
            "text": "Assessment Date"
        },
        {
            "type": "group",
            "linkId": "identifiers",
            "text": "Organization Identifiers",
            "item": [
                {
                    "type": "string",
                    "linkId": "805221373063",
                    "text": "CAGE Code",
                    "extension": [
                        {
                            "url": "http://hl7.org/fhir/StructureDefinition/entryFormat",
                            "valueString": "5-character CAGE code"
                        }
                    ]
                },
                {
                    "type": "string",
                    "linkId": "374784155003",
                    "text": "DUNS Number",
                    "extension": [
                        {
                            "url": "http://hl7.org/fhir/StructureDefinition/entryFormat",
                            "valueString": "9-digit DUNS number"
                        }
                    ]
                }
            ]
        }
    ]
}
```

This is definition only; it does not render a form. It lets the generator
discover structure, data types, and requiredness for type-safe normalization
later.

See
[FHIR R4 Questionnaire resource and LHC Forms structures](fhir-r4-questionnaire-lhc-form-structure.md)
for more information.

## 2) Fixture: LHC JSON response

`fixtures/company-information.lhc-form-response.json` (keyed to the R4
questionnaire above by `linkId`, values in `value`).It can be created by the LHC
Form web widget. See
[FHIR R4 Questionnaire resource and LHC Forms structures](fhir-r4-questionnaire-lhc-form-structure.md)
for more information.

```json
{
    "lformsVersion": "38.2.0",
    "name": "Company Information",
    "items": [
        {
            "header": true,
            "dataType": "SECTION",
            "question": "Organization Details",
            "linkId": "org-details",
            "items": []
        },
        {
            "dataType": "ST",
            "question": "Organization Name",
            "linkId": "715544477968",
            "answerCardinality": { "min": "1" },
            "value": "Netspective Communications LLC"
        },
        {
            "dataType": "ST",
            "question": "Form Completed By",
            "linkId": "655141523763",
            "answerCardinality": { "min": "1" },
            "value": "Shahid N. Shah"
        },
        {
            "dataType": "DT",
            "question": "Assessment Date",
            "linkId": "276403539223",
            "value": "2025-08-16"
        },
        {
            "header": true,
            "dataType": "SECTION",
            "question": "Organization Identifiers",
            "linkId": "identifiers",
            "items": [
                {
                    "dataType": "ST",
                    "question": "CAGE Code",
                    "linkId": "805221373063",
                    "value": "12345"
                },
                {
                    "dataType": "ST",
                    "question": "DUNS Number",
                    "linkId": "374784155003",
                    "value": "123456789"
                }
            ]
        }
    ]
}
```

## 3) Fixture: FHIR QuestionnaireResponse

`fixtures/company-information.fhir-r4-questionnaire-response.json` (answers
appear in `item[].answer[].value*`)

```json
{
    "resourceType": "QuestionnaireResponse",
    "status": "completed",
    "item": [
        {
            "linkId": "715544477968",
            "answer": [{ "valueString": "Netspective Communications LLC" }]
        },
        {
            "linkId": "655141523763",
            "answer": [{ "valueString": "Shahid N. Shah" }]
        },
        { "linkId": "276403539223", "answer": [{ "valueDate": "2025-08-16" }] },
        {
            "linkId": "identifiers",
            "item": [
                {
                    "linkId": "805221373063",
                    "answer": [{ "valueString": "12345" }]
                },
                {
                    "linkId": "374784155003",
                    "answer": [{ "valueString": "123456789" }]
                }
            ]
        }
    ]
}
```

## 4) Generate the TypeScript module

Run the CLI from the repo root:

```bash
deno run -A ./r4qctl.ts ./fixtures/company-information.fhir-r4-questionnaire.json
```

Expected output:

```
./fixtures/company-information.auto.ts
```

Notes

- If you prefer a separate folder: `--outDir ./out`.
- To overwrite: `--force`.
- To inspect the generated code without writing: `--stdout`.
- To include the questionnaire source: `--include-src`.

## 5) Inspect the generated file (excerpt)

`fixtures/company-information.auto.ts` will import only from `../r4q-runtime.ts`
or `./r4q-runtime.ts` depending on relative paths. The interface and link map
will look like:

```ts
export const CompanyInformationLinkIds = {
    organizationName: "715544477968",
    formCompletedBy: "655141523763",
    assessmentDate: "276403539223",
    cageCode: "805221373063",
    dunsNumber: "374784155003",
} as const;

export interface CompanyInformation {
    /** Organization Name
     * linkId: 715544477968
     * FHIR type: string
     * Entry format: Enter your organization name
     * Section: Organization Details
     * Required: yes
     */
    organizationName: string;

    /** Form Completed By
     * linkId: 655141523763
     * FHIR type: string
     * Entry format: Your full name
     * Required: yes
     */
    formCompletedBy: string;

    /** Assessment Date
     * linkId: 276403539223
     * FHIR type: date
     * Required: no
     */
    assessmentDate?: Date;

    /** CAGE Code
     * linkId: 805221373063
     * FHIR type: string
     * Entry format: 5-character CAGE code
     * Section: Organization Identifiers
     * Required: no
     */
    cageCode?: string;

    /** DUNS Number
     * linkId: 374784155003
     * FHIR type: string
     * Entry format: 9-digit DUNS number
     * Section: Organization Identifiers
     * Required: no
     */
    dunsNumber?: string;
}
```

Adapter functions and the sample interpreter class are emitted below this and
use the common coercers. For date values, you’ll see `coerceDate(...)` ensuring
a `Date | undefined`.

When reviewing the generated `[*Questionnaire*]Interpreter` class, keep in mind
that this class is **deliberately simplistic** and is included primarily as an
**illustrative scaffold**. Its methods—`fromLhc()`,
`fromQuestionnaireResponse()`, `validateRequiredFields()`, and
`assessReadiness()`—demonstrate how normalized data can be pulled into the
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

## 6) Use the generated module from application code

`examples/company-information.example.ts`

```ts
#!/usr/bin/env -S deno run --allow-read
import {
    CompanyInformationInterpreter,
} from "../fixtures/company-information.auto.ts"; // adjust path as needed

// Load example payloads (simulating post-UI collection)
const lhc = JSON.parse(
    await Deno.readTextFile(
        "../fixtures/company-information.lhc-form-response.json",
    ),
);
const qr = JSON.parse(
    await Deno.readTextFile(
        "../fixtures/company-information.fhir-r4-questionnaire-response.json",
    ),
);

// Normalize from LHC using the sample interpreter
const fromLhc = CompanyInformationInterpreter.fromLhc(lhc);
console.log("[fromLhc] value:", fromLhc.value);
console.log("[fromLhc] validation:", fromLhc.validateRequiredFields());
console.log("[fromLhc] readiness:", fromLhc.assessReadiness());

// Normalize from QuestionnaireResponse
const fromQr = CompanyInformationInterpreter.fromQuestionnaireResponse(qr);
console.log("[fromQr] value:", fromQr.value);
console.log("[fromQr] validation:", fromQr.validateRequiredFields());
console.log("[fromQr] readiness:", fromQr.assessReadiness());

// Simple equality check for demonstration (ignoring Date identity vs. value)
function snapshot(v: unknown) {
    // convert Dates to ISO strings for comparison
    return JSON.parse(
        JSON.stringify(
            v,
            (_k, val) => val instanceof Date ? val.toISOString() : val,
        ),
    );
}

console.log(
    "[equivalent normalized?]",
    JSON.stringify(snapshot(fromLhc.value)) ===
        JSON.stringify(snapshot(fromQr.value)),
);
```

Run it:

```bash
deno run -A ./examples/company-information.example.ts
```

You should see:

- Two normalized objects with the same data (except the `Date` objects which
  serialize to the same ISO string).
- `validateRequiredFields()` returning `ok: true` for both, because the required
  fields are present.
- A readiness summary with counts and a `requiredCovered` ratio.

## 7) Minimal end-to-end test

Create `examples/company-information.e2e.test.ts`:

```ts
#!/usr/bin/env -S deno test --allow-read
import { assert, assertEquals } from "jsr:@std/assert@^1.0.0";
import { CompanyInformationInterpreter } from "../fixtures/company-information.auto.ts";

Deno.test("Company Information: LHC and QR normalize equivalently", async () => {
    const lhc = JSON.parse(
        await Deno.readTextFile(
            "../fixtures/company-information.lhc-form-response.json",
        ),
    );
    const qr = JSON.parse(
        await Deno.readTextFile(
            "../fixtures/company-information.fhir-r4-questionnaire-response.json",
        ),
    );

    const a = CompanyInformationInterpreter.fromLhc(lhc);
    const b = CompanyInformationInterpreter.fromQuestionnaireResponse(qr);

    const va = a.value;
    const vb = b.value;

    // Dates -> ISO for structural equality
    const iso = (x: any) =>
        JSON.parse(
            JSON.stringify(
                x,
                (_k, v) => v instanceof Date ? v.toISOString() : v,
            ),
        );

    assertEquals(iso(va), iso(vb), "normalized objects should match");

    const ra = a.validateRequiredFields();
    const rb = b.validateRequiredFields();

    assert(
        ra.ok,
        `LHC required fields should be present: ${JSON.stringify(ra)}`,
    );
    assert(
        rb.ok,
        `QR required fields should be present: ${JSON.stringify(rb)}`,
    );

    const sa = a.assessReadiness();
    const sb = b.assessReadiness();

    assertEquals(sa.totalRequired, 2);
    assertEquals(sb.totalRequired, 2);
    assertEquals(sa.missingRequired.length, 0);
    assertEquals(sb.missingRequired.length, 0);
});
```

Run tests:

```bash
deno test -A ./examples/company-information.e2e.test.ts
```

## 8) How this plugs into your stack

- Front end

  - Any UI library (Astro, React, Vue) renders controls and collects values.
  - After submission, you produce either LHC JSON or FHIR QuestionnaireResponse.
  - Feed that into the sample interpreter to get a type-safe object.
  - Learn from the sample interpreter how to use a rules engine or Javascript
    for extending.

- Back end and rules

  - The normalized object is ready for validation, transformation, rules
    engines, or persistence.
  - No UI coupling lives in this library.

```
[UI Widgets of your choice]  →  [LHC JSON | QuestionnaireResponse]
                                     │
                                     ▼
                          [Generated *.auto.ts sample Interpreter]
                                     │
                                     ▼
                         [Type-safe normalized object]
```

## 9) Troubleshooting

- “Not a Questionnaire” error: verify `resourceType === "Questionnaire"`.
- Empty items: the generator needs `item[]` with leaf question nodes.
- Wrong types: check `fhirTypeToTs()` in `r4q-runtime.ts` and ensure date,
  number, boolean mapping is what you expect.
- Choice unions: ensure your Questionnaire includes `answerOption`; otherwise
  `choice` becomes `string`.

## 10) Maintenance checklist for future editors

- Keep all shared logic in `r4q-runtime.ts`. Generated files must not copy
  helpers.
- When enhancing rendering or adapters, modify the render helpers and finders
  centrally, regenerate all `*.auto.ts`.
- When extending readiness scoring, do it inside your custom interpreter render
  helper so all generated modules stay aligned.
- If you add new FHIR features (e.g., support `valueCoding.display` preference),
  update the finder logic once, regenerate, and you’re done.

That’s the whole loop. If you drop these four files into a clean repo and run
the commands exactly as shown, you’ll have a passing E2E that proves the library
works and is easy to maintain.
