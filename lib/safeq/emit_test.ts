import { basename, fromFileUrl, join } from "jsr:@std/path@^1.1.2";
import { assert, assertEquals } from "jsr:@std/assert@1.0.14";
import { CompiledQuestionnaire, compileQuestionnaire } from "./compile.ts";
import { emitZodTs } from "./emit.ts";

import lhcAnswers from "../fhir-r4-questionnaire/fixtures/responses/company-information.lhc-form.json" with {
  type: "json",
};

// deno-lint-ignore no-explicit-any
type Any = any;

const qHome = fromFileUrl(
  import.meta.resolve("../fhir-r4-questionnaire/fixtures/questionnaires"),
);

Deno.test("emit and test compiled", async (t) => {
  const genTsCodeFName = "./emit_test.auto.ts";

  const qCompiled = new Map<
    string,
    { cq: CompiledQuestionnaire; tsSrc: string }
  >();
  for await (const q of Deno.readDir(qHome)) {
    if (q.isFile && q.name.endsWith(".fhir-R4-questionnaire.json")) {
      const cq = compileQuestionnaire(
        JSON.parse(await Deno.readTextFile(join(qHome, q.name))),
      );
      const isFirst = qCompiled.size == 0;
      const tsSrc = emitZodTs(cq, {
        schemaTsIdentifier: `${cq.identifier("camel-case")}Schema`,
        tsTypeIdentifier: cq.identifier("pascal-case"),
        includeHeaderComment: false,
        includeZodImport: isFirst,
      }).tsCode.join("\n");
      qCompiled.set(basename(q.name), { cq, tsSrc });
    }
  }

  await Deno.writeTextFile(
    fromFileUrl(import.meta.resolve(genTsCodeFName)),
    Array.from(qCompiled.values().map((cq) => cq.tsSrc)).join("\n\n"),
  );

  const module = await import(genTsCodeFName);
  // TODO: assert creation in zod.globalRegistry using Zod meta()

  await t.step("Company Information", () => {
    const ciCQ = qCompiled.get(
      "company-information.fhir-R4-questionnaire.json",
    );
    assert(ciCQ);

    const answers = ciCQ.cq.parse(lhcAnswers);
    const result = (module as Any).companyInformationSchema.parse(answers);
    assertEquals(result, {
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
      organizationIdentifiers: {
        cageCode: "12345",
        dunsNumber: "123456789",
      },
    });
  });
});
