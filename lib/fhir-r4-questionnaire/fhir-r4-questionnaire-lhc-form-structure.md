# FHIR R4 Questionnaire resource and LHC Forms structures

## The Core Resources: `Questionnaire` and `QuestionnaireResponse` and LHC Forms

In FHIR R4, a questionnaire is split into two primary resources. Think of it
like this:

- **`Questionnaire`** is the **form definition**. It contains the questions,
  their types, the order, and any rules. It's the blueprint.
- **`QuestionnaireResponse`** is the **completed form**. It holds the answers a
  user provided, mirroring the structure of the `Questionnaire` it came from.

This separation is crucial for type safety and data integrity. The
`Questionnaire` defines the valid structure and types, while the
`QuestionnaireResponse` must adhere to them.

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

A development strategy that combines FHIR R4 Questionnaires and LHC Forms offers
a powerful and flexible approach to data collection. The key is understanding
that FHIR provides the **data standard**, while LHC Forms provides the **user
interface and data capture engine**.

## From FHIR Definition to LHC Form Response

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
