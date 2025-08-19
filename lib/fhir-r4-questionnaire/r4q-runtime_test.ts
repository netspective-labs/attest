#!/usr/bin/env -S deno test -A
/**
 * @file r4q-runtime_test.ts
 * Comprehensive unit tests for r4q-runtime.ts.
 *
 * These tests are designed to be readable and instructional for engineers who
 * will maintain both the runtime and the generators that depend on it.
 */

import {
    assert,
    assertArrayIncludes,
    assertEquals,
    assertFalse,
    assertStrictEquals,
} from "jsr:@std/assert@^1.0.0";

import {
    coerceBoolean,
    coerceDate,
    coerceNumber,
    coerceOptionalBoolean,
    coerceOptionalDate,
    coerceOptionalNumber,
    coerceOptionalString,
    coerceOptionalStringArray,
    coerceString,
    collectChoiceLiterals,
    // Types
    type FhirQItem,
    type FhirQuestionnaire,
    fhirTypeToTs,
    // Finders
    findLhcValueByLinkId,
    findQrAnswerByLinkId,
    // Traversal & extraction
    flattenItems,
    getEntryFormat,
    // Coercers
    isBlank,
    // FHIR helpers
    isDisplayHelp,
    // Case & name utils
    splitWords,
    toCamelCase,
    toKebabCase,
    toPascalCase,
    uniqueName,
} from "./r4q-runtime.ts";

/* -----------------------------------------------------------------------------
 * Case & name utils
 * ---------------------------------------------------------------------------*/

Deno.test("splitWords: splits on non-alphanumerics and camelCase boundaries", () => {
    assertEquals(splitWords("Organization Name"), ["organization", "name"]);
    assertEquals(splitWords("organization_name"), ["organization", "name"]);
    assertEquals(splitWords("OrganizationName"), ["organization", "name"]);
    assertEquals(splitWords("Org-Name.v1"), ["org", "name", "v1"]);
    assertEquals(splitWords(""), []);
});

Deno.test("toPascalCase / toCamelCase / toKebabCase", () => {
    assertEquals(toPascalCase("organization name"), "OrganizationName");
    assertEquals(toCamelCase("organization name"), "organizationName");
    assertEquals(toKebabCase("organization name"), "organization-name");

    // Mixed punctuation and cases
    assertEquals(toPascalCase("Org_Name-2025"), "OrgName2025");
    assertEquals(toCamelCase("Org_Name-2025"), "orgName2025");
    assertEquals(toKebabCase("Org_Name-2025"), "org-name-2025");
});

Deno.test("uniqueName: de-duplicates with numeric suffixes", () => {
    const used = new Set<string>();
    assertEquals(uniqueName("field", used), "field");
    assertEquals(uniqueName("field", used), "field2");
    assertEquals(uniqueName("field", used), "field3");
    assertEquals(uniqueName("", used), "field4"); // base fallback
});

/* -----------------------------------------------------------------------------
 * FHIR helpers
 * ---------------------------------------------------------------------------*/

Deno.test("isDisplayHelp: detects display/help via questionnaire-itemControl", () => {
    const helpItem: FhirQItem = {
        type: "display",
        linkId: "h1",
        text: "Helpful hint",
        extension: [{
            url: "http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl",
            valueCodeableConcept: {
                coding: [{
                    system: "http://hl7.org/fhir/questionnaire-item-control",
                    code: "help",
                }],
            },
        }],
    };

    const nonHelpDisplay: FhirQItem = {
        type: "display",
        linkId: "d1",
        text: "Just display",
    };

    assert(isDisplayHelp(helpItem));
    assertFalse(isDisplayHelp(nonHelpDisplay));
});

Deno.test("getEntryFormat: returns the entryFormat extension value", () => {
    const item: FhirQItem = {
        type: "string",
        linkId: "x",
        text: "Email",
        extension: [{
            url: "http://hl7.org/fhir/StructureDefinition/entryFormat",
            valueString: "you@example.com",
        }],
    };
    assertStrictEquals(getEntryFormat(item), "you@example.com");

    const itemNoExt: FhirQItem = { type: "string", linkId: "y" };
    assertStrictEquals(getEntryFormat(itemNoExt), undefined);
});

Deno.test("collectChoiceLiterals: prefers valueString, then coding.code, then numeric", () => {
    const item: FhirQItem = {
        type: "choice",
        linkId: "c",
        answerOption: [
            { valueString: "Alpha" },
            { valueCoding: { code: "BRAVO", display: "Bravo" } },
            { valueInteger: 42 },
            { valueCoding: { display: "NoCodeDisplay", system: "sys" } },
        ],
    };
    const lits = collectChoiceLiterals(item)!;
    // order is not guaranteed by Set iteration, but we can check inclusion
    assertArrayIncludes(lits, ["Alpha", "BRAVO", "42", "NoCodeDisplay"]);
});

Deno.test("fhirTypeToTs: maps FHIR primitives to TypeScript", () => {
    assertStrictEquals(fhirTypeToTs("integer"), "number");
    assertStrictEquals(fhirTypeToTs("decimal"), "number");
    assertStrictEquals(fhirTypeToTs("boolean"), "boolean");
    assertStrictEquals(fhirTypeToTs("date"), "Date");
    assertStrictEquals(fhirTypeToTs("dateTime"), "Date");
    assertStrictEquals(fhirTypeToTs("string"), "string");
    assertStrictEquals(fhirTypeToTs("text"), "string");
    assertStrictEquals(fhirTypeToTs("unknown-type"), "string");
});

/* -----------------------------------------------------------------------------
 * Traversal & extraction: flattenItems
 * ---------------------------------------------------------------------------*/

Deno.test("flattenItems: flattens leaves, preserves order, captures help text and trails", () => {
    const q: FhirQuestionnaire = {
        resourceType: "Questionnaire",
        title: "Company Information",
        item: [
            {
                type: "group",
                linkId: "section-1",
                text: "Org Details",
                item: [
                    {
                        type: "display",
                        linkId: "help-1",
                        text: "Provide org info.",
                        extension: [{
                            url: "http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl",
                            valueCodeableConcept: {
                                coding: [{
                                    system:
                                        "http://hl7.org/fhir/questionnaire-item-control",
                                    code: "help",
                                }],
                            },
                        }],
                    },
                    {
                        type: "string",
                        linkId: "name",
                        text: "Organization Name",
                        required: true,
                    },
                    {
                        type: "date",
                        linkId: "assessDate",
                        text: "Assessment Date",
                    },
                ],
            },
            {
                type: "group",
                linkId: "section-2",
                text: "Identifiers",
                item: [
                    {
                        type: "choice",
                        linkId: "kind",
                        text: "Org Kind",
                        answerOption: [{ valueString: "public" }, {
                            valueString: "private",
                        }],
                    },
                    { type: "string", linkId: "cage", text: "CAGE Code" },
                ],
            },
        ],
    };

    const used = new Set<string>();
    const titleCamel = toCamelCase(q.title!);
    const titlePascal = toPascalCase(q.title!);
    const { fields, formHelp } = flattenItems(
        titleCamel,
        titlePascal,
        q.item,
        used,
    );

    // Help captured
    assertEquals(formHelp, ["Provide org info."]);

    // Order preserved: Organization Name, Assessment Date, Org Kind, CAGE Code
    assertEquals(fields.map((f) => f.text), [
        "Organization Name",
        "Assessment Date",
        "Org Kind",
        "CAGE Code",
    ]);

    // Trails captured for each
    assertEquals(fields[0].groupTrail, ["Org Details"]);
    assertEquals(fields[1].groupTrail, ["Org Details"]);
    assertEquals(fields[2].groupTrail, ["Identifiers"]);
    assertEquals(fields[3].groupTrail, ["Identifiers"]);

    // Types inferred
    assertStrictEquals(fields[0].tsType, "string");
    assertStrictEquals(fields[1].tsType, "Date");
    assertEquals(fields[2].tsType, `"public" | "private"`); // choice union
    assertStrictEquals(fields[3].tsType, "string");

    // Requiredness
    assert(fields[0].required);
    assertFalse(fields[1].required);

    // Form title annotations passed through
    for (const f of fields) {
        assertStrictEquals(f.formTitleCamelCase, titleCamel);
        assertStrictEquals(f.formTitlePascalCase, titlePascal);
    }

    // Property names are stable and unique (generated from labels)
    const names = fields.map((f) => f.propName);
    assertEquals(new Set(names).size, names.length);
});

/* -----------------------------------------------------------------------------
 * Coercers: optional + defaulted variants
 * ---------------------------------------------------------------------------*/

Deno.test("isBlank: detects blank values", () => {
    assert(isBlank(null));
    assert(isBlank(undefined));
    assert(isBlank(""));
    assert(isBlank("   "));
    assert(isBlank([]));
    assert(isBlank(new Date("invalid")));
    assert(isBlank(NaN));
    assertFalse(isBlank("x"));
    assertFalse(isBlank([1]));
    assertFalse(isBlank(0));
    assertFalse(isBlank(new Date()));
});

Deno.test("coerceOptionalString / coerceString", () => {
    assertStrictEquals(coerceOptionalString("x"), "x");
    assertStrictEquals(coerceOptionalString(10), "10");
    assertStrictEquals(coerceOptionalString(true), "true");
    const d = new Date("2025-01-01T00:00:00Z");
    assertStrictEquals(coerceOptionalString(d), d.toISOString());
    assertStrictEquals(coerceOptionalString(undefined), undefined);

    assertStrictEquals(coerceString("x"), "x");
    assertStrictEquals(coerceString(undefined, "DEF"), "DEF");
});

Deno.test("coerceOptionalNumber / coerceNumber", () => {
    assertStrictEquals(coerceOptionalNumber(42), 42);
    assertStrictEquals(coerceOptionalNumber("3.14"), 3.14);
    assertStrictEquals(coerceOptionalNumber("bad"), undefined);
    assertStrictEquals(coerceNumber("7"), 7);
    assertStrictEquals(coerceNumber(undefined, 99), 99);
});

Deno.test("coerceOptionalBoolean / coerceBoolean", () => {
    assertStrictEquals(coerceOptionalBoolean(true), true);
    assertStrictEquals(coerceOptionalBoolean(false), false);
    assertStrictEquals(coerceOptionalBoolean("YES"), true);
    assertStrictEquals(coerceOptionalBoolean("no"), false);
    assertStrictEquals(coerceOptionalBoolean(1), true);
    assertStrictEquals(coerceOptionalBoolean(0), false);
    assertStrictEquals(coerceOptionalBoolean("maybe"), undefined);

    assertStrictEquals(coerceBoolean("maybe", true), true);
});

Deno.test("coerceOptionalDate / coerceDate", () => {
    const d = new Date("2025-02-02T00:00:00Z");
    assertEquals(coerceOptionalDate(d), d);
    assertEquals(coerceOptionalDate("2025-02-02"), new Date("2025-02-02"));
    assertStrictEquals(coerceOptionalDate("not a date"), undefined);

    const fallback = new Date("2020-01-01T00:00:00Z");
    // coerceDate returns defaultValue when invalid
    assertEquals(coerceDate("invalid", fallback), fallback);
});

/* -----------------------------------------------------------------------------
 * Finders: LHC and QuestionnaireResponse
 * ---------------------------------------------------------------------------*/

Deno.test("findLhcValueByLinkId: DFS across nested items", () => {
    const lhc = {
        items: [
            {
                header: true,
                linkId: "section",
                items: [
                    { linkId: "a", value: "Value A" },
                    { linkId: "b", value: 123 },
                    {
                        header: true,
                        linkId: "sub",
                        items: [
                            { linkId: "c", value: "Value C" },
                            { linkId: "d" }, // no value
                        ],
                    },
                ],
            },
        ],
    };

    assertStrictEquals(findLhcValueByLinkId(lhc, "a"), "Value A");
    assertStrictEquals(findLhcValueByLinkId(lhc, "b"), 123);
    assertStrictEquals(findLhcValueByLinkId(lhc, "c"), "Value C");
    assertStrictEquals(findLhcValueByLinkId(lhc, "d"), undefined);
    assertStrictEquals(findLhcValueByLinkId(lhc, "missing"), undefined);
});

Deno.test("findLhcValueByLinkId: retrieves values from single-key objects and arrays", () => {
    const lhc = {
        items: [
            {
                header: true,
                linkId: "section",
                items: [
                    {
                        "dataType": "CODING",
                        "question": "Do you have an Access Control Policy?",
                        "questionCode": "744146359806",
                        "questionCodeSystem": "LinkId",
                        "linkId": "744146359806",
                        "value": {
                            "text": "Yes"
                        }
                    },
                    {
                        "dataType": "TITLE",
                        "question": "How many accounts are currently in your systems?",
                        "questionCode": "182548770364",
                        "questionCodeSystem": "LinkId",
                        "linkId": "182548770364",
                    },
                    {
                        "dataType": "INT",
                        "question": "Active user accounts:",
                        "questionCode": "927965645729",
                        "questionCodeSystem": "LinkId",
                        "linkId": "927965645729",
                        "value": 250
                    },
                    {
                        "dataType": "CODING",
                        "question": "Does your organization have a documented access control policy that addresses:",
                        "questionCode": "669545773690",
                        "questionCodeSystem": "LinkId",
                        "linkId": "669545773690",
                        "value": [
                            {
                                "text": "Purpose, scope, roles, and responsibilities"
                            },
                            {
                                "text": "Compliance requirements"
                            }
                        ]
                    }
                ],
            },
        ],
    };
    assertEquals(
        findLhcValueByLinkId(lhc, "744146359806"),
        { text: "Yes" },
    );
    assertStrictEquals(findLhcValueByLinkId(lhc, "182548770364"), undefined);
    assertStrictEquals(findLhcValueByLinkId(lhc, "927965645729"), 250);
    assertEquals(
        findLhcValueByLinkId(lhc, "669545773690"),
        [
            { text: "Purpose, scope, roles, and responsibilities" },
            { text: "Compliance requirements" }
        ]
    );
});

Deno.test("findLhcValueByLinkId: coerces object and array values into strings", () => {
    const lhc = {
        items: [
            {
                header: true,
                linkId: "section",
                items: [
                    {
                        "dataType": "CODING",
                        "question": "Do you have an Access Control Policy?",
                        "questionCode": "744146359806",
                        "questionCodeSystem": "LinkId",
                        "linkId": "744146359806",
                        "value": {
                            "text": "Yes"
                        }
                    },
                    {
                        "dataType": "TITLE",
                        "question": "How many accounts are currently in your systems?",
                        "questionCode": "182548770364",
                        "questionCodeSystem": "LinkId",
                        "linkId": "182548770364",
                    },
                    {
                        "dataType": "INT",
                        "question": "Active user accounts:",
                        "questionCode": "927965645729",
                        "questionCodeSystem": "LinkId",
                        "linkId": "927965645729",
                        "value": 250
                    },
                    {
                        "dataType": "CODING",
                        "question": "Does your organization have a documented access control policy that addresses:",
                        "questionCode": "669545773690",
                        "questionCodeSystem": "LinkId",
                        "linkId": "669545773690",
                        "value": [
                            {
                                "text": "Purpose, scope, roles, and responsibilities"
                            },
                            {
                                "text": "Compliance requirements"
                            }
                        ]
                    }
                ],
            },
        ],
    };
    assertEquals(coerceOptionalString(findLhcValueByLinkId(lhc, "744146359806")), "Yes");
    assertStrictEquals(findLhcValueByLinkId(lhc, "182548770364"), undefined);
    assertStrictEquals(findLhcValueByLinkId(lhc, "927965645729"), 250);
    assertEquals(
        coerceOptionalStringArray(findLhcValueByLinkId(lhc, "669545773690")),
        ["Purpose, scope, roles, and responsibilities", "Compliance requirements"]
    );
});

Deno.test("findQrAnswerByLinkId: prefers coding.code, then display/system, then value* primitives", () => {
    const qr = {
        resourceType: "QuestionnaireResponse",
        status: "completed",
        item: [
            {
                linkId: "choice1",
                answer: [{
                    valueCoding: {
                        code: "ALPHA",
                        display: "Alpha",
                        system: "sys",
                    },
                }],
            },
            {
                linkId: "choice2",
                answer: [{
                    valueCoding: { display: "NoCode", system: "sysX" },
                }],
            },
            {
                linkId: "date1",
                answer: [{ valueDate: "2025-08-16" }],
            },
            {
                linkId: "str1",
                answer: [{ valueString: "hello" }],
            },
            {
                linkId: "grp",
                item: [
                    { linkId: "nestedNum", answer: [{ valueInteger: 77 }] },
                ],
            },
        ],
    };

    assertStrictEquals(findQrAnswerByLinkId(qr, "choice1"), "ALPHA");
    assertStrictEquals(findQrAnswerByLinkId(qr, "choice2"), "NoCode");
    assertStrictEquals(findQrAnswerByLinkId(qr, "date1"), "2025-08-16");
    assertStrictEquals(findQrAnswerByLinkId(qr, "str1"), "hello");
    assertStrictEquals(findQrAnswerByLinkId(qr, "nestedNum"), 77);
    assertStrictEquals(findQrAnswerByLinkId(qr, "missing"), undefined);
});

/* -----------------------------------------------------------------------------
 * Integration-ish: build a minimal questionnaire and flatten it
 * ---------------------------------------------------------------------------*/

Deno.test("flattenItems: integrates helpers (entryFormat, choice literals, required flags)", () => {
    const qItems: FhirQItem[] = [
        {
            type: "group",
            linkId: "s1",
            text: "Section A",
            item: [
                {
                    type: "string",
                    linkId: "email",
                    text: "Email Address",
                    required: true,
                    extension: [{
                        url: "http://hl7.org/fhir/StructureDefinition/entryFormat",
                        valueString: "you@example.com",
                    }],
                },
                {
                    type: "choice",
                    linkId: "dept",
                    text: "Department",
                    answerOption: [{ valueString: "engineering" }, {
                        valueString: "sales",
                    }],
                },
            ],
        },
    ];

    const used = new Set<string>();
    const { fields, formHelp } = flattenItems(
        "companyInformation",
        "CompanyInformation",
        qItems,
        used,
    );

    assertEquals(formHelp.length, 0);
    assertEquals(fields.length, 2);

    const email = fields[0];
    assertStrictEquals(email.propName, "emailAddress");
    assertStrictEquals(email.entryFormat, "you@example.com");
    assert(email.required);

    const dept = fields[1];
    assertEquals(dept.tsType, `"engineering" | "sales"`);
    assertEquals(dept.choiceLiterals, ["engineering", "sales"]);
});
