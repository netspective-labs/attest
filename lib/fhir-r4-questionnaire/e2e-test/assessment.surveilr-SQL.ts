#!/usr/bin/env -S deno run --allow-read --allow-write --allow-run --allow-env
import { fromFileUrl, relative } from "jsr:@std/path@1.1.2";
import { Walker } from "../r4q-walk.ts";

// This script generates SQL files from FHIR R4 questionnaires.
// It uses the `r4qctl.ts` script to process the questionnaires and output SQL files.
// The generated SQL files emitted as STDOUT to be read by `surveilr` as capturable executable.

function relativeToCWD(path: string, defaultIfBlank = ".") {
    const result = relative(Deno.cwd(), fromFileUrl(import.meta.resolve(path)));
    return result
        ? (result.trimEnd().length > 0 ? result : defaultIfBlank)
        : defaultIfBlank;
}

const walker = new Walker({
    workDir: Deno.makeTempDirSync({
        dir: relative(fromFileUrl(import.meta.resolve("./")), "./"),
        prefix: "attest-assessment",
    }),
    questionnairesHome: relativeToCWD("../fixtures/questionnaires"),
    respHome: relativeToCWD("../fixtures/responses"),
});
await walker.walk();
console.log(walker.questionnaires);
