# Attest Deterministic Questionnaire-based Assessment & Evaluation System

## Core Purpose and Vision

Attest is a robust, type-safe, and developer-friendly library for building
interactive and deterministic questionnaire-based data collection systems using
FHIR R4 Questionnaires and LHC Forms within the TypeScript ecosystem on the
server side but generating clean modular Javascript code for the client. We
assume that there will be plenty of useful UI widgets and UX components which
allow users to enter data (e.g. LHC Forms Web Widget). What gap Attest fills is
to bridge the gap between static JSON questionnaire and forms definitions and
the existing functional user interfaces for entering data to the missing layer
which allows detecting data integrity issues in the data collection exercises
and precise assessment for reliable reporting.

Vision: To empower developers of regulated systems and compliance lifecycles to
rapidly create secure, compliant, and intelligent data capture solutions based
on FHIR R4 Questionnaires, leveraging the power of TypeScript for compile-time
safety and Deno when CLI tools or independent services are needed but NodeJS
when used in web apps or server services when integrated with web frameworks
such as Astro.

## The "Attest" Philosophy

The Attest system, instead of being a single, monolithic application, is
strategically designed as a collection of _independent and composable libraries
and components_. This modular approach ensures that each phase of the
questionnaire-based assessment process can evolve separately, be replaced with
alternatives, or be reused in different contexts without impacting the others.
This document outlines this architecture, emphasizing how each phase contributes
to a robust and flexible assessment system.

### The Four Independent and Composable Phases of Attest

The entire assessment workflow, from defining a questionnaire to presenting its
insights, is broken down into four distinct yet interconnected phases. This
separation of concerns is fundamental to Attest's design.

#### Structured Data Definition: FHIR R4 Questionnaire as the Schema 📋

At the foundational layer, the FHIR R4 Questionnaire JSON serves as the
structured data schema for data collection. This is where the questions are
defined, their types (string, date, quantity, etc.), their order, grouping, and
any fundamental constraints (like required fields).

- Independence: The FHIR Questionnaire JSON is a standardized, machine-readable
  blueprint that exists independently of any particular user interface or
  processing logic. It's a universal contract for what data to collect and how
  it's structured. This means you could define a questionnaire once and use it
  across multiple different systems or applications.
- Composability: Because it's a standard JSON format, it can be easily stored,
  versioned in source control, shared across organizations, and even transformed
  or combined with other FHIR resources. Attest leverages this by _reading_
  these definitions to generate type-safe code, but the definition itself stands
  alone.

#### Data Collection: LHC Forms or Other UI Web Widgets 📝

This phase focuses purely on the user interface for data input. While LHC Forms
is a prominent example of a web widget capable of consuming a FHIR R4
Questionnaire JSON and rendering a user-friendly form, this phase is not limited
to it. Any web UI component or application could be built or adapted to collect
data according to the FHIR Questionnaire schema.

- Independence: The UI widget is independent of the underlying FHIR definition
  (it consumes the schema, but doesn't _define_ it) and also independent of the
  interpretation rules. You can swap out LHC Forms for a custom React form, a
  different vendor's widget, or even a mobile app, as long as it adheres to the
  data schema defined by the FHIR Questionnaire.
- Composability: A developer could easily compose different UI elements or even
  entirely different front-end frameworks to create the data collection
  experience, all while being guided by the central FHIR schema. The output of
  this phase is the collected data, typically in a flattened JSON structure
  (like the LHC Forms response) or a FHIR `QuestionnaireResponse`.
- Ease of Access: Because the response data is structured simply by `linkId`
  that matches the original questionnaire, you can instantly pull the value of
  any answer. This allows you to write deterministic, rule-based systems with
  minimal effort. See
  [FHIR R4 Questionnaire resource and LHC Forms structures](lib/fhir-r4-questionnaire/fhir-r4-questionnaire-lhc-form-structure.md)
  for more information.

#### Interpretation and Assessment: Declarative & Imperative Rules 🧠

This is where the raw collected data transforms into meaningful insights. Attest
champions a hybrid approach for defining the business rules that drive
interpretation and assessment:

- Declarative Rules (within FHIR extensions): For simple, localized business
  logic, a fantastic strategy is to embed it declaratively as FHIR R4 extensions
  directly within the `Questionnaire` JSON. For example, a `valueInteger` for a
  question's score or a basic `if-then` condition for an `enableWhen` rule can
  be expressed in the JSON. This makes the rule visible right next to the
  question it applies to.
  - Attest's Code Generator: Attest uses a "code generator" strategy to read
    these declarative rules from the FHIR Questionnaire JSON and automatically
    convert them into corresponding, type-safe TypeScript code. This means the
    rules are expressed declaratively in JSON but executed imperatively in code,
    blending the best of both worlds. This is ideal when rules are simple and
    don't require external editing by non-developers.
- Imperative Rules (Type-Safe TypeScript/JavaScript): For complex business
  logic—such as multi-question scoring algorithms, intricate conditional flows,
  external API calls, or nuanced risk calculations—pure, imperative
  TypeScript/JavaScript functions are the best "rules engine." These functions
  operate on the normalized, type-safe questionnaire response objects (generated
  by Attest's conversion layer).
  - Independence: The interpretation logic is separate from the UI and the raw
    definition. You can change how you calculate a risk score without touching
    the form's appearance or its FHIR definition.
  - Composability: These TypeScript functions are highly reusable. They can be
    composed together to form complex assessment pipelines, and because they're
    just code, they integrate seamlessly into any JavaScript runtime
    environment, including web frameworks like Astro/React. The best "rules
    engine" might just be type-safe TypeScript in Astro using React to produce
    HTML, or plain JavaScript functions in an HTML file doing the same,
    especially when end-users don't need to edit rules directly.

#### Presentation: UI and AI Usage 📊

The final phase involves presenting the results of the interpretation and
assessment to the end-user. This could range from simple score displays to
complex, interactive dashboards, or even AI-generated summaries and
recommendations.

- Independence: The presentation layer is decoupled from the data collection and
  interpretation phases. You can completely redesign the dashboard or switch
  from a static report to an interactive AI assistant without altering how data
  is collected or how rules are applied.
- Composability: This phase benefits from modern web development stacks (like
  Astro with React, or other JavaScript-based frameworks) that excel at building
  dynamic user interfaces. AI models can consume the interpreted, structured
  data to generate narrative summaries, predictive insights, or personalized
  guidance, further enhancing the composability of the system.

### Attest: A Collection of Libraries and Components for Composable Assessments

In essence, Attest is not a monolithic application where all functionalities are
tightly coupled. Instead, it's a collection of specialized libraries and
components, each expertly handling a specific concern in the
questionnaire-driven assessment pipeline. This philosophy of independence and
composability provides:

- Flexibility: Easily swap out components in any phase without disrupting the
  others.
- Maintainability: Changes or bug fixes in one component are isolated, reducing
  risk.
- Scalability: Each phase can be scaled independently based on demand.
- Reusability: Components (like the `CompanyInformationInterpreter` or its
  adapters) can be reused across different questionnaires or even different
  projects.
- Future-Proofing: Adopt new technologies or standards in one phase without a
  full system overhaul.

By embracing this highly modular and composable architecture, Attest empowers
developers to build sophisticated, adaptable, and maintainable assessment
solutions that leverage the power of FHIR R4 and modern web technologies.

## Code Generation Engine

[This library](lib/fhir-r4-questionnaire/README.md) is the heart of Attest,
generating custom JavaScript/TypeScript code for each questionnaire.

- Type-Safe Bindings: For every `Questionnaire.item` (questions, groups),
  generates corresponding TypeScript interfaces and classes representing the
  expected structure of `QuestionnaireResponse`. This provides strong typing for
  input fields and response objects.
- Response Model Generation: Creates specific TypeScript interfaces for the LHC
  Form and `QuestionnaireResponse` structure tied directly to the
  `Questionnaire` definition.

## Assessment and Evaluation Engine (The "Scoring" System)

> Harnessing type-safe questionnaire responses for deterministic interpretation.

Once Attest has successfully read a FHIR R4 Questionnaire Resource and
transformed its corresponding LHC Form JSON response into a type-safe TypeScript
object, these objects become prime candidates for immediate interpretation and
evaluation.

Think of the questionnaire response object as a neatly organized, labeled set of
facts derived directly from the user's input tied to the structured data request
in a questionnaire. Each field, like `organizationName` or `cageCode`, is
precisely typed, meaning you know exactly what kind of data to expect. This
clarity is paramount for applying business logic accurately. For instance, if
you need to determine CMMC compliance readiness, having `cageCode` as a
`string | undefined` allows your code to reliably check its presence and format
without wrestling with ambiguous JSON structures or potential runtime errors.

### Business Rules Systems: Rules Engines Explained

A "business rules" system is often formalized as a _rules engine_. At its core,
a rules engine is a software component that executes pre-defined business logic
(rules) against a set of data. It separates the business logic from the
application code, making rules potentially easier to manage, update, and
understand by non-developers, especially if the engine includes a user-friendly
interface for rule creation.

Common characteristics of rules engines include:

- Declarative Rules: Rules are often expressed in a human-readable, declarative
  format (e.g., "IF customer age is < 18 THEN apply child discount").
- Rule Execution Engine: A component that processes data against these rules.
- Inference/Reasoning: Some engines can perform forward-chaining (deducing new
  facts from existing ones) or backward-chaining (finding facts to satisfy a
  goal).

It might seem like a natural next step to integrate a sophisticated rules engine
into your Attest infrastructure to handle the assessment logic. And indeed, for
many systems, this is a great idea.

### Attest's Hybrid Rules Engine Strategy: Declarative in FHIR + Imperative TypeScript

For Attest, where the goal is deterministic assessment and evaluation based on a
predefined questionnaire structure as a data collection exercise, the "best"
rules engine isn't necessarily an external, monolithic system. Instead, an
excellent strategy leverages Attest's code generation capabilities to create a
powerful, flexible, and integrated rules engine using a mixture of declarative
and imperative styles.

#### Simple, Declarative Rules as FHIR R4 Questionnaire Extensions

A core strength of FHIR R4 is its extensibility. You can embed custom
information and logic within standard resources like `Questionnaire` using
extensions. This opens up a powerful avenue for defining basic business logic
directly alongside the questions they apply to.

- How it Works: For simple, _declarative_ business logic, you can define custom
  FHIR extensions within the `Questionnaire.item` objects. These extensions can
  represent:
  - Scoring Weights: An extension on a `choice` or `integer` item that assigns a
    specific numeric value to each answer option or a multiplier for a numerical
    input.
  - Simple Categorization Rules: An extension that, based on a specific answer,
    assigns a preliminary category (e.g., "RiskLevel: Low" if
    `smokingStatus = 'never smoker'`).
  - Basic Conditions: Simple `IF-THEN` statements directly linked to a single
    question's answer, perhaps triggering a flag.

- Attest's Role as a Code Generator: Since Attest adopts a "code generator"
  strategy, it's perfectly positioned to read these extensions. The code
  generator can be designed to:
  - Parse Extensions: Identify and understand your custom-defined rule
    extensions.
  - Generate TypeScript Logic: Automatically translate these declarative rules
    into corresponding, type-safe TypeScript/JavaScript functions or properties
    within the generated modules. For instance, an extension
    `{"url": "http://example.org/fhir/StructureDefinition/questionnaire-score", "valueInteger": 5}`
    on an answer option could directly translate into generated code that adds 5
    points when that option is selected.

This approach means that your basic business logic lives _with_ the form
definition in a standardized (FHIR) and easily versionable JSON format.

#### Imperative TypeScript for Complex Rules

However, it is crucial to recognize the limitations: doing things declaratively
for complex rules is generally not a good idea.

If a rule involves:

- Multiple cross-question dependencies that are hard to express simply.
- Complex mathematical algorithms.
- Integration with external data sources.
- Sophisticated temporal logic (e.g., "if patient was diagnosed with X _after_ Y
  date and _before_ Z date").
- Logic that needs to be debugged interactively and stepped through. Then trying
  to represent it purely declaratively within FHIR extensions becomes
  cumbersome, unreadable, and brittle. The JSON can become unwieldy, hard to
  validate, and difficult for even developers to reason about.

Then:

- In such cases, the best "rules engine" is still type-safe TypeScript in a
  functional coding style, deployed within a modern web framework like Astro
  using React (or even plain JavaScript functions in an HTML file).
  - Clarity and Maintainability: Complex logic is far more readable and
    maintainable when written imperatively in well-structured TypeScript
    functions.
  - Debugging: Developers can leverage standard IDE debugging tools, unit tests,
    and powerful language features.
  - Performance: Executing complex logic directly in optimized JavaScript is
    often more performant than interpreting it through a generic rules engine
    runtime.

#### Benefits of this Hybrid Approach:

- Simple, question-specific rules are clear and tied directly to the form
  definition.
- Attest automates the translation of these simple declarative rules into
  executable code, reducing manual effort and potential errors.
- You get the best of both worlds: simple declarative rules are automatically
  processed, while complex algorithms are handled by robust, imperative
  JavaScript functions that can operate on the normalized response object.
- Since your assessments are deterministic and don't require end-users to edit
  rules, you avoid the overhead and complexity of building or integrating a
  separate rule management system. Your "rule editor" for simple rules is
  effectively the FHIR Questionnaire JSON itself, and for complex rules, it's
  your TypeScript IDE.

### Attest's Pragmatic and Powerful Combination

For Attest, the optimal strategy for interpretation and evaluation is a
pragmatic combination:

1. Leverage Attest's core capability to transform raw LHC Form JSON (or FHIR
   `QuestionnaireResponse`) into highly structured, type-safe
   `CompanyInformation` (or equivalent) TypeScript objects.
2. Define straightforward, question-level business rules using FHIR extensions
   within the `Questionnaire` resource. Attest's code generator will
   automatically translate these into executable TypeScript.
3. For more intricate, cross-cutting, or algorithmic business rules, write them
   directly in pure, functional TypeScript/JavaScript functions. These functions
   will consume the normalized `CompanyInformation` objects produced by Attest.
4. Integrate this generated and handwritten assessment logic seamlessly within
   your web application (e.g., Astro + React), enabling deterministic
   calculations and clear presentation of results.

This approach ensures that your assessment system is powerful, maintainable, and
perfectly aligned with the strengths of FHIR, TypeScript, Deno, and modern web
development practices, without over-engineering with unnecessary external
components.

## Reporting and Dashboard Integration

TODO

## Architectural Considerations

- Deno Native Code Generator: Leverages Deno's tooling, security model, and
  native TypeScript support. No `npm` or `node_modules` so that generated code
  is clean and dependency-free.
- TypeScript First: All generated code and internal logic will be in TypeScript,
  providing compile-time safety and better developer experience.
- Modularity: Designed as a collection of smaller, focused modules (parser, code
  generator, assessment engine) that can be used independently or together.
- Extensibility: Clear extension points for custom validation rules, UI
  component integrations, and complex scoring algorithms.
- Performance: Optimized for efficient parsing and code generation.
- Zero Dependencies (where possible): Minimizes external dependencies to reduce
  footprint and improve security.
- Immutable Data Structures: Favor immutable data to enhance predictability and
  reduce side effects during processing.

## High-Level Design Principles

- FHIR R4 and LHC Form Compliant: Strict adherence to FHIR R4 Questionnaire and
  QuestionnaireResponse specifications.
- Developer Experience (DX): Intuitive APIs, clear documentation, generated code
  that is easy to understand and integrate.
- Type Safety: Maximize type safety throughout the library and in the generated
  code.
- Security: Follow Deno's secure-by-default principles; provide guidance on
  secure deployment.
- Reproducibility: Ensure that given the same Questionnaire definition and
  QuestionnaireResponse, the assessment results are always identical.
- Scalability: Designed to handle a large number of questionnaires and
  responses.

Attest will provide the essential plumbing to turn static questionnaire
definitions into powerful, interactive, and intelligently assessed data
collection tools, solidifying the bridge between healthcare data standards and
functional applications.
