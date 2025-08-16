import { fromFileUrl } from "jsr:@std/path";
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
        console.dir(cii);
    });
});
