import {
    basename,
    fromFileUrl,
    join,
    relative,
    resolve,
} from "jsr:@std/path@1.1.2";
import * as r4qr from "./r4q-runtime.ts";

/**
 * The `relativeToCWD` function resolves a given path relative to the current working directory.
 * If the resolved path is blank, it returns a default path (defaulting to ".").
 *
 * NOTE: Do not export this function as it is used internally in the module because it refers to `import.meta.resolve`.
 *
 * This is useful for ensuring that paths are correctly resolved in a consistent manner,
 * especially when dealing with file imports or module paths in a Node.js or Deno environment.
 * @param path The path to resolve relative to the current working directory.
 * @param defaultIfBlank An optional default path to return if the resolved path is blank (default is ".").
 * This allows flexibility in specifying a fallback path if the resolved path does not yield a valid result
 * @returns The relative path from the current working directory to the specified path,
 * or the default path if the resolved path is blank.
 * @example
 * // Assuming the current working directory is "/home/user/project"
 * relativeToCWD("./src/index.ts"); // returns "src/index.ts"
 * relativeToCWD(""); // returns "."
 * relativeToCWD("./src/index.ts", "default/path"); // returns "src/index.ts"
 * relativeToCWD("", "default/path"); // returns "default/path"
 */
function relativeToCWD(path: string, defaultIfBlank = ".") {
    const result = relative(Deno.cwd(), fromFileUrl(import.meta.resolve(path)));
    return result
        ? (result.trimEnd().length > 0 ? result : defaultIfBlank)
        : defaultIfBlank;
}

/**
 * The LhcFormResponse class represents a response to a LHC Form.
 * It reads a JSON file containing the LHC Form response, extracts the title,
 * and provides a method to transform the response using a questionnaire module.
 * The transformation is done using a function defined in the corresponding questionnaire module.
 * If the file cannot be read or parsed, it captures the error and provides a way to
 * access the error information.
 */
export class LhcFormResponse {
    static readonly EXTENSION = ".lhc-form.json";
    readonly lhcFormInstance?: Record<string, unknown>;
    readonly lhcFormTitle?: string;
    readonly lhcFormReadError?: Error;
    transformed: Record<string, unknown>;
    transformError?: Error;

    constructor(readonly srcFile: string) {
        this.srcFile = srcFile;
        this.transformed = {};
        try {
            const text = Deno.readTextFileSync(srcFile);
            this.lhcFormInstance = JSON.parse(text);
            this.lhcFormTitle = r4qr.lhcFormTitle(this.lhcFormInstance);
        } catch (e) {
            this.lhcFormInstance = undefined;
            this.lhcFormReadError = e instanceof Error ? e : new Error(
                `Failed to read or parse LHC Form response from ${srcFile}: ${e}`,
            );
        }
    }

    async transform(
        options: { readonly qModules: Map<string, QuestionnaireModule> },
    ) {
        if (!this.lhcFormInstance || !this.lhcFormTitle) return;

        const module = options.qModules.values().find(
            (m) =>
                m.isValid &&
                m.moduleSignature?.title === this.lhcFormTitle,
        );
        if (!module) {
            this.transformError = new Error(
                `No matching questionnaire module found for LHC Form response with title "${this.lhcFormTitle}"`,
            );
            return;
        }

        const lhcFormResponseAdapterFn = module.lhcFormResponseAdapterFn;
        if (
            lhcFormResponseAdapterFn &&
            typeof lhcFormResponseAdapterFn ===
                "function"
        ) {
            try {
                this.transformed = await lhcFormResponseAdapterFn(
                    this.lhcFormInstance,
                );
            } catch (error) {
                this.transformError = error instanceof Error
                    ? error
                    : new Error(
                        `Error transforming LHC Form response from ${this.srcFile}: ${error}`,
                    );
            }
        } else {
            this.transformError = new Error(
                `No LHC Form response adapter function found for module with title "${module.moduleSignature?.title}"`,
            );
        }
    }
}

/**
 * The QuestionnaireModule class represents a TypeScript module that contains
 * functions for transforming LHC Form responses and FHIR Questionnaire Responses.
 * It imports the module dynamically and extracts the module signature to validate
 * the module's structure and functions.
 * The module signature includes the names of the functions that can be used to
 * transform LHC Form responses and FHIR Questionnaire Responses.
 */
export class QuestionnaireModule {
    static readonly EXTENSION = ".auto.ts";
    private module?: Record<string, unknown>;
    private moduleError?: Error;
    private modulaSig?: r4qr.ModuleSignature;

    constructor(readonly srcFile: string) {
        this.srcFile = srcFile;
    }

    get isValid() {
        return this.module !== undefined && this.moduleError === undefined &&
            this.modulaSig !== undefined;
    }

    get moduleSignature() {
        return this.modulaSig;
    }

    get lhcFormResponseAdapterFn() {
        if (this.module && this.modulaSig) {
            return this.module[this.modulaSig.lhcFormResponseAdapterFnName];
        }
        return undefined;
    }

    get fhirQuestionnaireResponseAdapterFn() {
        if (this.module && this.modulaSig) {
            return this
                .module[this.modulaSig.fhirQuestionnaireResponseAdapterFnName];
        }
        return undefined;
    }

    async init() {
        try {
            this.module = await import(this.srcFile);
            if (this.module) {
                this.modulaSig = r4qr.moduleSignature(this.module);
            }
        } catch (error) {
            this.moduleError = error instanceof Error ? error : new Error(
                `Failed to import module from ${this.srcFile}: ${error}`,
            );
        }
    }
}

/**
 * The Questionnaire class represents a FHIR Questionnaire and manages its associated responses.
 * It reads the questionnaire from a source file, discovers associated LHC Form responses,
 * and provides methods to check if a file is a response file for the questionnaire.
 */
export class Questionnaire {
    static readonly EXTENSION = ".fhir-R4-questionnaire.json";
    readonly responses: LhcFormResponse[];

    constructor(readonly srcFile: string) {
        this.srcFile = srcFile;
        this.responses = [];
    }

    async init(
        options: {
            readonly workDir: string;
            readonly respHome: string;
            readonly qModules: Map<string, QuestionnaireModule>;
        },
    ) {
        await this.discoverResponses(options);
    }

    isResponseFileForQuestionnaire(fileName: string) {
        return fileName.endsWith(LhcFormResponse.EXTENSION) &&
            basename(fileName).replace(
                    new RegExp(`${LhcFormResponse.EXTENSION}$`),
                    Questionnaire.EXTENSION,
                ) === basename(this.srcFile);
    }

    async discoverResponses(
        options: {
            readonly respHome: string;
            readonly qModules: Map<string, QuestionnaireModule>;
        },
    ) {
        for await (const r of Deno.readDir(options.respHome)) {
            if (r.isFile && r.name.endsWith(LhcFormResponse.EXTENSION)) {
                if (this.isResponseFileForQuestionnaire(r.name)) {
                    const response = new LhcFormResponse(
                        join(options.respHome, r.name),
                    );
                    this.responses.push(response);
                }
            }
        }
    }
}

/**
 * The Walker class is responsible for managing the discovery and transformation of FHIR Questionnaires and their associated responses.
 * It initializes with a working directory, a home directory for questionnaires, and a home directory for responses.
 * The class provides methods to register questionnaire source files, prepare TypeScript modules, and transform responses.
 * It also handles cleanup of the working directory after processing is complete.
 * The `walk` method orchestrates the entire process, discovering questionnaires, preparing modules, transforming responses, and cleaning up the working directory.
 */
export class Walker {
    readonly workDir: string;
    readonly questionnairesHome: string;
    readonly respHome: string;
    readonly questionnaires: Map<string, Questionnaire>;
    readonly qModules: Map<string, QuestionnaireModule>;

    /**
     * Initializes the Walker with the specified directories.
     * @param init - An object containing the working directory, questionnaires home directory, and responses home directory.
     * @param init.workDir - The directory where the walker will operate.
     * @param init.questionnairesHome - The directory containing FHIR R4 questionnaires.
     * @param init.respHome - The directory containing LHC Form responses.
     * @example
     * const walker = new Walker({
     *     workDir: "./work",
     *     questionnairesHome: "./questionnaires",
     *     respHome: "./responses",
     * });
     * @returns A new instance of the Walker class.
     */
    constructor(
        init: {
            readonly workDir: string;
            readonly questionnairesHome: string;
            readonly respHome: string;
        },
    ) {
        this.workDir = init.workDir;
        this.questionnairesHome = init.questionnairesHome;
        this.respHome = init.respHome;
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

    get responses() {
        return Array.from(
            this.questionnaires.values().flatMap((q) => q.responses),
        );
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
        for await (const q of Deno.readDir(this.questionnairesHome)) {
            if (q.isFile && q.name.endsWith(Questionnaire.EXTENSION)) {
                await this.registerQuestionnaireSrcFile(
                    join(this.questionnairesHome, q.name),
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
                    relativeToCWD("./r4qctl.ts"),
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

    async transformResponses() {
        for (const r of this.responses) {
            await r.transform({
                qModules: this.qModules,
            });
        }
    }

    /**
     * Walks through the FHIR R4 questionnaires and their associated responses.
     * This method orchestrates the entire process of discovering questionnaires,
     * preparing TypeScript modules, transforming responses, and cleaning up the working directory.
     * It initializes the walker, discovers questionnaires, prepares modules, transforms responses,
     * and finally cleans up the working directory.
     *
     * @returns A promise that resolves when the walk is complete.
     * The walk process includes discovering questionnaires, preparing TypeScript modules,
     * transforming responses, and cleaning up the working directory.
     *
     * @example
     * const walker = new Walker({
     *     workDir: "./work",
     *     questionnairesHome: "./questionnaires",
     *     respHome: "./responses",
     * });
     * await walker.walk();
     */
    async walk() {
        await this.discoverQuestionnaires();
        await this.prepareTypeScriptModules();
        await this.transformResponses();
        await this.cleanup();
        return this;
    }
}
