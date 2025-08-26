import {
    assert,
    assertEquals,
    assertExists,
    assertThrows,
} from "jsr:@std/assert@1.0.14";

import {
    lhcFormSchema,
    lhcFormStrictSchema,
    questionnaireResponseSchema,
    QuestionnaireResponseStrict,
    questionnaireResponseStrictSchema,
    questionnaireSchema,
    QuestionnaireStrict,
    questionnaireStrictSchema,
} from "./mod.ts";

// deno-lint-ignore no-explicit-any
type Any = any;

function clone<T>(v: T): T {
    return structuredClone(v);
}

Deno.test("Questionnaire (open) — minimal parses & retains unknowns", () => {
    const input = {
        resourceType: "Questionnaire",
        status: "draft",
        foo: { bar: 1 }, // unknown at root
        item: [
            {
                linkId: "root",
                type: "group",
                baz: "qux", // unknown on item
            },
        ],
    };

    const parsed = questionnaireSchema.parse(clone(input));

    // Basic checks
    assertEquals(parsed.resourceType, "Questionnaire");
    assertEquals(parsed.status, "draft");

    // Unknowns should be retained in open schema
    assertExists(parsed.foo);
    assertEquals((parsed.item?.[0] as Any)?.baz, "qux");
});

Deno.test("Questionnaire (strict) — rejects unknowns", () => {
    const bad = {
        resourceType: "Questionnaire",
        status: "draft",
        extra: true, // unknown
    };
    assertThrows(() => questionnaireStrictSchema.parse(clone(bad)));
});

Deno.test("Questionnaire (open) — choice answerOption with initialSelected", () => {
    const input = {
        resourceType: "Questionnaire",
        status: "active",
        item: [
            {
                linkId: "q1",
                type: "choice",
                answerOption: [
                    { valueCoding: { code: "A" }, initialSelected: true },
                    { valueCoding: { code: "B" } },
                ],
            },
        ],
    };

    const parsed = questionnaireSchema.parse(clone(input));
    assertEquals((parsed.item?.[0] as Any)?.answerOption?.length, 2);
    assertEquals(
        (parsed.item?.[0] as Any)?.answerOption?.[0]?.initialSelected,
        true,
    );
});

/* ----------------------------------------------------------------------------
 * QuestionnaireResponse (open vs strict)
 * --------------------------------------------------------------------------*/

Deno.test("QuestionnaireResponse (open) — minimal parses & retains unknowns", () => {
    const input = {
        resourceType: "QuestionnaireResponse",
        status: "completed",
        unknownTop: 42, // unknown at root
        item: [
            {
                linkId: "q1",
                text: "Your name?",
                answer: [
                    { valueString: "Alice", unknownInAnswer: "ok" }, // unknown in answer
                ],
                unknownInItem: true,
            },
        ],
    };

    const parsed = questionnaireResponseSchema.parse(clone(input));
    assertEquals(parsed.status, "completed");
    assertEquals((parsed.item?.[0] as Any)?.answer?.[0]?.valueString, "Alice");

    // Unknowns retained
    assertEquals(parsed.unknownTop, 42);
    assertEquals((parsed.item?.[0] as Any)?.unknownInItem, true);
    assertEquals((parsed.item?.[0] as Any)?.answer?.[0]?.unknownInAnswer, "ok");
});

Deno.test("QuestionnaireResponse (strict) — rejects unknowns", () => {
    const bad = {
        resourceType: "QuestionnaireResponse",
        status: "in-progress",
        extra: "nope",
    };
    assertThrows(() => questionnaireResponseStrictSchema.parse(clone(bad)));
});

Deno.test("QuestionnaireResponse (open) — nested answer.item allowed", () => {
    const input = {
        resourceType: "QuestionnaireResponse",
        status: "completed",
        item: [
            {
                linkId: "group1",
                item: [
                    {
                        linkId: "q1",
                        answer: [
                            {
                                valueString: "Yes",
                                item: [
                                    {
                                        linkId: "q1a",
                                        text: "Explain?",
                                        answer: [{ valueString: "Because" }],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    };

    const parsed = questionnaireResponseSchema.parse(clone(input));
    assertEquals(
        (parsed.item?.[0] as Any)?.item?.[0]?.answer?.[0]?.valueString,
        "Yes",
    );
    assertEquals(
        (parsed.item?.[0] as Any)?.item?.[0]?.answer?.[0]?.item?.[0]?.answer
            ?.[0]
            ?.valueString,
        "Because",
    );
});

/* ----------------------------------------------------------------------------
 * LHC Form (open vs strict)
 * --------------------------------------------------------------------------*/

Deno.test("LHC Form (open) — minimal parses & retains unknowns", () => {
    const input = {
        name: "demo-form",
        customKnob: { a: 1 }, // unknown at root
        items: [
            {
                question: "Age",
                dataType: "INT",
                extraItemKey: "x", // unknown on item
            },
        ],
    };

    const parsed = lhcFormSchema.parse(clone(input));
    assertEquals(parsed.name, "demo-form");
    assertEquals(parsed.items?.length, 1);

    // Unknowns retained
    assertEquals((parsed as Any).customKnob.a, 1);
    assertEquals((parsed.items?.[0] as Any)?.extraItemKey, "x");
});

Deno.test("LHC Form (strict) — rejects unknowns", () => {
    const bad = {
        name: "strict-form",
        unexpected: true,
    };
    assertThrows(() => lhcFormStrictSchema.parse(clone(bad)));
});

Deno.test("LHC Form (open) — supports answers & units arrays", () => {
    const input = {
        name: "choice-form",
        items: [
            {
                question: "Pick one",
                dataType: "CNE",
                answers: [{ text: "A", code: "a" }, { text: "B", code: "b" }],
                units: [{ name: "mm[Hg]" }],
            },
        ],
    };

    const parsed = lhcFormSchema.parse(clone(input));
    assertEquals((parsed.items?.[0] as Any)?.answers?.length, 2);
    assertEquals((parsed.items?.[0] as Any)?.units?.[0]?.name, "mm[Hg]");
});

/* ----------------------------------------------------------------------------
 * Smoke test: strict schemas accept valid shapes without unknowns
 * --------------------------------------------------------------------------*/

Deno.test("Strict schemas — accept clean payloads", () => {
    const qStrictOk: QuestionnaireStrict = {
        resourceType: "Questionnaire",
        status: "active",
        item: [{ linkId: "root", type: "group" }],
    };
    assert(questionnaireStrictSchema.parse(clone(qStrictOk)));

    const qrStrictOk: QuestionnaireResponseStrict = {
        resourceType: "QuestionnaireResponse",
        status: "completed",
        item: [{ linkId: "q1", answer: [{ valueString: "ok" }] }],
    };
    assert(questionnaireResponseStrictSchema.parse(clone(qrStrictOk)));

    const lhcStrictOk = {
        name: "ok",
        items: [{ question: "Q1", dataType: "ST" }],
    };
    assert(lhcFormStrictSchema.parse(clone(lhcStrictOk)));
});
