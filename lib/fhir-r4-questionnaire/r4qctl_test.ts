import { fromFileUrl } from "jsr:@std/path";
import { generateTsCodeForQuestionnaire } from "./r4q-resource-code-gen.ts";

Deno.test("r4qctl CLI", async (t) => {
    const outputDir = "generated";
    for (
        const src of [
            "Access-Control-(Limit-information-system-access-to-authorized-users-and-processes).fhir-R4-questionnaire.json",
            "Company-Information.fhir-R4-questionnaire.json",
            "Identification-&-Authentication-(Verify-identities-of-users-and-processes).fhir-R4-questionnaire.json",
            "Media-Protection-(Protect-information-on-digital-and-non-digital-media).fhir-R4-questionnaire.json",
            "Physical-Protection-(Limit-physical-access-to-information-systems-and-facilities).fhir-R4-questionnaire.json",
            "Policy-Framework-Assessment-(Policy-Implementation-All-CMMC-Level-1-Practices).fhir-R4-questionnaire.json",
            "System-&-Communications-Protection-(Monitor,-control,-and-protect-organizational-communications).fhir-R4-questionnaire.json",
            "System-&-Information-Integrity-(Identify,-report,-and-correct-information-system-flaws).fhir-R4-questionnaire.json",
        ]
    ) {
        await t.step(
            `should write ${src} to ${outputDir} directory`,
            async () => {
                const inputPath = fromFileUrl(
                    import.meta.resolve(`./fixtures/questionnaires/${src}`),
                );
                const stdout: string[] = [];
                const result = await generateTsCodeForQuestionnaire(inputPath, {
                    outDir: outputDir,
                    force: true,
                    includeSrc: true,
                }, stdout);
                if (result) {
                    throw result;
                }
            },
        );
    }
});
