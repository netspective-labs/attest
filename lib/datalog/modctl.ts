#!/usr/bin/env -S deno run --allow-read --allow-write --allow-env --allow-run --allow-sys
/**
 * modctl.ts — Emit DataLog facts from JSON on stdin.
 *
 * Usage examples:
 *   cat user.json | ./modctl.ts to-facts --entity-type user --object-id u1
 *   cat users.json | ./modctl.ts to-facts --entity-type user --object-id-path id --camel-to-snake
 *   cat obj.json | ./modctl.ts to-facts \
 *     --prefix app. \
 *     --relation-keys '{"managerId":"has_manager"}' \
 *     --relation-inverse '{"has_manager":"manages"}' \
 *     --registry '{"user":1,"has_manager":2,"manages":2}' \
 *     --strict-arity
 */

import { Command } from "jsr:@cliffy/command@^1.0.0-rc.4";
import {
    createRegistry,
    DataLogFacts,
    type DataLogFactsInstructions,
} from "./mod.ts";

/* ---------------------------- helpers ---------------------------- */

async function readStdinText(): Promise<string> {
    return await new Response(Deno.stdin.readable).text();
}

function parseJsonOrThrow<T = unknown>(s: string, hint: string): T {
    try {
        return JSON.parse(s) as T;
    } catch (e) {
        throw new Error(
            `Failed to parse ${hint} as JSON: ${(e as Error).message}`,
        );
    }
}

function parseMaybeJson<T = unknown>(s?: string, hint?: string): T | undefined {
    if (!s || s.trim() === "") return undefined;
    return parseJsonOrThrow<T>(s, hint ?? "value");
}

/** Coerce a CLI --object-id string into number if numeric, else keep string. */
function coerceId(v?: string): string | number | undefined {
    if (v === undefined) return undefined;
    if (/^-?\d+(?:\.\d+)?$/.test(v)) {
        const n = Number(v);
        return Number.isNaN(n) ? v : n;
    }
    return v;
}

function commaList(s?: string): string[] | undefined {
    if (!s) return undefined;
    return s.split(",").map((x) => x.trim()).filter(Boolean);
}

/** Dot-path getter for --object-id-path */
function getByPath(obj: unknown, path: string, sep = "."): unknown {
    if (obj == null) return undefined;
    const parts = path.split(sep).filter(Boolean);
    // deno-lint-ignore no-explicit-any
    let cur: any = obj;
    for (const p of parts) {
        if (cur == null) return undefined;
        cur = cur[p];
    }
    return cur;
}

/** Build DataLogFactsInstructions from CLI flags. */
function buildInstructions(args: {
    prefix?: string;
    camelToSnake?: boolean;
    objectId?: string;
    keySeparator?: string;
    normalizeLower?: boolean;
    normalizeAscii?: boolean;
    entityType?: string;
    schemaNs?: string;
    includeTypes?: boolean;
    relationKeys?: string;
    relationInverse?: string;
    exclude?: string;
    sourceId?: string;
    includeProvenance?: boolean;
    txTimeIso?: string;
    validFromIso?: string;
    validToIso?: string;
    booleanUnaryHelper?: boolean;
    registry?: string;
    strictArity?: boolean;
    enumAllowed?: string;
    required?: string;
    cardinality?: string;
}): DataLogFactsInstructions {
    const registryObj = parseMaybeJson<Record<string, number>>(
        args.registry,
        "registry",
    );
    const instructions: DataLogFactsInstructions = {
        prefix: args.prefix,
        camelToSnakeCase: !!args.camelToSnake,
        objectId: coerceId(args.objectId),
        keySeparator: args.keySeparator,
        normalizeLowerCase: !!args.normalizeLower,
        normalizeAscii: !!args.normalizeAscii,
        entityType: args.entityType,
        schemaNs: args.schemaNs,
        includeTypes: !!args.includeTypes,
        relationKeys: parseMaybeJson(args.relationKeys, "relationKeys"),
        relationInverse: parseMaybeJson(
            args.relationInverse,
            "relationInverse",
        ),
        exclude: commaList(args.exclude),
        sourceId: args.sourceId,
        includeProvenance: !!args.includeProvenance,
        txTimeIso: args.txTimeIso,
        validFromIso: args.validFromIso,
        validToIso: args.validToIso,
        booleanUnaryHelper: !!args.booleanUnaryHelper,
        registry: registryObj ? createRegistry(registryObj) : undefined,
        strictArity: !!args.strictArity,
        enumAllowed: parseMaybeJson(args.enumAllowed, "enumAllowed"),
        required: commaList(args.required),
        cardinality: parseMaybeJson(args.cardinality, "cardinality"),
    };
    return instructions;
}

/** Emit facts for a single object, possibly overriding objectId */
function emitOne(
    obj: Record<string, unknown>,
    base: DataLogFactsInstructions,
    overrideObjectId?: string | number,
): string[] {
    const ins = { ...base };
    if (overrideObjectId !== undefined) ins.objectId = overrideObjectId;
    return DataLogFacts.stringify(obj, ins);
}

/* ------------------------------ CLI ------------------------------ */

const cmd = new Command()
    .name("modctl.ts")
    .version("0.1.0")
    .description(
        "Emit DataLog facts from JSON (stdin) using DataLogFacts.stringify.",
    );

cmd.command(
    "to-facts",
    new Command()
        .description(
            "Read JSON from stdin and emit DataLog facts to stdout.",
        )
        .option("--prefix <string>", "Predicate prefix (e.g., 'app.').")
        .option("--camel-to-snake", "Convert keys to snake_case.", {
            default: false,
        })
        .option("--object-id <string>", "Subject ID (string or number).")
        .option(
            "--object-id-path <string>",
            "Dot path inside input object to use as subject ID.",
        )
        .option("--key-separator <string>", "Nested key separator.", {
            default: "_",
        })
        .option("--normalize-lower", "Emit *_lc for string values.", {
            default: false,
        })
        .option("--normalize-ascii", "Emit *_ascii for string values.", {
            default: false,
        })
        .option(
            "--entity-type <string>",
            "Unary entity predicate to emit (e.g., 'user').",
        )
        .option(
            "--schema-ns <string>",
            "Schema namespace (e.g., 'app.v1').",
        )
        .option("--include-types", "Emit attribute_type facts.", {
            default: false,
        })
        .option(
            "--relation-keys <json:string>",
            "JSON mapping of property->relation predicate.",
        )
        .option(
            "--relation-inverse <json:string>",
            "JSON mapping of relation->inverse relation.",
        )
        .option(
            "--exclude <list:string>",
            "Comma-separated keys to exclude.",
        )
        .option("--source-id <string>", "Provenance source identifier.")
        .option(
            "--include-provenance",
            "Emit provenance/temporal meta-facts.",
            { default: false },
        )
        .option(
            "--tx-time-iso <string>",
            "Transaction time ISO (used if include-provenance).",
        )
        .option(
            "--valid-from-iso <string>",
            "Valid-from ISO (used if include-provenance).",
        )
        .option(
            "--valid-to-iso <string>",
            "Valid-to ISO (used if include-provenance).",
        )
        .option(
            "--boolean-unary-helper",
            "Emit unary predicate for true booleans.",
            { default: false },
        )
        .option(
            "--registry <json:string>",
            "JSON predicate->arity map for strict checks.",
        )
        .option("--strict-arity", "Enforce registry arities.", {
            default: false,
        })
        .option(
            "--enum-allowed <json:string>",
            "JSON attr->allowed values map.",
        )
        .option(
            "--required <list:string>",
            "Comma-separated required keys.",
        )
        .option(
            "--cardinality <json:string>",
            "JSON attr->('one'|'many') map.",
        )
        .action(async (opts) => {
            // Read JSON from stdin (object or array of objects)
            const raw = (await readStdinText()).trim();
            if (!raw) {
                console.error(
                    "No input on stdin. Provide a JSON object or array.",
                );
                Deno.exit(2);
            }
            const json = parseJsonOrThrow<unknown>(raw, "stdin");

            const baseIns = buildInstructions(opts);

            const allFacts: string[] = [];

            if (Array.isArray(json)) {
                for (const [idx, item] of json.entries()) {
                    if (
                        item && typeof item === "object" &&
                        !Array.isArray(item)
                    ) {
                        let overrideId: string | number | undefined = undefined;
                        if (opts.objectIdPath) {
                            const v = getByPath(item, opts.objectIdPath);
                            if (
                                typeof v === "string" ||
                                typeof v === "number"
                            ) {
                                overrideId = v as string | number;
                            } else if (v !== undefined) {
                                console.warn(
                                    `Warning: object at index ${idx} has non-primitive id at path '${opts.objectIdPath}', ignoring.`,
                                );
                            }
                        }
                        allFacts.push(
                            ...emitOne(
                                item as Record<string, unknown>,
                                baseIns,
                                overrideId,
                            ),
                        );
                    } else {
                        console.warn(
                            `Warning: array index ${idx} is not an object, skipping.`,
                        );
                    }
                }
            } else if (json && typeof json === "object") {
                let overrideId: string | number | undefined = undefined;
                if (opts.objectIdPath) {
                    const v = getByPath(json, opts.objectIdPath);
                    if (typeof v === "string" || typeof v === "number") {
                        overrideId = v as string | number;
                    } else if (v !== undefined) {
                        console.warn(
                            `Warning: input object has non-primitive id at path '${opts.objectIdPath}', ignoring.`,
                        );
                    }
                }
                allFacts.push(
                    ...emitOne(
                        json as Record<string, unknown>,
                        baseIns,
                        overrideId,
                    ),
                );
            } else {
                console.error(
                    "Input must be a JSON object or an array of objects.",
                );
                Deno.exit(2);
            }

            // Write facts to stdout (one per line)
            const text = allFacts.join("\n") +
                (allFacts.length ? "\n" : "");
            await Deno.stdout.write(new TextEncoder().encode(text));
        }),
);

await cmd.parse(Deno.args);
