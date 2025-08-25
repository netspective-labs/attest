/**
 * pack.ts
 * Curated projection “packs” for common needs.
 * Packs are just composed plugins with sensible defaults.
 */

import { compose } from "./projection.ts";
import {
  answeredProjection,
  attributeTypeProjection,
  attrProjection,
  booleanUnaryProjection,
  entityTypeUnaryProjection,
  flagProjection,
  kvPredicateProjection,
  provenanceProjection,
  relationMappingProjection,
  statusItemProjection,
  withPredicatePrefix,
} from "./projection.ts";
import type { ProjectionPlugin } from "./core.ts";

export const pack = {
  /** Basic classic KV predicates, snake_case, prefixed. */
  basicKV(
    opts: Readonly<
      {
        prefix?: string;
        snakeCase?: boolean;
        sep?: string;
        subjectRequired?: boolean;
      }
    > = {},
  ): ProjectionPlugin {
    return kvPredicateProjection(opts);
  },

  /** KV + generic helpers: attr, flag(yesNo), status_item, answered. */
  genericKVWithHelpers(
    opts: Readonly<{
      prefix?: string;
      statusKeys: readonly string[];
      statusSynonyms: Readonly<Record<string, readonly string[]>>;
      answeredKeys: readonly string[];
    }>,
  ): ProjectionPlugin {
    const base = kvPredicateProjection({
      prefix: opts.prefix ?? "",
      snakeCase: true,
    });
    const helpers = compose(
      attrProjection("attr"),
      flagProjection("flag", "yesNo"),
      statusItemProjection(
        opts.statusKeys,
        // deno-lint-ignore no-explicit-any
        opts.statusSynonyms as any,
        "status_item",
      ),
      answeredProjection(opts.answeredKeys, "answered", "answered_value"),
    );
    return compose(base, helpers);
  },

  /** Only relations + optional inverse (no base preds). */
  relationsWithInverse(
    opts: Readonly<{
      map: Readonly<Record<string, string>>;
      inverse?: Readonly<Record<string, string>>;
    }>,
  ): ProjectionPlugin {
    return relationMappingProjection(opts);
  },

  /** Schema and provenance (attach after all facts exist). */
  schemaAndProvenance(opts: Readonly<{
    entityPred?: string;
    sourceId?: string;
    txTimeIso?: string;
    validFromIso?: string;
    validToIso?: string;
    booleanUnary?: boolean;
  }> = {}): ProjectionPlugin {
    const list: ProjectionPlugin[] = [];
    if (opts.entityPred) {
      list.push(entityTypeUnaryProjection(opts.entityPred));
    }
    if (opts.booleanUnary) list.push(booleanUnaryProjection());
    list.push(attributeTypeProjection("attribute_type"));
    list.push(provenanceProjection({
      sourceId: opts.sourceId,
      txTimeIso: opts.txTimeIso,
      validFromIso: opts.validFromIso,
      validToIso: opts.validToIso,
      hashPred: "fact_hash",
    }));
    return compose(...list);
  },

  /** Convenience: namespace an inner pack with a predicate prefix. */
  withPrefix(prefix: string, inner: ProjectionPlugin): ProjectionPlugin {
    return withPredicatePrefix(prefix, inner);
  },
};
