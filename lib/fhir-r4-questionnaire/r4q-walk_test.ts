import { fromFileUrl, relative } from "jsr:@std/path@1.1.2";
import { assert, assertEquals } from "jsr:@std/assert@1.0.14";
import { Walker } from "./r4q-walk.ts";

function relativeToCWD(path: string) {
  return relative(Deno.cwd(), fromFileUrl(import.meta.resolve(path)));
}

Deno.test("Walker with fixtures", async () => {
  const walker = new Walker({
    workDir: Deno.makeTempDirSync({
      dir: relative(fromFileUrl(import.meta.resolve("./")), "./"),
      prefix: "r4q-walk_test-",
    }),
    questionnairesHome: relativeToCWD("./fixtures/questionnaires"),
    respHome: relativeToCWD("./fixtures/responses"),
  });

  await walker.walk();

  assertEquals(
    walker.questionnaires.size,
    8,
    "Should have discovered 8 questionnaires",
  );

  assertEquals(
    walker.responses.length,
    8,
    "Should have discovered 1 responses",
  );

  const companyInfo = walker.responses.find(
    (r) => r.lhcFormTitle === "Company Information",
  );
  assert(companyInfo, "Should have discovered Company Information response");
  assert(companyInfo.isValidLhcForm, "Should have valid LHC Form response");
  assert(
    companyInfo.isValidTransformed,
    "Should have valid transformed response",
  );

  assertEquals({
    companyInformationOrganizationName: "Netspective Communications LLC",
    companyInformationFormCompletedBy: "Shahid N. Shah",
    companyInformationPositionTitle: "Principal",
    companyInformationEmailAddress: "dont-spam@spam.com",
    companyInformationWorkPhone: "+1 123-456-7891",
    companyInformationMobilePhone: "+1 123-456-7891",
    companyInformationAssessmentDate: new Date("2025-08-16"),
    companyInformationIndustry: "Frontier AI",
    companyInformationEmployeeCount: "50",
    companyInformationContractTypes: "Subcontract",
    companyInformationCageCode: "12345",
    companyInformationDunsNumber: "123456789",
  }, companyInfo?.transformed);
});
