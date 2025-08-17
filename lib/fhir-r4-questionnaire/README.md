# Attest FHIR R4 Questionnaire → Type-Safe Module Generator

> See [example workflow](example-workflow.md) for technical details and
> [FHIR R4 Questionnaire resource and LHC Forms structures](fhir-r4-questionnaire-lhc-form-structure.md)
> to understand more about the details of how JSON is structured.

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
- Transform TypeScript to ESM Javascript for HTML/web.

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

- See [example workflow](example-workflow.md) for a full technical workflow.
- See also
  [FHIR R4 Questionnaire resource and LHC Forms structures](fhir-r4-questionnaire-lhc-form-structure.md).

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

/
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
`*.auto.ts` file, engineers should understand that this class is deliberately
simplistic and is included primarily as an illustrative scaffold. Its
methods—`fromLhc()`, `fromQuestionnaireResponse()`, `validateRequiredFields()`,
and `assessReadiness()`—demonstrate how normalized data can be pulled into the
strongly-typed interface and then checked for completeness. This is meant to
give developers a concrete starting point for working with normalized objects,
but it is not intended for production use as-is. The interpreter shows what’s
possible (basic coercion, required field checks, readiness scoring), but it is
not comprehensive enough for the complexity of real-world healthcare workflows
or compliance-heavy scenarios.

In a production system, these generated type-safe modules should be paired with
a proper rules engine or downstream processing layer. The generated interface
(`CompanyInformation`, for example) gives you the strict typing and normalized
field mapping, which ensures type safety across your application. What you do
with the typed object afterward—feeding it into a rules engine, validation
framework, business logic processor, or even plain JavaScript/TypeScript
functions—is up to the application design. The generated `Interpreter` exists to
show developers how to bootstrap that process quickly, but production-ready
validation, scoring, and workflow logic should live outside of these
auto-generated files. Think of the `Interpreter` as a sample harness: it
demonstrates the pattern, enforces consistency, and teaches usage, but you
should treat it as scaffolding to replace with domain-specific logic in your own
codebase.

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

## DevOps & Automation: CI/CD + Pre-Commit Hooks

Automation keeps the generated `*.auto.ts` files consistently in sync with their
`*.fhir-r4-questionnaire.json` sources. Use both CI/CD (server-side) and
pre-commit hooks (developer machines) to prevent drift.

- Never hand-edit generated files.
- Deterministic generation on every PR and on developer machines.
- Fast failure locally before code hits CI.

### Local Automation: Pre-Commit Hooks

1. Install Lefthook:

```bash
# macOS
brew install lefthook
# or use: curl -s https://raw.githubusercontent.com/evilmartians/lefthook/master/install.sh | bash
```

2. Add `lefthook.yml` to repo root:

- [ ] TODO: this code block is not accurate, needs to be created/updated

```yaml
pre-commit:
  parallel: false
  commands:
    generate-r4q:
      run: deno run -A ./scripts/generate-r4q.ts
    add-generated:
      stage_fixed: true
      run: git add ./src/generated
```

3. Enable hooks:

```bash
lefthook install
```

Lefthook will run the generator before each commit and include regenerated files
automatically.

### Repo Hygiene

- Do commit `*.auto.ts` (treat as build artifacts).
- Do not edit generated files by hand.
- Add/adjust Questionnaires only in `./*.fhir-r4-questionnaire.json`.
- Keep `r4q-resource-code-gen.ts` and `r4q-runtime.ts` versioned and
  deterministic.

### CI/CD Reminder (GitHub Actions)

Pair your local hooks with server-side enforcement so PRs fail if someone
bypasses hooks.

- [ ] TODO: this code block is not accurate, needs to be created/updated

```yaml
name: Generate Type-Safe Questionnaire Modules

on:
  push:
    paths: ["questionnaires/*.fhir-r4-questionnaire.json"]
  pull_request:
    paths: ["questionnaires/*.fhir-r4-questionnaire.json"]

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: denoland/setup-deno@v1
        with: { deno-version: v1.x }
      - name: Generate
        run: deno run -A ./r4qctl.ts questionnaires/*.fhir-r4-questionnaire.json --outDir ./src/generated --force
      - name: Verify generated files are committed
        run: |
          if [[ -n "$(git status --porcelain ./src/generated)" ]]; then
            echo "Generated files are out of sync. Run the generator and commit changes."
            git diff -- ./src/generated || true
            exit 1
          fi
```

> If you prefer CI to commit outputs, add a follow-up “Commit regenerated files”
> step as shown earlier.

### Developer Experience Tips

- Add a convenience script to `package.json` (even if you don’t otherwise use
  Node):

- [ ] TODO: this code block is not accurate, needs to be created/updated

```json
{
  "scripts": {
    "r4q:gen": "deno run -A ./scripts/generate-r4q.ts",
    "r4q:check": "deno run -A ./r4qctl.ts questionnaires/*.fhir-r4-questionnaire.json --outDir ./src/generated && git diff --exit-code -- ./src/generated"
  }
}
```

- Keep the generator’s output style stable (avoid time/date in emitted code
  except in comments).

With these hooks and CI checks in place, any change to a Questionnaire
definition will automatically regenerate its companion TypeScript module locally
and in CI, keeping the repo consistent and the Astro/React
reporting/interpretation code safely typed.

## Publishing generated TypeScript as JavaScript with `deno bundle`

It's a good idea to further automate to take the generated `*.auto.ts` modules
and produce distributable JavaScript bundles using `deno bundle`. The goal is to
make the normalized, type-safe adapters usable in browsers (via
`<script type="module">`), Astro/React client/server code, or any ESM-compatible
runtime—without requiring consumers to run TypeScript or Deno themselves.

- Produce self-contained ESM JavaScript bundles from the generated TypeScript.
- Keep one bundle per questionnaire or create a single “barrel” bundle that
  re-exports many questionnaires.
- Generate source maps to improve debugging in browsers and in Astro or React.
- Make output deterministic for CI/CD and caching.

### What gets bundled

Each generated `[title-kebab].auto.ts` imports only from `./r4q-runtime.ts`.
When you run `deno bundle` on a generated file, Deno will statically include the
referenced parts of `r4q-runtime.ts` in the output bundle. There are no other
runtime dependencies; JSR/Std modules are used only by the generator, not by
generated files.

### Prerequisites

- Deno installed on your build machine/CI agent.
- The generated `*.auto.ts` files exist and build successfully (run the
  generator first).

### Option A: bundle a single questionnaire

Example: bundle `company-information.auto.ts` for use in the browser or Astro.
See [Example Workflow](example-workflow.md) if you want to experiment. Remember,
in Astro or React you use the `.auto.ts` TypeScript directly but in the web
you'll use the transformed `*.esm.js`.

```bash
deno bundle \
  --quiet \
  --map=inline \
  ./src/generated/company-information.auto.ts \
  ./dist/company-information.esm.js
```

Notes

- Output is an ESM JavaScript file suitable for `<script type="module">` or ESM
  imports.
- `--map=inline` embeds a source map for easier debugging. Omit if you prefer a
  separate map: `--map=external`.

Usage in Astro (server or client component) as TypeScript:

```ts
// Server-side or client-side ESM import the TypeScript directly
import {
  CompanyInformationInterpreter,
} from "./src/generated/company-information.auto.ts";
```

Usage in the browser using CDN:

```html
<script type="module">
  import { CompanyInformationInterpreter } from "https://raw.githubusercontent.com/netspective-labs/attest/refs/heads/main/lib/fhir-r4-questionnaire/generated/mod.esm.js";

  // Example: normalize a QuestionnaireResponse object
  const qr = await fetch("/data/qr.json").then((r) => r.json());
  const interp = CompanyInformationInterpreter.fromQuestionnaireResponse(
    qr,
  );
  console.log(interp.validateRequiredFields(), interp.assessReadiness());
</script>
```

Usage in the browser if you bundled it with your app:

```html
<script type="module">
  import { CompanyInformationInterpreter } from "/assets/company-information.esm.js";

  // Example: normalize a QuestionnaireResponse object
  const qr = await fetch("/data/qr.json").then((r) => r.json());
  const interp = CompanyInformationInterpreter.fromQuestionnaireResponse(
    qr,
  );
  console.log(interp.validateRequiredFields(), interp.assessReadiness());
</script>
```

### Option B: create a “barrel” and bundle once

If you have multiple generated forms, create a small TypeScript barrel that
re-exports them, then bundle that single entry.

`src/generated/mod.ts`:

```ts
export * from "./company-information.auto.ts";
export * from "./policy-framework.auto.ts";
export * from "./vendor-risk.auto.ts";
// add more as needed
```

Bundle:

```bash
deno bundle \
  --quiet \
  --map=inline \
  ./src/generated/mod.ts \
  ./dist/forms.esm.js
```

Consumers can then import any exported symbol from `forms.esm.js`.

### Source maps

- Inline map: `--map=inline` (single file, convenient for CDN or file copy).
- External map: `--map=external` (produces `*.js` and `*.js.map`). Ensure the
  `.map` is published next to the JS.

### Reproducibility and caching

- Run the generator first so `*.auto.ts` are fresh.
- Keep Deno version pinned in CI and document it in the repo readme.
- Avoid embedding timestamps in emitted code (the generator’s banner comments
  are fine, but avoid using timestamps inside logic).
- Consider hashing inputs and publishing content-addressed filenames if you need
  long-lived CDN caching (e.g., `forms.esm.[hash].js`).

### CI workflow example: build bundles on every change

This GitHub Actions workflow regenerates type-safe modules and bundles them when
any questionnaire changes. It fails if bundles aren’t committed, or you can
switch to an auto-commit/push pattern.

```yaml
name: Build questionnaire bundles

on:
  push:
    paths:
      - "questionnaires/*.fhir-r4-questionnaire.json"
      - "r4q-runtime.ts"
      - "r4qctl.ts"
  pull_request:
    paths:
      - "questionnaires/*.fhir-r4-questionnaire.json"
      - "r4q-runtime.ts"
      - "r4qctl.ts"

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Deno
        uses: denoland/setup-deno@v1
        with:
          deno-version: v1.x

      - name: Generate type-safe modules
        run: |
          deno run -A ./r4qctl.ts \
            questionnaires/*.fhir-r4-questionnaire.json \
            --outDir ./src/generated --force

      - name: Bundle (barrel)
        run: |
          deno bundle --quiet --map=inline \
            ./src/generated/index.ts \
            ./dist/forms.esm.js

      - name: Verify dist is committed
        run: |
          if [[ -n "$(git status --porcelain ./src/generated ./dist)" ]]; then
            echo "Generated outputs are out of sync. Commit the changes."
            git diff -- ./src/generated ./dist || true
            exit 1
          fi
```

If you prefer CI to commit bundles automatically:

```yaml
- name: Commit regenerated files
  run: |
    git config --global user.name "GitHub Actions"
    git config --global user.email "actions@github.com"
    git add ./src/generated ./dist
    git commit -m "chore: regenerate TS and bundles" || echo "No changes"
    git push
```

### Publishing and distribution patterns

- External CDN: serve ESM bundles from GitHub `raw` CDN path and import via
  absolute URL in browser modules.
- GitHub Pages or any static host: place `./dist/*.js` (and `.map`) in a
  published directory. Use `<script type="module">` from your site.
- GitHub Releases artifacts: upload bundles during release; downstream projects
  download or pin versions.
- Internal CDN: serve ESM bundles from a CDN path and import via absolute URL in
  Astro/React or browser modules.

### Runtime environments

- Browser: ESM modules via `<script type="module">` work out of the box.
- Astro server or Node 18+: use the TypeScript `*.auto.ts` directly.

### Import maps and JSR

The generated `*.auto.ts` only import from `./r4q-runtime.ts`. After bundling,
there are no live imports from JSR or Deno Std in the output bundle. Consumers
don’t need Deno, JSR, or an import map at runtime—the bundle is self-contained.

### Performance tips

- Prefer the barrel approach to reduce HTTP round-trips in browsers.
- If bundles get large, consider splitting by route or feature and lazy-loading
  with dynamic `import()` in Astro or the browser.

### Troubleshooting

- “Cannot resolve import” during bundling: check relative paths in your barrel
  and that `r4q-runtime.ts` sits next to generated files expected by imports.
- Missing symbols after bundling: ensure you re-exported them from the barrel or
  targeted the right entry module.
- Large bundles: remove unused exports or split bundles per questionnaire.

### Example: end-to-end script

A simple script to regenerate everything and bundle a barrel, useful locally and
in CI.

```ts
#!/usr/bin/env -S deno run --allow-read --allow-write
// scripts/transform-r4q-to-esm.ts

// 1) regenerate TS from all questionnaires
const questionnaires: string[] = [];
for await (const e of Deno.readDir("questionnaires")) {
  if (e.isFile && e.name.endsWith(".fhir-r4-questionnaire.json")) {
    questionnaires.push(`questionnaires/${e.name}`);
  }
}
if (questionnaires.length) {
  const gen = new Deno.Command(Deno.execPath(), {
    args: [
      "run",
      "-A",
      "./r4qctl.ts",
      ...questionnaires,
      "--outDir",
      "./src/generated",
      "--force",
    ],
    stdin: "inherit",
    stdout: "inherit",
    stderr: "inherit",
  });
  const { code } = await gen.output();
  if (code !== 0) Deno.exit(code);
}

// 2) bundle the barrel
const bundle = new Deno.Command(Deno.execPath(), {
  args: [
    "bundle",
    "--quiet",
    "--map=inline",
    "./src/generated/index.ts",
    "./dist/forms.esm.js",
  ],
  stdin: "inherit",
  stdout: "inherit",
  stderr: "inherit",
});
const { code } = await bundle.output();
Deno.exit(code);
```

Run:

```bash
deno run -A ./scripts/transform-r4q-to-esm.ts
```

This produces `./dist/forms.esm.js` which you can import anywhere ESM is
supported.
