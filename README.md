# Attest Deterministic Questionnaire-based Assessment & Evaluation System

## Core Purpose and Vision

**Attest** is a robust, type-safe, and developer-friendly library for building
interactive and deterministic questionnaire-based data collection systems using
**FHIR R4 Questionnaires** and **LHC Forms** within the TypeScript ecosystem on
the server side but generating clean modular Javascript code for the client. We
assume that there will be plenty of useful UI widgets and UX components which
allow users to enter data (e.g. LHC Forms Web Widget). What gap Attest fills is
to bridge the gap between static JSON questionnaire and forms definitions and
the existing functional user interfaces for entering data to the missing layer
which allows detecting data integrity issues in the data collection exercises
and precise assessment for reliable reporting.

**Vision:** To empower developers of regulated systems and compliance lifecycles
to rapidly create secure, compliant, and intelligent data capture solutions
based on FHIR R4 Questionnaires, leveraging the power of TypeScript for
compile-time safety and Deno when CLI tools or independent services are needed
but NodeJS when used in web apps or server services when integrated with web
frameworks such as Astro.

## The "Attest" Concept

The name "Attest" perfectly encapsulates the library's philosophy:

- **Asking Questions:** Questionnaires are inherently about soliciting
  information.
- **Building Structured Inputs:** The library leverages FHIR R4 Questionnaire
  Resource JSON and LHC Forms Responses JSON.
- **Rely on Existing Libraries for UX:** The library does not facilitates the
  capture of user inputs but instead assumes that existing widgets and UX
  components do the work.
- **Assessing and Evaluating:** This is where the core "scoring" or "evaluation"
  system comes in. "Attest" implies verifying, confirming, and providing
  evidence-based conclusions from the responses. It’s about **certifying the
  interpretation** of the user's input against predefined criteria. A perfect
  example is a security tool like CMMC Self Assessment.
- **Deterministic Reports/Dashboards:** The output of "Attest" will be
  verifiable and consistent, allowing for reliable reporting—data that can be
  "attested to" as accurate and valid.

This library won't just process data; it will help **validate the truthfulness
or correctness** of responses based on the questionnaire's intent and rules.

## Key Functionalities

Attest will provide distinct modules or phases of operation:

### Questionnaire Definition Ingestion

- **Input:** Accepts FHIR R4 Questionnaire JSON resources and LHC Forms JSON
  responses.
- **Parsing & Validation:** Strict parsing against FHIR R4 Questionnaire schema.
  Validates references, group structures, item types, and initial answers.
- **Internal Representation:** Converts the FHIR Questionnaire into an
  optimized, type-safe internal data model suitable for code generation.

### Code Generation Engine

This is the heart of Attest, generating custom JavaScript/TypeScript code for
each questionnaire.

- **Type-Safe Bindings:** For every `Questionnaire.item` (questions, groups),
  generates corresponding TypeScript interfaces and classes representing the
  expected structure of `QuestionnaireResponse`. This provides strong typing for
  input fields and response objects.
- **UI Component Scaffolding (Optional/Integratable):** Generates boilerplate
  code (e.g., React/Vue/Svelte components) with placeholders that easily bind to
  specific FHIR item types (e.g., a `string` item becomes a text input, a
  `boolean` becomes a checkbox). This might be a separate module or example
  templates.
- **Dynamic UI Logic Generation:** Generates code for:
  - **Enable When:** Logic for conditionally showing/hiding questions based on
    other answers.
  - **Calculated Values:** Code to derive values from other responses (e.g., age
    from birth date).
  - **Constraints & Validation Rules:** Translates FHIR validation rules
    (`minLength`, `maxLength`, `regex`, `valueSet` binding) into client-side
    validation functions.
- **Response Model Generation:** Creates specific TypeScript interfaces for the
  `QuestionnaireResponse` structure tied directly to the `Questionnaire`
  definition.

### Response Capture & Validation

- **Runtime Validation:** The generated code will include functions to perform
  real-time validation as users input data, guiding them to correct responses.
- **Submission Validation:** Comprehensive validation of the complete
  `QuestionnaireResponse` against all FHIR rules and custom constraints before
  submission.
- **Error Handling:** Provides structured error reporting for invalid responses.

### Assessment and Evaluation Engine (The "Scoring" System)

This module operates on the captured `QuestionnaireResponse` and the original
`Questionnaire`.

- **Rule Definition:** Allows developers to define custom assessment rules
  (e.g., JSON configuration, DSL, or even TypeScript code) that map to specific
  questions or groups.
  - **Value Mapping:** Assigns numeric or categorical values to specific answers
    (e.g., "Yes" = 1 point, "No" = 0 points).
  - **Weighted Scoring:** Apply different weights to different
    questions/sections.
  - **Conditional Logic:** Rules that apply only if certain conditions are met
    (e.g., "if patient is male and over 50, then score question X differently").
  - **Complex Algorithms:** Support for defining custom JavaScript functions for
    complex scoring algorithms (e.g., QALY calculation, risk scores).
- **Outcome Derivation:** Based on the rules, Attest will deterministically
  calculate:
  - **Overall Score:** A single or multiple scores derived from the
    questionnaire.
  - **Categorization:** Assigning respondents to predefined categories (e.g.,
    "High Risk," "Low Risk").
  - **Flags/Alerts:** Generating specific flags if certain answer thresholds or
    combinations are met.
  - **Summary Statements:** Creating concise summaries based on the evaluation.
- **Audit Trail:** The assessment process should be transparent and auditable,
  potentially logging how each score or outcome was derived.

### Reporting and Dashboard Integration Hooks

- **Structured Output:** The output of the assessment engine will be highly
  structured (e.g., JSON objects containing scores, categories, flags).
- **Report-Ready Data:** This structured data is designed to be easily consumed
  by reporting tools or dashboard frameworks (e.g., for charting, aggregations).
- **Deterministic Output:** Emphasis on consistent results given the same input
  and rules, crucial for regulatory compliance and reliable analytics.
- **Data Export:** Provides utilities to export processed data in various
  formats suitable for downstream reporting systems.

## Architectural Considerations

- **Deno Native:** Leverages Deno's tooling, security model, and native
  TypeScript support. No `npm` or `node_modules`.
- **TypeScript First:** All generated code and internal logic will be in
  TypeScript, providing compile-time safety and better developer experience.
- **Modularity:** Designed as a collection of smaller, focused modules (parser,
  code generator, assessment engine) that can be used independently or together.
- **Extensibility:** Clear extension points for custom validation rules, UI
  component integrations, and complex scoring algorithms.
- **Performance:** Optimized for efficient parsing and code generation.
- **Zero Dependencies (where possible):** Minimizes external dependencies to
  reduce footprint and improve security.
- **Immutable Data Structures:** Favor immutable data to enhance predictability
  and reduce side effects during processing.

## High-Level Design Principles

- **FHIR Compliant:** Strict adherence to FHIR R4 Questionnaire and
  QuestionnaireResponse specifications.
- **Developer Experience (DX):** Intuitive APIs, clear documentation, generated
  code that is easy to understand and integrate.
- **Type Safety:** Maximize type safety throughout the library and in the
  generated code.
- **Security:** Follow Deno's secure-by-default principles; provide guidance on
  secure deployment.
- **Reproducibility:** Ensure that given the same Questionnaire definition and
  QuestionnaireResponse, the assessment results are always identical.
- **Scalability:** Designed to handle a large number of questionnaires and
  responses.

Attest will provide the essential plumbing to turn static FHIR Questionnaire
definitions into powerful, interactive, and intelligently assessed data
collection tools, solidifying the bridge between healthcare data standards and
functional applications.

---

Of course. Here is a description of how questions and "forms" are defined in
FHIR R4 Questionnaire resources, explained for a business analyst who is
familiar with JSON.

---

### The Core Resources: `Questionnaire` and `QuestionnaireResponse`

In FHIR R4, a questionnaire is split into two primary resources. Think of it
like this:

- **`Questionnaire`** is the **form definition**. It contains the questions,
  their types, the order, and any rules. It's the blueprint.
- **`QuestionnaireResponse`** is the **completed form**. It holds the answers a
  user provided, mirroring the structure of the `Questionnaire` it came from.

This separation is crucial for type safety and data integrity. The
`Questionnaire` defines the valid structure and types, while the
`QuestionnaireResponse` must adhere to them.

---

### The Structure of the `Questionnaire` Resource

The `Questionnaire` resource is a JSON object with a few key metadata fields and
a powerful, recursive `item` array.

```json
{
  "resourceType": "Questionnaire",
  "id": "health-assessment-2025",
  "url": "http://example.org/Questionnaire/health-assessment-2025",
  "title": "2025 Annual Health Assessment",
  "status": "active",
  "item": [
    // This is where the questions and groups go.
    // Each element in this array is an 'item'.
  ]
}
```

The magic happens in the **`item` array**. Each `item` object represents either
a question, a group of questions, or static display text. The `type` field
within each `item` determines its behavior.

### The `item` Object: Questions, Groups, and Display Text

Every `item` has a **`linkId`**, which is a unique string identifier for that
question or group within the questionnaire. This `linkId` is essential for
connecting a question in the `Questionnaire` to its answer in the
`QuestionnaireResponse`, ensuring type safety and consistency.

Here are the three main types of items:

- **`group`**: Organizes related questions or other groups. A group item has its
  own `text` and can contain a nested `item` array. **It does not have an
  answer.** This is how you create sections in your form.
- **`display`**: Provides instructional text or section headers. It has a `text`
  field but **no answers and no children**. It’s just for presentation.
- **`question`**: This is the most common and important type. It has a `text`
  field for the question prompt and a **`type`** that defines the expected data.
  This `type` is the key to achieving type safety.

### Question Types and Data Validation

The `type` field of a question item is a string that specifies the data type of
the answer. FHIR provides a comprehensive list of types that directly correspond
to the value that will be recorded in the `QuestionnaireResponse`.

| `item.type` (in Questionnaire) | Expected Answer Value (`value[x]`) | Description                                                              |
| :----------------------------- | :--------------------------------- | :----------------------------------------------------------------------- |
| `boolean`                      | `valueBoolean`                     | A simple `true`/`false` answer.                                          |
| `integer`                      | `valueInteger`                     | A whole number.                                                          |
| `decimal`                      | `valueDecimal`                     | A number with a decimal point.                                           |
| `string`                       | `valueString`                      | A short, single-line text field (e.g., a name).                          |
| `text`                         | `valueString`                      | A longer, multi-line text field (e.g., a comment).                       |
| `date`                         | `valueDate`                        | A date value in YYYY-MM-DD format.                                       |
| `dateTime`                     | `valueDateTime`                    | A date and time value in YYYY-MM-DDThh:mm:ss+zz:zz format.               |
| `time`                         | `valueTime`                        | A time of day value in hh:mm:ss format.                                  |
| `choice`                       | `valueCoding`                      | A single choice from a predefined list of options.                       |
| `open-choice`                  | `valueCoding` or `valueString`     | A choice from a list, plus the option to enter free text.                |
| `quantity`                     | `valueQuantity`                    | A number with a unit of measure (e.g., `5.5 kg`).                        |
| `attachment`                   | `valueAttachment`                  | A file, like a PDF or image.                                             |
| `reference`                    | `valueReference`                   | A reference to another FHIR resource, such as a patient or practitioner. |

To enforce these types, the `QuestionnaireResponse` uses a special pattern
called **`value[x]`**. This is a JSON property that changes its name based on
the data type.

For example, if the question type is `integer`, the answer property in the
`QuestionnaireResponse` will be `valueInteger`. If the type is `date`, it will
be `valueDate`. This is how the system maintains strict type-matching between
the definition and the response.

Here's an example `item` for a question and its corresponding answer:

**`Questionnaire` Item:**

```json
{
  "linkId": "dob",
  "text": "What is your date of birth?",
  "type": "date"
}
```

**Corresponding `QuestionnaireResponse` Answer:**

```json
{
  "linkId": "dob",
  "answer": [
    {
      "valueDate": "1990-05-15"
    }
  ]
}
```

This strict correspondence, identified by the `linkId` and enforced by the
`value[x]` naming convention, is how FHIR achieves **inherent type safety** even
in a flexible format like JSON.

---

### Defining Answer Options and Constraints

To further guide the user and ensure data quality, you can add more rules to a
question `item`:

- **`answerOption`**: For `choice` questions, this array defines the available
  answers inline. Each option is a `Coding` object with a `code` and `display`.
- **`answerValueSet`**: A more powerful method for `choice` questions. Instead
  of defining options inline, you reference an external **`ValueSet`** resource.
  This is critical for reusability and keeping forms and terminology separate.
- **`required`**: A `boolean` that indicates the user must provide an answer to
  this question.
- **`repeats`**: A `boolean` that allows the user to provide multiple answers
  for a single question (e.g., a list of medications).
- **`enableWhen`**: This is a powerful array of objects that define conditional
  logic. It allows you to show or hide a question based on the answer to another
  question. This provides dynamic form behavior directly within the form
  definition itself.

By combining these rules with the core `item` structure and the `value[x]`
type-matching, FHIR `Questionnaire` resources provide a robust and predictable
way to define forms and their data, making it an excellent foundation for
building reliable data systems and analytical dashboards.

---

A development strategy that combines FHIR R4 Questionnaires and LHC Forms offers
a powerful and flexible approach to data collection. The key is understanding
that FHIR provides the **data standard**, while LHC Forms provides the **user
interface and data capture engine**.

---

### The Workflow: From FHIR Definition to LHC Form Response

This process can be thought of as a three-stage pipeline: **Definition**,
**Collection**, and **Analysis**. The `linkId` serves as the constant thread
connecting each stage.

**Stage 1: Definition with FHIR R4 Questionnaire** 📋

A developer creates a FHIR R4 `Questionnaire` JSON resource. This is your
"source of truth" and serves as a formal, standardized blueprint for your form.
In this resource, every question or group is given a unique identifier called a
`linkId`.

For example, a question about a patient's weight would be defined like this:

```json
{
  "linkId": "weight",
  "text": "What is your weight (in kilograms)?",
  "type": "quantity"
}
```

This is a robust, machine-readable definition. It specifies not just the
question, but also the data type (`quantity`), ensuring that the answer will be
a number with a unit of measure.

---

**Stage 2: Data Collection with the LHC Forms Web Widget** 📝

The LHC Forms web widget is a user interface component that is designed to
consume FHIR Questionnaire resources. Instead of developers building forms from
scratch, they simply feed the `Questionnaire` JSON you've defined into the
widget.

1. **Rendering:** The widget reads the FHIR Questionnaire JSON and automatically
   renders a dynamic, interactive form on a web page. It understands the
   different `item.type`s and renders the appropriate input control—a text box
   for a `string`, a date picker for a `date`, and a number field with a unit
   for a `quantity`.
2. **User Input:** The user fills out the form. The widget handles all of the
   real-time, client-side validation based on the rules in the `Questionnaire`
   (e.g., ensuring a date is in the correct format).
3. **LHC Response Format:** When the user completes and submits the form, the
   LHC Forms widget generates a JSON object. This object is a **streamlined
   representation of the user's answers**, optimized for easy consumption by a
   backend service.

---

### The Role of `linkId`

The `linkId` is the bridge that makes this entire process work. It is the
single, constant identifier that ties a question from the original FHIR
`Questionnaire` definition to its corresponding answer in the LHC Forms
response.

**In the LHC Forms Response:** Instead of a complex, nested
`QuestionnaireResponse` object, the LHC Forms response provides a flat or
simplified JSON structure. Each answer is keyed by its `linkId`, making it
exceptionally easy to read and work with.

For the "weight" question from our example, the LHC Forms response might look
like this:

```json
{
  "weight": {
    "value": 75,
    "unit": "kg"
  }
}
```

Notice how the `linkId` (`"weight"`) from the FHIR Questionnaire is directly
used as the key in the LHC response. This simple key-value pair is much easier
for a developer or business analyst to process than a full FHIR
`QuestionnaireResponse` resource.

---

### Stage 3: Analysis, Evaluation, and Scoring 📊

This is where the power of the strategy becomes clear. Once you have the LHC
Forms response, you can easily use its data for analysis, evaluation, and
scoring.

- **Ease of Access:** Because the data is structured simply by `linkId`, you can
  instantly pull the value of any answer. This allows you to write
  deterministic, rule-based systems with minimal effort.
- **Assessment & Scoring:** Your backend code can directly access values using
  the `linkId` to perform calculations. For example, to calculate a BMI, your
  code could reference `"weight"` and `"height"` from the LHC response and apply
  your scoring logic.
- **Dashboards & Reporting:** The flat nature of the LHC response format is
  perfect for feeding into a dashboarding or reporting engine. You can use a
  `linkId` as a column header in a spreadsheet or a field name in a database,
  ensuring that your reports are directly and consistently tied back to the
  original form definition.

By using this approach, you maintain the rigor and standardization of FHIR R4
for your form definitions while gaining the simplicity and
developer-friendliness of the LHC Forms response for your back-end logic and
analytics.
