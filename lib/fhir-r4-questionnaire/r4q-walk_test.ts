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
        1,
        "Should have discovered 1 response",
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
        organizationName: "Netspective Communications LLC",
        formCompletedBy: "Shahid N. Shah",
        positionTitle: "Principal",
        emailAddress: "dont-spam@spam.com",
        workPhone: "+1 123-456-7891",
        mobilePhone: "+1 123-456-7891",
        assessmentDate: companyInfo?.transformed?.assessmentDate, // since date is dynamic, we just check that it exists
        industry: "Frontier AI",
        employeeCount: "50",
        contractTypes: "Subcontract",
        cageCode: "12345",
        dunsNumber: "123456789",
    }, companyInfo?.transformed);
});
