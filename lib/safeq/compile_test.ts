import { Questionnaire } from "./mod.ts";
import { compileQuestionnaire } from "./compile.ts";
import qDef from "../fhir-r4-questionnaire/fixtures/questionnaires/company-information.fhir-R4-questionnaire.json" with {
  type: "json",
};
import lhcAnswers from "../fhir-r4-questionnaire/fixtures/responses/company-information.lhc-form.json" with {
  type: "json",
};
import { assertEquals } from "jsr:@std/assert@1.0.14";

Deno.test("parse compiled", () => {
  const { schema: _zodSchema, parse } = compileQuestionnaire(
    qDef as Questionnaire,
    {
      choiceValue: "code", // prefer enums from answerOption
      openRoot: true,
    },
  );

  assertEquals(parse(lhcAnswers), {
    organizationName: "Netspective Communications LLC",
    formCompletedBy: "Shahid N. Shah",
    positionTitle: "Principal",
    emailAddress: "dont-spam@spam.com",
    workPhone: "+1 123-456-7891",
    mobilePhone: "+1 123-456-7891",
    assessmentDate: "2025-08-16",
    industry: "Frontier AI",
    employeeCount: "50",
    contractTypes: "Subcontract",
    organizationIdentifiers: { cageCode: "12345", dunsNumber: "123456789" },
    organizationDetails: {},
  });
});
