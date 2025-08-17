import { fromFileUrl } from "jsr:@std/path";
import { assertEquals } from "jsr:@std/assert";
import * as ci from "./company-information.auto.ts";

Deno.test("Company Information Questionnaire", async (t) => {
  await t.step("should load properly", () => {
    const lhcForm = JSON.parse(Deno.readTextFileSync(
      fromFileUrl(import.meta.resolve(
        "../fixtures/responses/Company-Information.lhc-form.json",
      )),
    ));
    const cii = ci.CompanyInformationInterpreter.fromLhcFormResponse(
      lhcForm,
    );
    assertEquals({
      organizationName: "Netspective Communications LLC",
      formCompletedBy: "Shahid N. Shah",
      positionTitle: "Principal",
      emailAddress: "dont-spam@spam.com",
      workPhone: "+1 123-456-7891",
      mobilePhone: "+1 123-456-7891",
      assessmentDate: cii.value.assessmentDate, // since date is dynamic, we just check that it exists
      industry: "Frontier AI",
      employeeCount: "50",
      contractTypes: "Subcontract",
      cageCode: "12345",
      dunsNumber: "123456789",
    }, cii.value);
  });
});
