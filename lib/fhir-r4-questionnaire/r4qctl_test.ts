import { fromFileUrl, relative } from "jsr:@std/path";
import { generateTsCodeForQuestionnaire as generateTsCodeLocal } from "./r4q-resource-code-gen.ts";
import { generateTsCodeForQuestionnaire as generateTsCodeRemote } from "https://raw.githubusercontent.com/netspective-labs/attest/refs/heads/main/lib/fhir-r4-questionnaire/r4q-resource-code-gen.ts";

const fixtures = [
    "access-control-limit-information-system-access-to-authorized-users-and-processes.fhir-R4-questionnaire.json",
    "company-information.fhir-R4-questionnaire.json",
    "identification-authentication-verify-identities-of-users-and-processes.fhir-R4-questionnaire.json",
    "media-protection-protect-information-on-digital-and-non-digital-media.fhir-R4-questionnaire.json",
    "physical-protection-limit-physical-access-to-information-systems-and-facilities.fhir-R4-questionnaire.json",
    "policy-framework-assessment-policy-implementation-all-cmmc-level-1-practices.fhir-R4-questionnaire.json",
    "system-communications-protection-monitor-control-and-protect-organizational-communications.fhir-R4-questionnaire.json",
    "system-information-integrity-identify-report-and-correct-information-system-flaws.fhir-R4-questionnaire.json",
];

Deno.test("r4qctl CLI local", async (t) => {
    const outputDir = relative(
        Deno.cwd(),
        fromFileUrl(import.meta.resolve("./generated")),
    );
    for (const src of fixtures) {
        await t.step(
            `should write ${src} to ${outputDir} directory`,
            async () => {
                const inputPath = fromFileUrl(
                    import.meta.resolve(`./fixtures/questionnaires/${src}`),
                );
                const stdout: string[] = [];
                const result = await generateTsCodeLocal(inputPath, {
                    outDir: outputDir,
                    force: true,
                    includeSrc: false,
                }, stdout);
                if (result) {
                    throw result;
                }
            },
        );
    }
});

Deno.test("r4qctl CLI remote", async (t) => {
    for (const src of fixtures) {
        await t.step(
            `should write ${src} to memory`,
            async () => {
                const inputPath = fromFileUrl(
                    import.meta.resolve(`./fixtures/questionnaires/${src}`),
                );
                const stdout: string[] = [];
                const result = await generateTsCodeRemote(inputPath, {
                    includeSrc: true,
                }, stdout);
                if (result) {
                    throw result;
                }
            },
        );
    }
});
