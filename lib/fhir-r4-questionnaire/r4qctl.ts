#!/usr/bin/env -S deno run --allow-read --allow-write

import { Command } from "jsr:@cliffy/command@^1.0.0-rc.8";
import { generateTsCodeForQuestionnaire } from "./r4q-resource-code-gen.ts";

function err(msg: string): void {
    console.error(`[r4q] ${msg}`);
}

const cli = new Command()
    .name("r4qctl")
    .version("1.0.0")
    .description(
        "FHIR R4 Questionnaire → type-safe module generator.",
    )
    .arguments("<paths...:string>")
    .option(
        "-p, --stdout",
        "Print generated code to STDOUT (single or multiple inputs).",
        { default: false },
    )
    .option(
        "--out-dir <dir:string>",
        "Write outputs into <dir> instead of adjacent to inputs.",
    )
    .option("--force", "Overwrite existing .auto.ts files.", { default: false })
    .action(async (options, ...pathsList) => {
        if (!pathsList.length) {
            err("No input paths provided.");
            Deno.exit(2);
        }

        const results: string[] = [];
        let hadError: Error | false = false;

        for (const inPath of pathsList) {
            hadError = await generateTsCodeForQuestionnaire(
                inPath,
                options,
                results,
            );
        }

        if (options.stdout) {
            // Print concatenated outputs with delimiter when multiple inputs
            const delim = "\n\n/* --- NEXT FILE --- */\n\n";
            const out = results.join(delim);
            await Deno.stdout.write(new TextEncoder().encode(out));
        }

        Deno.exit(hadError ? 1 : 0);
    });

if (import.meta.main) {
    await cli.parse(Deno.args);
}
