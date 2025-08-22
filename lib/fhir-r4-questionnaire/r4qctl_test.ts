import { basename, extname, fromFileUrl, join, relative } from "jsr:@std/path";
import { serveDir } from "jsr:@std/http/file-server";
import { assert } from "jsr:@std/assert";
import { generateTsCodeForQuestionnaire as generateTsCodeLocal } from "./r4q-resource-code-gen.ts";

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
    // --- Start a static file server for serving TypeScript remotely ---
    const ac = new AbortController();
    let serverPort = 0;
    let baseUrl = "server not started yet";

    // A small promise to know when the server is actually listening.
    let serverReady!: () => void;
    const ready = new Promise<void>((resolve) => (serverReady = resolve));

    // All files will be served under http://localhost:<port>/<filename>
    Deno.serve(
        {
            port: 0, // 0 => pick a free port
            signal: ac.signal,
            onListen: ({ port }) => {
                serverPort = port;
                baseUrl = `http://localhost:${serverPort}/`;
                console.log(`Fixture server: ${baseUrl}`);
                serverReady();
            },
        },
        (req) => {
            // Use a URL prefix so we only serve under /q/
            return serveDir(new Request(req.url, req), {
                fsRoot: fromFileUrl(import.meta.resolve("./")),
                showDirListing: true,
            });
        },
    );

    await ready; // ensure serverPort is set

    try {
        const generatedTsHome = await Deno.makeTempDir({
            prefix: basename(new URL(import.meta.url).pathname),
        });
        const remoteModule = await import(
            `${baseUrl}/r4q-resource-code-gen.ts`
        );
        const generatedFileNames: string[] = [];
        for (const src of fixtures) {
            const generatedFileName =
                join(generatedTsHome, basename(src, extname(src))) +
                ".auto.ts";
            await t.step(
                `should write ${generatedFileName}`,
                async () => {
                    const inputPath = fromFileUrl(
                        import.meta.resolve(`./fixtures/questionnaires/${src}`),
                    );
                    const stdout: string[] = [];
                    // deno-lint-ignore no-explicit-any
                    const result = await (remoteModule as any)
                        .generateTsCodeForQuestionnaire(inputPath, {
                            stdout: true,
                            includeSrc: true,
                        }, stdout);
                    if (result) {
                        throw result;
                    }
                    await Deno.writeTextFile(
                        generatedFileName,
                        stdout.join("\n"),
                    );
                    generatedFileNames.push(generatedFileName);
                    const imported = await import(generatedFileName);
                    assert(
                        imported,
                        `${basename(generatedFileName)} should be importable`,
                    );
                },
            );
            await t.step(
                `should import ${generatedFileName}`,
                async () => {
                },
            );
        }
        assert(generatedFileNames.length > 0);
        Deno.remove(generatedTsHome, { recursive: true });
    } finally {
        // --- Always stop the server, even if a step fails ---
        ac.abort();
        console.log("Fixture server stopped");
    }
});
