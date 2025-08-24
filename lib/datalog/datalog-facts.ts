/**
 * @file DataLogFacts: Convert JS objects into rich, schema-aware DataLog facts.
 * Deno 2 / TypeScript, no npm deps.
 */

// deno-lint-ignore no-explicit-any
type Any = any;

export type LowerSnake = string & { readonly __brand: "LowerSnake" };

/** Predicates registry: name -> fixed arity. */
export type PredMap = Record<string, number>;

/** Map object paths (e.g., "managerId" or "profile.manager.id") to relation preds. */
export type RelationKeyMapping<PR extends PredMap = PredMap> = Record<
    string,
    keyof PR & string
>;

/** Optional inverse relations to auto-emit reciprocals. */
export type RelationInverseMapping<PR extends PredMap = PredMap> = Partial<
    Record<keyof PR & string, keyof PR & string>
>;

/** Optional enum constraints for attributes (by path). */
export type EnumAllowed = Record<string, readonly (string | number)[]>;

/** Required attribute paths – we’ll emit missing_attr facts if absent. */
export type RequiredAttrs = readonly string[];

/** Cardinality by path (informational meta). */
export type Cardinality = Record<string, "one" | "many">;

export type DataLogFactsInstructions<PR extends PredMap = PredMap> = {
    // Naming / structure
    prefix?: string;
    camelToSnakeCase?: boolean;
    objectId?: string | number;
    keySeparator?: string;

    // String normalize helpers
    normalizeLowerCase?: boolean; // e.g., name_lc(User, "alice")
    normalizeAscii?: boolean; // e.g., name_ascii(User, "sao paulo")

    // Entity + schema/meta
    entityType?: string; // emits: user(Id).
    schemaNs?: string; // emits: schema_ns("app.v1").
    includeTypes?: boolean; // emits attribute_type("k","string"|…)
    enumAllowed?: EnumAllowed; // emits attribute_allowed("k","value")
    required?: RequiredAttrs; // emits missing_attr(Id,"k") if not seen
    cardinality?: Cardinality; // emits cardinality("k","one"|"many")

    // Relations
    relationKeys?: RelationKeyMapping<PR>;
    relationInverse?: RelationInverseMapping<PR>;

    // Exclusion
    exclude?: string[];

    // Provenance & temporal
    sourceId?: string; // emits source(SrcId), fact_source(Hash, SrcId)
    includeProvenance?: boolean; // attach json_path/hash + optional tx/valid
    txTimeIso?: string; // emits tx_time(Hash, Iso)
    validFromIso?: string; // emits valid_time(Hash, Start, End)
    validToIso?: string; // may be undefined

    // Boolean unary helper (emit positive unary predicate when true)
    booleanUnaryHelper?: boolean; // e.g., is_active(U,true) + active(U).

    // Registry for arity + strictness
    registry?: PR;
    strictArity?: boolean;

    // Callbacks
    undefinedFact?: (
        key: string,
        value: null | undefined,
    ) => string | undefined;
    // deno-lint-ignore ban-types
    fnFact?: (key: string, fn: Function) => string | undefined;
};

/* ============================================================================
 * Utilities
 * ========================================================================== */

const toSnakeCase = (s: string): LowerSnake =>
    s.replace(/([a-z0-9])([A-Z])/g, "$1_$2").replace(/__+/g, "_")
        .toLowerCase() as LowerSnake;

const quote = (s: string): string => JSON.stringify(s);

const term = (v: unknown): string => {
    switch (typeof v) {
        case "string":
            return quote(v);
        case "number":
        case "boolean":
            return String(v);
        default:
            return quote(String(v));
    }
};

/** FNV‑1a 32-bit hash, hex output (small+fast; good enough for provenance IDs). */
function fnv1a32(str: string): string {
    let h = 0x811c9dc5;
    for (let i = 0; i < str.length; i++) {
        h ^= str.charCodeAt(i);
        h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
    }
    return "0x" + h.toString(16).padStart(8, "0");
}

/** Basic ASCII fold (very light; for robust folding use ICU externally). */
function toAsciiBasic(input: string): string {
    return input.normalize("NFKD").replace(/[^\\x00-\x7F]/g, (c) => {
        const r = c.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        return /[^\\x00-\x7F]/.test(r) ? "" : r;
    });
}

/* ============================================================================
 * Fact model & printer
 * ========================================================================== */

export type Fact = {
    pred: string;
    args: (string | number | boolean)[];
    meta?: {
        path?: string; // JSON path-ish
        hash?: string; // stable per fact string
    };
};

function printFact(f: Fact): string {
    const args = f.args.map((a) => term(a)).join(", ");
    return `${f.pred}(${args}).`;
}

/* ============================================================================
 * Predicate Registry helpers (compile-time friendly)
 * ========================================================================== */

export function createRegistry<PR extends PredMap>(r: PR): PR {
    return r;
}

/** Validate predicate arity if strict mode is on. */
function checkArity(
    pred: string,
    args: unknown[],
    pr?: PredMap,
    strict?: boolean,
) {
    if (!strict || !pr) return;
    const expect = pr[pred];
    if (typeof expect !== "number") {
        throw new Error(`Unknown predicate '${pred}' (no registry entry).`);
    }
    if (args.length !== expect) {
        throw new Error(
            `Arity mismatch for '${pred}': expected ${expect}, got ${args.length}.`,
        );
    }
}

/* ============================================================================
 * DataLogFacts
 * ========================================================================== */

export class DataLogFacts {
    /** Main entrypoint: JSON.stringify-like API to emit facts. */
    static stringify<PR extends PredMap = PredMap>(
        src: Record<string, unknown>,
        instructions?: DataLogFactsInstructions<PR>,
    ): string[] {
        const prefix = instructions?.prefix ?? "";
        const convertCase = instructions?.camelToSnakeCase ?? false;
        const objectId = instructions?.objectId;
        const separator = instructions?.keySeparator ?? "_";
        const relationKeys = instructions?.relationKeys ??
            {} as RelationKeyMapping<PR>;
        const relationInverse = instructions?.relationInverse ?? {};
        const exclude = new Set(instructions?.exclude ?? []);
        const includeProv = instructions?.includeProvenance ?? false;
        const txIso = instructions?.txTimeIso;
        const vFrom = instructions?.validFromIso;
        const vTo = instructions?.validToIso;
        const reg = instructions?.registry;
        const strict = instructions?.strictArity ?? false;

        const seenAttrs = new Set<string>(); // for required/missing
        const facts: Fact[] = [];
        const add = (pred: string, args: Fact["args"], meta?: Fact["meta"]) => {
            checkArity(pred, args, reg, strict);
            const f: Fact = { pred, args, meta };
            const s = printFact(f);
            // Attach hash for provenance/temporal if needed
            if (includeProv) {
                f.meta ??= {};
                f.meta.hash = f.meta.hash ?? fnv1a32(s);
            }
            facts.push(f);
            return f;
        };

        const pathToPredicate = (path: string): string =>
            prefix + (convertCase ? toSnakeCase(path) : path);

        // --- Schema NS fact ---
        if (instructions?.schemaNs) add("schema_ns", [instructions.schemaNs]);

        // --- Entity type unary fact ---
        if (instructions?.entityType && objectId !== undefined) {
            const predicate = convertCase
                ? toSnakeCase(instructions.entityType)
                : instructions.entityType;
            add(predicate, [String(objectId)]);
        }

        // --- Cardinality meta ---
        if (instructions?.cardinality) {
            for (const [k, c] of Object.entries(instructions.cardinality)) {
                const kk = convertCase ? toSnakeCase(k) : k;
                add("cardinality", [kk, c]);
            }
        }

        // --- Enum allowed meta ---
        if (instructions?.enumAllowed) {
            for (
                const [k, values] of Object.entries(instructions.enumAllowed)
            ) {
                const kk = convertCase ? toSnakeCase(k) : k;
                for (const v of values) {
                    add("attribute_allowed", [kk, String(v)]);
                }
            }
        }

        // Helper: emit provenance/temporal side-facts
        const annotate = (f: Fact) => {
            if (!includeProv) return;
            if (instructions?.sourceId) {
                add("source", [instructions.sourceId]);
                add("fact_source", [f.meta!.hash!, instructions.sourceId]);
            }
            if (f.meta?.path) add("json_path", [f.meta.hash!, f.meta.path]);
            if (txIso) add("tx_time", [f.meta!.hash!, txIso]);
            if (vFrom || vTo) {
                add("valid_time", [f.meta!.hash!, vFrom ?? "", vTo ?? ""]);
            }
        };

        // Emit attribute_type during first occurrence
        const emitAttrTypeOnce = (k: string, tsType: string) => {
            if (!instructions?.includeTypes) return;
            const kk = convertCase ? toSnakeCase(k) : k;
            const sig = `${kk}:${tsType}`;
            if ((emitAttrTypeOnce as Any)._seen?.has(sig)) return;
            (emitAttrTypeOnce as Any)._seen ??= new Set<string>();
            (emitAttrTypeOnce as Any)._seen.add(sig);
            annotate(add("attribute_type", [kk, tsType]));
        };

        // Normalized string helpers
        const maybeEmitStringVariants = (
            basePred: string,
            subj: string,
            value: string,
            path: string,
        ) => {
            if (instructions?.normalizeLowerCase) {
                annotate(
                    add(`${basePred}_lc`, [subj, value.toLowerCase()], {
                        path,
                    }),
                );
            }
            if (instructions?.normalizeAscii) {
                annotate(
                    add(`${basePred}_ascii`, [subj, toAsciiBasic(value)], {
                        path,
                    }),
                );
            }
        };

        const processValue = (currentValue: unknown, path: string): void => {
            const t = typeof currentValue;
            if (!path) return; // skip root
            if (exclude.has(path)) return; // honor excludes

            // Mark attribute as seen for presence/missing rules
            seenAttrs.add(path);

            // null/undefined
            if (currentValue === null || t === "undefined") {
                if (instructions?.undefinedFact) {
                    const processedKey = convertCase ? toSnakeCase(path) : path;
                    const custom = instructions.undefinedFact(
                        processedKey,
                        currentValue as null | undefined,
                    );
                    if (typeof custom === "string") {
                        const f = add(processedKey, [custom]); // user-specified shape
                        annotate(f);
                    }
                } else {
                    // Explicit missing marker can be helpful:
                    // missing_attr(Id?, "k")
                    if (objectId !== undefined) {
                        annotate(
                            add("missing_attr", [
                                String(objectId),
                                convertCase ? toSnakeCase(path) : path,
                            ], { path }),
                        );
                    } else {annotate(
                            add("missing_attr_k", [
                                convertCase ? toSnakeCase(path) : path,
                            ], { path }),
                        );}
                }
                return;
            }

            // Arrays
            if (Array.isArray(currentValue)) {
                currentValue.forEach((item, index) => {
                    if (
                        typeof item === "string" || typeof item === "number" ||
                        typeof item === "boolean"
                    ) {
                        const basePred = relationKeys[path]
                            ? String(relationKeys[path])
                            : pathToPredicate(path);
                        if (objectId !== undefined) {
                            const f = add(basePred, [
                                String(objectId),
                                index,
                                item,
                            ], { path: `${path}[${index}]` });
                            annotate(f);
                            if (typeof item === "string") {
                                maybeEmitStringVariants(
                                    basePred,
                                    String(objectId),
                                    item,
                                    `${path}[${index}]`,
                                );
                            }
                        } else {
                            const f = add(basePred, [index, item], {
                                path: `${path}[${index}]`,
                            });
                            annotate(f);
                        }
                        emitAttrTypeOnce(path, typeof item);
                    } else {
                        processValue(item, `${path}${separator}${index}`);
                    }
                });
                return;
            }

            // Objects
            if (t === "object") {
                const obj = currentValue as Record<string, unknown>;
                for (const key of Object.keys(obj)) {
                    const nextPath = path ? `${path}${separator}${key}` : key;
                    processValue(obj[key], nextPath);
                }
                return;
            }

            // Functions
            if (t === "function") {
                if (instructions?.fnFact) {
                    const processedKey = convertCase ? toSnakeCase(path) : path;
                    const custom = instructions.fnFact(
                        processedKey,
                        // deno-lint-ignore ban-types
                        currentValue as Function,
                    );
                    if (typeof custom === "string") {
                        const f = add("fn_fact", [processedKey, custom], {
                            path,
                        });
                        annotate(f);
                    }
                }
                return;
            }

            // Primitives
            const isRel = relationKeys[path] !== undefined;
            const basePred = isRel
                ? String(relationKeys[path])
                : pathToPredicate(path);
            if (isRel) {
                emitAttrTypeOnce(path, "relation");
            } else emitAttrTypeOnce(path, t);

            // --- Friendlier error: relational predicate but no objectId in strict mode
            if (isRel && objectId === undefined && strict && reg) {
                const expected = reg[basePred];
                if (typeof expected === "number" && expected >= 2) {
                    throw new Error(
                        `Relational predicate '${basePred}' requires an objectId to supply the subject; ` +
                            `expected arity ${expected}, but only the object value is available.`,
                    );
                }
            }

            if (objectId !== undefined) {
                const f = add(basePred, [
                    String(objectId),
                    currentValue as (string | number | boolean),
                ], { path });
                annotate(f);

                // Inverse relation (if configured)
                if (
                    isRel &&
                    (typeof currentValue === "string" ||
                        typeof currentValue === "number")
                ) {
                    const inv = relationInverse[
                        basePred as keyof typeof relationInverse
                    ];
                    if (inv) {
                        // Order: manages(Manager, Employee)
                        const invArgs: (string | number | boolean)[] = [
                            String(currentValue), // Manager (object)
                            String(objectId), // Employee (subject)
                        ];
                        const g = add(String(inv), invArgs, {
                            path: `${path}:inverse`,
                        });
                        annotate(g);
                    }
                }

                // boolean unary helper for positives
                if (
                    instructions?.booleanUnaryHelper && t === "boolean" &&
                    currentValue === true
                ) {
                    const unary = basePred.replace(/_?is_?/, "").replace(
                        /\W+/g,
                        "_",
                    ); // light heuristic
                    annotate(
                        add(unary, [String(objectId)], {
                            path: `${path}:unary`,
                        }),
                    );
                }

                // string normalization variants
                if (typeof currentValue === "string") {
                    maybeEmitStringVariants(
                        basePred,
                        String(objectId),
                        currentValue,
                        path,
                    );
                }
            } else {
                const f = add(basePred, [
                    currentValue as (string | number | boolean),
                ], { path });
                annotate(f);
            }
        };

        // Traverse top-level
        for (const key of Object.keys(src)) processValue(src[key], key);

        // Required attributes -> missing_attr
        if (instructions?.required && objectId !== undefined) {
            for (const k of instructions.required) {
                if (!seenAttrs.has(k)) {
                    annotate(
                        add("missing_attr", [
                            String(objectId),
                            convertCase ? toSnakeCase(k) : k,
                        ], { path: k }),
                    );
                }
            }
        }

        // Deterministic ordering + de-dup
        const printed = new Set<string>();
        const sorted = facts
            .map(printFact)
            .sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))
            .filter((s) => (printed.has(s) ? false : (printed.add(s), true)));

        return sorted;
    }
}
