# AI Coding Agent Prompt: FHIR R4 Questionnaire Type-Safe Module Generator

**Overall Goal:** Generate a Deno TypeScript module (`[QuestionnaireTitle.KebabCase].auto.ts`) that provides a type-safe representation and interpretation layer for a given FHIR R4 Questionnaire Resource. This module will support data from both LHC Forms JSON responses (which use `linkId`s as direct keys) and standard FHIR R4 `QuestionnaireResponse` resources, normalizing both into a consistent, easily consumable type.

-----

### Input Specifications

The AI agent will receive two primary inputs:

1.  **FHIR R4 Questionnaire Resource JSON:** This is the definitional source for the form's structure, questions, and expected data types. The agent must parse this JSON to infer the necessary TypeScript interfaces and mapping logic.

      * **Example Input (for context of types and structure, NOT to be hardcoded):**
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

2.  **LHC Form JSON Response Example:** This is the definitional source for the LHC JSON response to the questions mapped to FHIR R4 JSON where `linkId`s are direct keys to the values in the item `value` key. The agent must parse this JSON to infer the necessary TypeScript interfaces and mapping logic.

      * **Example LHC Response Structure (for context, derived from the above Questionnaire):**
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
-----

### Output Specifications (Deno TypeScript Module)

The AI agent must generate a single Deno TypeScript file (`r4q-resource-to-ts.ts`).

This Deno module will use Cliffy for command-line interaction and will provide a type-safe interface for the code generator.

The modeule will accept a FHIR R4 Questionnaire Resource JSON file as input and generate a type-safe module sent to STDOUT which is then piped to a file named `QuestionnaireTitle.KebabCase].auto.ts`. The `QuestionnaireTitle.KebabCase].auto.ts` file will be a type-safe TypeScript module representation of the FHIR R4 Questionnaire Resource:

  * The primary normalized interface will be `[QuestionnaireTitle]` (e.g., `CompanyInformation`).
  * The LHC response adapter which returns primary normalized interface will be `[QuestionnaireTitle]LhcFormResponseAdapter` (e.g., `CompanyInformationLhcFormResponseAdapter`).
  * The main interpretation class will be `[QuestionnaireTitle]Interpreter` (e.g., `CompanyInformationInterpreter`).

**Module Structure (mimicking the provided example):**

```typescript
/**
 * @file Company-Information.auto.ts
 * @description
 * This module provides type-safe interfaces and classes for managing data from the
 * "Company Information" FHIR R4 Questionnaire in CMMC Self-Assessments. It focuses
 * on separating data representation from data source, ensuring strict type safety
 * at the field level, and facilitating clear data conversion.
 */

/**
 * Defines the type-safe structure for the 'Company Information' form data,
 * independent of its original source (LHC Forms or FHIR R4).
 * This represents the normalized, easily consumable view of the questionnaire responses.
 * TODO find the R4 details of this form to give the programmer context; find the help
 * comment associated with this form in the FHIR Questionnaire and make it a JSDoc comment and add it 
 * to the interface documentation. Give as much context as possible from the original FHIR Questionnaire.
 */
export interface CompanyInformation {
    /**
     * TODO find the R4 answer type of field and other details to give the programmer context; find the help
     * comment associated with this field in the FHIR Questionnaire *and make it a JSDoc comment and add it 
     * to the interface. Give as much context as possible from the original FHIR Questionnaire.
     */
    organizationName: string; 
    formCompletedBy: string;
    positionTitle?: string;
    emailAddress: string;
    workPhone: string;
    mobilePhone: string;
    assessmentDate?: Date; // required conversion to Date type in adapter
    industry?: string;
    employeeCount?: string;
    contractTypes?: string;
    cageCode?: string;
    dunsNumber?: string;
}

/**
 * Adapts an LHC Forms JSON response to the normalized CompanyInformation structure.
 */
export class LhcFormResponseAdapter {
    /**
     * Converts the LHC Forms response data into the CompanyInformation interface structure.
     * @returns The normalized CompanyInformation data.
     */
    public static toCompanyInformation(
        lhcResponse: object,
    ): CompanyInformation {
        // FIXME: This should be adapted to the actual LHC Forms response structure.
        // TODO: Implement the actual mapping logic based on the LHC Forms response structure using the `linkId` from the FHIR R4 Questionnaire.
        return {
            organizationName: "TODO", // find the linkId for organizationName in lhcResponse and fill it out, convert to proper JS type
            formCompletedBy: "TODO", // find the linkId for formCompletedBy in lhcResponse and fill it out, convert to proper JS type
            positionTitle: "TODO", // find the linkId for positionTitle in lhcResponse and fill it out, convert to proper JS type
            emailAddress: "TODO", // find the linkId for emailAddress in lhcResponse and fill it out, convert to proper JS type
            workPhone: "TODO", // find the linkId for workPhone in lhcResponse and fill it out, convert to proper JS type
            mobilePhone: "TODO", // find the linkId for mobilePhone in lhcResponse and fill it out, convert to proper JS type
            assessmentDate: "TODO", // find the linkId for assessmentDate in lhcResponse and fill it out, convert to proper JS type
            industry: "TODO", // find the linkId for industry in lhcResponse and fill it out, convert to proper JS type
            employeeCount: "TODO", // find the linkId for employeeCount in lhcResponse and fill it out, convert to proper JS type
            contractTypes: "TODO", // find the linkId for contractTypes in lhcResponse and fill it out, convert to proper JS type
            cageCode: "TODO", // find the linkId for cageCode in lhcResponse and fill it out, convert to proper JS type
            dunsNumber: "TODO", // find the linkId for dunsNumber in lhcResponse and fill it out, convert to proper JS type
        };
    }
}

/**
 * Represents the "Company Information" assessment and evaluation instance,
 * providing type-safe access to its answers.
 */
export class CompanyInformationInterpreter {
    /**
     * This constructor expects data to already be in the normalized
     * CompanyInformation format. Use the static factory methods.
     * @param normalizedResponse The normalized LHC Forms JSON response object.
     */
    constructor(readonly companyInformation: CompanyInformation) {
    }

    /**
     * Performs basic validation based on the 'required' fields in the original
     * FHIR Questionnaire.
     * @returns An object indicating validity and a list of missing required fields.
     */
    validateRequiredFields(): { isValid: boolean; missingFields: string[] } {
        const missing: string[] = [];

        // Check directly against the internal _data, which is now always the LHC-like format.
        const ctx = this.companyInformation;
        if (!ctx.organizationName) missing.push("Organization Name");
        if (!ctx.formCompletedBy) missing.push("Form Completed By");
        if (!ctx.emailAddress) missing.push("Email Address");
        if (!ctx.workPhone) missing.push("Work Phone");
        if (!ctx.mobilePhone) missing.push("Mobile Phone");

        return { isValid: missing.length === 0, missingFields: missing };
    }

    /**
     * An example method to perform a simple assessment based on the collected data.
     * This can be expanded significantly for more complex scoring logic.
     * @returns A simple assessment object.
     */
    assessCompanyComplianceReadiness(): {
        status: "Incomplete" | "Needs Review" | "Good Start";
        notes: string[];
    } {
        const { isValid, missingFields } = this.validateRequiredFields();
        if (!isValid) {
            return {
                status: "Incomplete",
                notes: [`Missing required fields: ${missingFields.join(", ")}`],
            };
        }

        const ctx = this.companyInformation;
        const notes: string[] = [];
        let status: "Needs Review" | "Good Start" = "Good Start";

        if (!ctx.cageCode || !ctx.dunsNumber) {
            notes.push(
                "CAGE Code and DUNS Number are highly recommended for CMMC compliance.",
            );
            status = "Needs Review";
        }

        if (!ctx.industry) {
            notes.push(
                "Providing an industry helps categorize the organization.",
            );
        }

        if (!ctx.employeeCount) {
            notes.push("Employee count can be useful for scale assessment.");
        }

        if (!ctx.contractTypes) {
            notes.push(
                "Knowing contract types provides context on defense engagement.",
            );
        }

        return { status, notes };
    }
}
```