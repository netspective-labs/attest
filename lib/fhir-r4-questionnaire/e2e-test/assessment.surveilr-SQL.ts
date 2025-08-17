#!/usr/bin/env -S deno run --allow-read --allow-write --allow-run --allow-env
import { basename, fromFileUrl, join, relative, resolve } from "jsr:@std/path";
import * as r4qr from "../r4q-runtime.ts";

// This script generates SQL files from FHIR R4 questionnaires.
// It uses the `r4qctl.ts` script to process the questionnaires and output SQL files.
// The generated SQL files emitted as STDOUT to be read by `surveilr` as capturable executable.

// we use relative paths to ensure that the script can be run from different directories
// and still find the necessary files and directories.
// The `relativeToCWD` function helps to resolve paths relative to the current working directory
// or a default path if the resolved path is blank.
// The `workDir` is created in a temporary directory to store the generated SQL files.
// The `qHome` variable points to the directory containing the FHIR R4 questionnaires,
// and the script reads all `.fhir-R4-questionnaire.json` files from that directory

const relativeToCWD = (path: string, defaultIfBlank = ".") => {
    const result = relative(Deno.cwd(), fromFileUrl(import.meta.resolve(path)));
    return result
        ? (result.trimEnd().length > 0 ? result : defaultIfBlank)
        : defaultIfBlank;
};

class Response {
    static readonly EXTENSION = ".lhc-form.json";
    readonly transformed: Record<string, unknown>;

    constructor(readonly srcFile: string) {
        this.srcFile = srcFile;
        this.transformed = {};
    }
}

class QuestionnaireModule {
    static readonly EXTENSION = ".auto.ts";
    private module?: Record<string, unknown>;
    private moduleError?: Error;
    private modulaMeta?: r4qr.ModuleSignature;

    constructor(readonly srcFile: string) {
        this.srcFile = srcFile;
    }

    async init() {
        try {
            this.module = await import(this.srcFile);
            if (this.module) {
                this.modulaMeta = r4qr.moduleSignature(this.module);
            }
        } catch (error) {
            this.moduleError = error instanceof Error ? error : new Error(
                `Failed to import module from ${this.srcFile}: ${error}`,
            );
        }
    }
}

class Questionnaire {
    static readonly EXTENSION = ".fhir-R4-questionnaire.json";
    readonly responses: Response[];

    constructor(readonly srcFile: string) {
        this.srcFile = srcFile;
        this.responses = [];
    }

    async init(options: { workDir: string; respHome: string }) {
        await this.discoverResponses(options);
    }

    isResponseFileForQuestionnaire(fileName: string) {
        return fileName.endsWith(Response.EXTENSION) &&
            basename(fileName).replace(
                    new RegExp(`${Response.EXTENSION}$`),
                    Questionnaire.EXTENSION,
                ) === basename(this.srcFile);
    }

    registerResponse(response: Response) {
        this.responses.push(response);
    }

    async discoverResponses(options: { respHome: string }) {
        for await (const r of Deno.readDir(options.respHome)) {
            if (r.isFile && r.name.endsWith(Response.EXTENSION)) {
                if (this.isResponseFileForQuestionnaire(r.name)) {
                    this.registerResponse(
                        new Response(join(options.respHome, r.name)),
                    );
                }
            }
        }
    }
}

class Ingest {
    readonly workDir: string;
    readonly qHome: string;
    readonly respHome: string;
    readonly questionnaires: Map<string, Questionnaire>;
    readonly qModules: Map<string, QuestionnaireModule>;

    constructor() {
        this.workDir = Deno.makeTempDirSync({
            dir: relativeToCWD("./"),
            prefix: "attest-assessment",
        });
        this.qHome = relativeToCWD("../fixtures/questionnaires");
        this.respHome = relativeToCWD("../fixtures/responses");
        this.questionnaires = new Map<string, Questionnaire>();
        this.qModules = new Map<string, QuestionnaireModule>();
    }

    async cleanup() {
        // Cleanup the work directory if needed
        try {
            await Deno.remove(this.workDir, { recursive: true });
        } catch (error) {
            if (error instanceof Deno.errors.NotFound) {
                console.warn(
                    `Work directory ${this.workDir} not found, nothing to clean up.`,
                );
            } else {
                console.error(
                    `Error cleaning up work directory ${this.workDir}:`,
                    error,
                );
            }
        }
    }

    async registerQuestionnaireSrcFile(srcFile: string) {
        const mapKey = basename(srcFile);
        const questionnaire = new Questionnaire(srcFile);
        await questionnaire.init(this);
        this.questionnaires.set(mapKey, questionnaire);
        return questionnaire;
    }

    async registerQuestionnaireModuleSrcFile(srcFile: string) {
        const mapKey = basename(srcFile);
        const module = new QuestionnaireModule("./" + srcFile);
        await module.init();
        this.qModules.set(mapKey, module);
        return module;
    }

    async discoverQuestionnaires() {
        for await (const q of Deno.readDir(this.qHome)) {
            if (q.isFile && q.name.endsWith(Questionnaire.EXTENSION)) {
                await this.registerQuestionnaireSrcFile(
                    join(this.qHome, q.name),
                );
            }
        }
    }

    async prepareTypeScriptModules() {
        if (this.questionnaires.size > 0) {
            const gen = new Deno.Command(Deno.execPath(), {
                args: [
                    "run",
                    "-A",
                    relativeToCWD("../r4qctl.ts"),
                    ...this.questionnaires.values().map((q) => q.srcFile),
                    "--out-dir",
                    this.workDir,
                    "--force",
                    // "--include-src"  TODO: re-enable this when testing is done
                ],
                stdin: "inherit",
                stdout: "inherit",
                stderr: "inherit",
            });
            const { code } = await gen.output();
            if (code !== 0) Deno.exit(code);
        }
        for await (const m of Deno.readDir(this.workDir)) {
            if (m.isFile && m.name.endsWith(QuestionnaireModule.EXTENSION)) {
                await this.registerQuestionnaireModuleSrcFile(
                    join(
                        relative(
                            fromFileUrl(import.meta.resolve("./")),
                            resolve(this.workDir),
                        ),
                        m.name,
                    ),
                );
            }
        }
    }
}

const ingest = new Ingest();
await ingest.discoverQuestionnaires();
await ingest.prepareTypeScriptModules();
await ingest.cleanup();

console.log(ingest);
