import { generateTsCodeForQuestionnaire } from "./r4q-resource-code-gen.ts";

Deno.test("r4qctl CLI", async (t) => {
    const outputDir = "generated";
    await t.step("should write to specified output directory", async () => {
        const inputPath =
            "./fixtures/questionnaires/Company-Information.fhir-R4-questionnaire.json";
        const stdout: string[] = [];
        const result = await generateTsCodeForQuestionnaire(inputPath, {
            outDir: outputDir,
            force: true,
        }, stdout);
        if (result) {
            throw result;
        }
    });
});
