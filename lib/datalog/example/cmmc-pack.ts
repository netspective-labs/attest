// --- CMMC pack ---------------------------------------------------------------
import {
  answeredProjection,
  attrProjection,
  compose,
  exceptPaths,
  flagProjection,
  kvPredicateProjection,
  onlyPath,
  pack,
  type ProjectionPlugin, // optional combinator you already added
  statusItemProjection,
  withPredicatePrefix,
} from "../mod.ts";
export * from "../mod.ts";

// CMMC status normalization (typed)
export const CmmcStatusSynonyms = {
  not: ["not", "not implemented", "none", "missing"],
  partially: ["partial", "partially", "in progress"],
  fully: ["fully", "fully implemented", "complete"],
} as const;
export type CmmcStatus = keyof typeof CmmcStatusSynonyms;

// CMMC status fields (camelCase, raw JSON keys)
export const CmmcStatusKeys = [
  // Media Protection
  "mp.implementationStatus",
  // Physical Protection (example includes 4 variants like your other families)
  "pp.implementationStatus",
  "pp.implementationStatus2",
  "pp.implementationStatus3",
  "pp.implementationStatus4",
  // Access Control
  "ac.implementationStatus",
  "ac.implementationStatus2",
  "ac.implementationStatus3",
  "ac.implementationStatus4",
  // Identification & Authentication
  "iu.implementationStatus",
  "iu.implementationStatus2",
  // System & Communications
  "sc.implementationStatus",
  "sc.implementationStatus2",
] as const;

// CMMC PF “answered” buckets (coverage)
export const CmmcPfAnsweredKeys = [
  "pf.whoIsResponsibleForDevelopingAndApprovingCmmcRelatedPolicies",
  "pf.howFrequentlyAreCmmcRelatedPoliciesReviewedAndUpdated",
  "pf.whatTrainingIsProvidedToEmployeesOnCmmcRelatedPolicies",
  "pf.howIsComplianceWithCmmcRelatedPoliciesMonitored",
  "pf.howAreExceptionsToCmmcRelatedPoliciesManaged",
] as const;

export type CmmcPackOptions = Readonly<{
  /** Prefix for KV predicates (snake_case). Default: "cmmc.". */
  prefix?: string;
  /** Also emit attr/3 for flattened key/value (default true). */
  includeAttr?: boolean;
  /** Also emit yes/no flags for selected families (default: true for sc.* and si.* only). */
  includeFlags?: boolean;
  /** Restrict flags to these path prefixes (default: ["sc.", "si."]). */
  flagPathPrefixes?: readonly string[];
  /**
   * Optional meta: wrap with schema/provenance/boolean unary helpers via an inner pack.
   * If provided, your existing `pack.schemaAndProvenance` will be composed after emitters.
   */
  withMeta?: Readonly<{
    entityPred?: string;
    sourceId?: string;
    txTimeIso?: string;
    validFromIso?: string;
    validToIso?: string;
    booleanUnary?: boolean;
  }>;
  /**
   * Optional blocked paths (exact or subtree) applied to EVERYTHING in this pack
   * (KV, attr, flags, status, answered, meta).
   */
  blockedPaths?: readonly string[];
}>;

/**
 * pack.cmmc(...)
 * A curated CMMC projection pack:
 * - snake_case KV facts with prefix
 * - typed status_item/3 across families
 * - answered/2 + answered_value/3 for PF buckets
 * - optional attr/3 and yes/no flags (sc.* & si.* by default)
 * - optional schema/provenance/boolean unary
 * - optional blocklist for PII/irrelevant fields
 */
export function cmmc(opts: CmmcPackOptions = {}): ProjectionPlugin {
  const prefix = opts.prefix ?? "cmmc.";
  const includeAttr = opts.includeAttr ?? true;
  const includeFlags = opts.includeFlags ?? true;
  const flagPrefixes = opts.flagPathPrefixes ?? ["sc.", "si."];

  // Base KV (classic snake_case with prefix)
  const kv = kvPredicateProjection({ prefix, snakeCase: true });

  // Status normalization
  const status = statusItemProjection(
    CmmcStatusKeys as readonly string[],
    CmmcStatusSynonyms,
    "status_item",
  );

  // PF coverage
  const answered = answeredProjection(
    CmmcPfAnsweredKeys as readonly string[],
    "answered",
    "answered_value",
  );

  // Optional helpers
  const helpers: ProjectionPlugin[] = [];
  if (includeAttr) helpers.push(attrProjection("attr"));
  if (includeFlags) {
    const flags = flagProjection("flag", "yesNo", [
      "yes",
      "true",
      "y",
      "1",
    ]);
    // Gate flags to selected prefixes only
    const gatedFlags = compose(
      ...flagPrefixes.map((p) => onlyPath((jp) => jp.startsWith(p), flags)),
    );
    helpers.push(gatedFlags);
  }

  // Compose emitters
  let packPlugin = compose(kv, status, answered, ...helpers);

  // Optional meta (schema + provenance + boolean unary)
  if (opts.withMeta) {
    // Lazy import to avoid cycles; you already export pack.schemaAndProvenance in this file
    packPlugin = compose(
      packPlugin,
      pack.schemaAndProvenance({
        entityPred: opts.withMeta.entityPred,
        sourceId: opts.withMeta.sourceId,
        txTimeIso: opts.withMeta.txTimeIso,
        validFromIso: opts.withMeta.validFromIso,
        validToIso: opts.withMeta.validToIso,
        booleanUnary: opts.withMeta.booleanUnary,
      }),
    );
  }

  // Optional blocklist applied to the whole pack (emitters + meta)
  if (opts.blockedPaths?.length) {
    packPlugin = exceptPaths(opts.blockedPaths, packPlugin);
  }

  // Allow external namespacing (caller can still do pack.withPrefix if desired)
  return packPlugin;
}

// Convenience: namespaced variant (e.g., "ns.")
export function cmmcWithPrefix(
  ns: string,
  opts?: CmmcPackOptions,
): ProjectionPlugin {
  return withPredicatePrefix(ns, cmmc(opts));
}

// Re-export inside the pack namespace for symmetry with existing API
// (so callers can do: pack.cmmc(...) )
export const packCmmc = { cmmc, cmmcWithPrefix };
