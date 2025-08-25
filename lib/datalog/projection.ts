/**
 * projection.ts
 * A library of pure projection factories and combinators.
 * Each factory returns a ProjectionPlugin with no side effects.
 */

import type {
  Fact,
  NodeContext,
  ProjectionApi,
  ProjectionPlugin,
} from "./core.ts";

// deno-lint-ignore no-explicit-any
type Any = any;

/* ---------------------------------- Utils ---------------------------------- */

const toSnake = (s: string) =>
  s.replace(/([a-z0-9])([A-Z])/g, "$1_$2").replace(/__+/g, "_").toLowerCase();

const isPrimitive = (v: unknown): v is string | number | boolean =>
  ["string", "number", "boolean"].includes(typeof v);

/** Compose plugins (left-to-right). */
export function compose(
  ...plugins: readonly ProjectionPlugin[]
): ProjectionPlugin {
  return {
    name: `compose(${plugins.map((p) => p.name).join(",")})`,
    onInit(api) {
      for (const p of plugins) p.onInit?.(api);
    },
    onValue(ctx, api) {
      for (const p of plugins) p.onValue(ctx, api);
    },
    onAfterAll(api) {
      for (const p of plugins) p.onAfterAll?.(api);
    },
  };
}

/** Filter a plugin to only certain node kinds. */
export function onlyKinds(
  kinds: readonly NodeContext["kind"][],
  inner: ProjectionPlugin,
): ProjectionPlugin {
  const allow = new Set(kinds);
  return {
    name: `onlyKinds(${inner.name})`,
    onInit: inner.onInit?.bind(inner),
    onValue(ctx, api) {
      if (allow.has(ctx.kind)) inner.onValue(ctx, api);
    },
    onAfterAll: inner.onAfterAll?.bind(inner),
  };
}

/** Filter a plugin by current joined path. */
export function onlyPath(
  pred: (joinedPath: string) => boolean,
  inner: ProjectionPlugin,
): ProjectionPlugin {
  return {
    name: `onlyPath(${inner.name})`,
    onInit: inner.onInit?.bind(inner),
    onValue(ctx, api) {
      if (pred(api.join("."))) inner.onValue(ctx, api);
    },
    onAfterAll: inner.onAfterAll?.bind(inner),
  };
}

/** Prefix all emitted predicate names. */
export function withPredicatePrefix(
  prefix: string,
  inner: ProjectionPlugin,
): ProjectionPlugin {
  return {
    name: `withPrefix(${inner.name})`,
    onInit: inner.onInit?.bind(inner),
    onValue(ctx, api) {
      const wrapped: ProjectionApi = {
        ...api,
        emit(pred, ...args) {
          api.emit(prefix + pred, ...args);
        },
      };
      inner.onValue(ctx, wrapped);
    },
    onAfterAll(api) {
      inner.onAfterAll?.(api);
    },
  };
}

/**
 * exceptPaths
 * Skip running the inner plugin when the current path matches a blocklist
 * (exact key or subtree prefix).
 *
 * Examples of a blocked entry:
 *   "password"       -> blocks only "password"
 *   "ci"             -> blocks "ci" and everything under "ci.*"
 *   "ci."            -> same as above (treats as subtree)
 */
export function exceptPaths(
  blocked: readonly string[] | ((joinedPath: string) => boolean),
  inner: ProjectionPlugin,
): ProjectionPlugin {
  const isBlocked = typeof blocked === "function"
    ? blocked
    : (p: string) =>
      blocked.some((b) =>
        p === b || p.startsWith(b.endsWith(".") ? b : b + ".")
      );

  return {
    name: `exceptPaths(${inner.name})`,
    onInit: inner.onInit?.bind(inner),
    onValue(ctx, api) {
      if (isBlocked(api.join("."))) return;
      inner.onValue(ctx, api);
    },
    onAfterAll: inner.onAfterAll?.bind(inner),
  };
}

/**
 * filterEmits
 * Wrap a plugin and conditionally allow/block emitted facts
 * based on predicate name and args.
 *
 * Example:
 *   // drop 'manages/2' inverse relation
 *   const safeRels = filterEmits((pred) => pred !== "manages", rels);
 */
export function filterEmits(
  keep: (
    pred: string,
    args: ReadonlyArray<string | number | boolean>,
    api: ProjectionApi,
  ) => boolean,
  inner: ProjectionPlugin,
): ProjectionPlugin {
  return {
    name: `filterEmits(${inner.name})`,
    onInit: inner.onInit?.bind(inner),
    onValue(ctx, api) {
      const wrapped: ProjectionApi = {
        ...api,
        emit(pred, ...args) {
          if (keep(pred, args, api)) api.emit(pred, ...args);
        },
      };
      inner.onValue(ctx, wrapped);
    },
    onAfterAll(api) {
      inner.onAfterAll?.(api);
    },
  };
}

/* ------------------------------- Projections ------------------------------- */

/**
 * kvPredicateProjection
 * Replicates "prefixed snake_case predicates":
 * - primitive: pred(subject?, value)
 * - array-item: pred(subject?, index, value) (predicate name excludes the index)
 */
export function kvPredicateProjection(opts: Readonly<{
  prefix?: string;
  snakeCase?: boolean;
  sep?: string; // joiner for path segments in predicate
  subjectRequired?: boolean; // if true, skip emits if subject is undefined
}> = {}): ProjectionPlugin {
  const pref = opts.prefix ?? "";
  const sep = opts.sep ?? "_";
  const snake = opts.snakeCase ?? true;

  const pathToPred = (segments: readonly string[]) => {
    const clean = segments.map((s) => snake ? toSnake(s) : s);
    return pref + clean.join(sep);
  };

  return {
    name: "kvPredicate",
    onValue(ctx, api) {
      const hasSubject = api.subject !== undefined;
      if (opts.subjectRequired && !hasSubject) return;

      if (ctx.kind === "primitive") {
        const pred = pathToPred(api.path);
        if (hasSubject) {
          api.emit(pred, String(api.subject), ctx.value as Any);
        } else api.emit(pred, ctx.value as Any);
      } else if (ctx.kind === "array-item") {
        // exclude trailing index from predicate name
        const basePath = api.path.slice(0, -1);
        const pred = pathToPred(basePath);
        const index = ctx.index ??
          Number(api.path[api.path.length - 1]);
        if (hasSubject) {
          api.emit(
            pred,
            String(api.subject),
            index,
            ctx.value as Any,
          );
        } else api.emit(pred, index, ctx.value as Any);
      }
    },
  };
}

/** attr/3 : attr(Subject, "path.like.this", "Value") on primitives (and array items). */
export function attrProjection(pred = "attr"): ProjectionPlugin {
  return {
    name: "attr",
    onValue(ctx, api) {
      if (api.subject === undefined) return;
      if (ctx.kind === "primitive" || ctx.kind === "array-item") {
        api.emit(
          pred,
          String(api.subject),
          api.join("."),
          String(ctx.value),
        );
      }
    },
  };
}

/** flag/2 : flag(Subject, "path") based on presence, truthiness, or yes/no strings. */
export function flagProjection(
  pred = "flag",
  mode: "presence" | "truthy" | "yesNo" = "presence",
  yesValues: readonly string[] = ["yes", "true", "y", "1"],
): ProjectionPlugin {
  const yes = new Set(yesValues.map((s) => s.toLowerCase()));
  return {
    name: "flag",
    onValue(ctx, api) {
      if (api.subject === undefined) return;
      if (!(ctx.kind === "primitive" || ctx.kind === "array-item")) {
        return;
      }
      let ok = false;
      if (mode === "presence") ok = true;
      else if (mode === "truthy") ok = Boolean(ctx.value);
      else if (mode === "yesNo" && typeof ctx.value === "string") {
        ok = yes.has(ctx.value.toLowerCase());
      }
      if (ok) api.emit(pred, String(api.subject), api.join("."));
    },
  };
}

/**
 * statusItemProjection<TStatus>
 * Normalize categorical "status" strings to a typed union of keys from `synonyms`.
 * Emits: status_item(Subject, Family, Status)
 */
export function statusItemProjection<TStatus extends string>(
  keys: readonly string[],
  synonyms: Readonly<Record<TStatus, readonly string[]>>,
  pred = "status_item",
): ProjectionPlugin {
  const entries = Object.entries(synonyms) as unknown as readonly [
    TStatus,
    readonly string[],
  ][];
  const match = (raw: string): TStatus | undefined => {
    const v = raw.toLowerCase();
    for (const [label, syns] of entries) {
      if (syns.some((s) => v.includes(s.toLowerCase()))) return label;
    }
    return undefined;
  };
  return {
    name: "statusItem",
    onValue(ctx, api) {
      if (api.subject === undefined) return;
      if (ctx.kind !== "primitive" || typeof ctx.value !== "string") {
        return;
      }
      const key = api.join(".");
      if (!keys.includes(key)) return;
      const fam = key.split(".")[0] || "";
      const m = match(ctx.value);
      if (m) api.emit(pred, String(api.subject), fam, m);
    },
  };
}

/**
 * answeredProjection
 * For array-valued keys, emit:
 *   answered(Subject, "key")
 *   answered_value(Subject, "key", "Value") for each primitive item.
 */
export function answeredProjection(
  keys: readonly string[],
  answeredPred = "answered",
  answeredValPred = "answered_value",
): ProjectionPlugin {
  return {
    name: "answered",
    onValue(ctx, api) {
      if (api.subject === undefined) return;
      if (ctx.kind !== "array") return;
      const key = api.join(".");
      if (!keys.includes(key)) return;
      const arr = ctx.value as unknown[];
      if (!Array.isArray(arr) || arr.length === 0) return;
      api.emit(answeredPred, String(api.subject), key);
      for (const it of arr) {
        if (isPrimitive(it)) {
          api.emit(
            answeredValPred,
            String(api.subject),
            key,
            String(it),
          );
        }
      }
    },
  };
}

/** entityTypeUnaryProjection: emit a unary class fact like user(Id). */
export function entityTypeUnaryProjection(
  entityPred: string,
): ProjectionPlugin {
  return {
    name: "entityTypeUnary",
    onInit(api) {
      if (api.subject !== undefined) {
        api.emit(entityPred, String(api.subject));
      }
    },
    onValue() {/* no-op */},
  };
}

/**
 * relationMappingProjection
 * Map a fully-qualified path (without array index) to a relation predicate.
 * Optionally emit inverse relation.
 */
export function relationMappingProjection(
  opts: Readonly<{
    map: Readonly<Record<string, string>>; // key path -> relation pred
    inverse?: Readonly<Record<string, string>>; // relation pred -> inverse pred
  }>,
): ProjectionPlugin {
  const { map, inverse } = opts;
  return {
    name: "relationMapping",
    onValue(ctx, api) {
      if (api.subject === undefined) return;
      const isPrimItem = ctx.kind === "primitive" ||
        ctx.kind === "array-item";
      if (!isPrimItem) return;

      // For array-item, drop trailing index when matching mapping
      const key = ctx.kind === "array-item"
        ? api.path.slice(0, -1).join(".")
        : api.join(".");

      const rel = map[key];
      if (!rel) return;

      if (!isPrimitive(ctx.value)) return;
      api.emit(rel, String(api.subject), ctx.value);

      const inv = inverse?.[rel];
      if (inv) api.emit(inv, String(ctx.value), String(api.subject));
    },
  };
}

/**
 * attributeTypeProjection
 * Infer attribute types by path (string|number|boolean|relation).
 * Emits attribute_type("path", "string" | "number" | "boolean").
 */
export function attributeTypeProjection(
  pred = "attribute_type",
): ProjectionPlugin {
  const seen = new Map<string, Set<string>>();
  const note = (k: string, t: string) => {
    const set = seen.get(k) ?? new Set<string>();
    set.add(t);
    seen.set(k, set);
  };
  return {
    name: "attributeType",
    onValue(ctx, api) {
      if (ctx.kind === "primitive" || ctx.kind === "array-item") {
        const t = typeof ctx.value;
        const key = ctx.kind === "array-item"
          ? api.path.slice(0, -1).join(".")
          : api.join(".");
        if (t === "string" || t === "number" || t === "boolean") {
          note(key, t);
        }
      }
    },
    onAfterAll(api) {
      for (const [k, set] of seen.entries()) {
        for (const t of set) api.emit(pred, k, t);
      }
    },
  };
}

/**
 * provenanceProjection
 * Attaches source/tx/valid metadata to each emitted fact by hashing `pred(args)`.
 * Note: This inspects typed facts at onAfterAll (pure with respect to engine state).
 */
export function provenanceProjection(opts: Readonly<{
  sourceId?: string;
  txTimeIso?: string;
  validFromIso?: string;
  validToIso?: string;
  hashPred?: string; // optional custom predicate to expose hash, default none
}> = {}): ProjectionPlugin {
  const hash32 = (s: string): string => {
    // FNV-1a 32-bit
    let h = 0x811c9dc5;
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = (h +
        ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
    }
    return "0x" + h.toString(16).padStart(8, "0");
  };
  const print = (f: Fact) =>
    `${f.pred}(${
      f.args.map((a) => typeof a === "string" ? JSON.stringify(a) : String(a))
        .join(", ")
    })`;
  return {
    name: "provenance",
    onAfterAll(api) {
      const facts = api.facts();
      for (const f of facts) {
        const key = hash32(print(f));
        if (opts.sourceId) {
          api.emit("source", opts.sourceId);
          api.emit("fact_source", key, opts.sourceId);
        }
        if (opts.txTimeIso) api.emit("tx_time", key, opts.txTimeIso);
        if (opts.validFromIso || opts.validToIso) {
          api.emit(
            "valid_time",
            key,
            opts.validFromIso ?? "",
            opts.validToIso ?? "",
          );
        }
        if (opts.hashPred) api.emit(opts.hashPred, key);
      }
    },
    onValue() {/* no-op */},
  };
}

/**
 * booleanUnaryProjection
 * When a boolean true is seen at a path, emit a convenience unary predicate,
 * e.g., path "isActive" => "active(Subject)".
 */
export function booleanUnaryProjection(
  transform: (lastSegment: string) => string = (s) =>
    s.replace(/^is_?/, "").replace(/[^a-z0-9]+/gi, "_").toLowerCase(),
): ProjectionPlugin {
  return {
    name: "booleanUnary",
    onValue(ctx, api) {
      if (api.subject === undefined) return;
      if (
        ctx.kind !== "primitive" || typeof ctx.value !== "boolean" ||
        ctx.value !== true
      ) return;
      const last = api.path[api.path.length - 1] ?? "";
      const pred = transform(toSnake(last));
      if (pred) api.emit(pred, String(api.subject));
    },
  };
}
