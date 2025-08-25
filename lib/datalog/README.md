# Attest Datalog Aide

Attest [Datalog](https://en.wikipedia.org/wiki/Datalog) Aide is a small, focused
toolkit for turning plain JavaScript/TypeScript objects into rich, schema-aware
Datalog facts you can query with hand-written rules in a Datalog engine like
Prolog, [Google Mangle](https://github.com/google/mangle) or
[Soufflé](https://souffle-lang.github.io/). See
[Modern Datalog Engines](https://soft.vub.ac.be/Publications/2022/vub-tr-soft-22-21.pdf)
for a good list.

## What it does

- Flattens nested objects and arrays into Datalog _facts_
- Adds optional entity, relation, and schema context so your rules are simpler
- Enforces predicate arities via an optional registry
- Emits helpful meta-facts (attribute types, enums, cardinality,
  presence/missing)
- Adds provenance and temporal annotations for downstream auditability
- Produces stable, sorted, de-duplicated output for snapshot testing

## When to use it

- You want to feed objects from apps, logs, or ETL pipelines into a Datalog
  engine
- You want consistent predicate naming and argument order without hand-crafting
  facts
- You want to layer human-written rules on top of a predictable fact base
- You want traceability for where each fact came from and when it was valid

## Developer Guide

This guide teaches you how to turn JSON into Datalog facts using a tiny,
deterministic engine and composable projection plugins. We start simple and
gradually add power (for advanced functionality).

### What you get

- Engine (`stringify`) — walks JSON, calls your projections, returns fact
  strings.
- Projections — pure, small plugins that decide _what facts to emit_.
- Projection packs — curated, composable bundles for common tasks.
- Combinators — helpers to filter, prefix, compose, or suppress emitted facts.

Everything is functional, immutable, and side-effect free.

### Install & Layout

```
lib/datalog/
  core.ts               # engine (no domain logic)
  projection.ts         # projection plugins + combinators
  pack.ts               # projection packs (ready to use)
  mod.ts                # public exports
```

Import from your code:

```ts
import { stringify } from "./lib/datalog/mod.ts";
import { pack } from "./lib/datalog/mod.ts";
```

### Getting started (the “Hello, facts”)

We’ll emit classic `snake_case` key predicates, scoped by an object id:

```ts
import { pack, stringify } from "./lib/datalog/mod.ts";

const json = {
  id: "u1",
  userName: "Alice",
  isActive: true,
};

const out = stringify(json, {
  objectId: "u1",
  projections: [
    // basic KV facts like: app.user_name("u1","Alice").
    pack.basicKV({ prefix: "app.", snakeCase: true }),
  ],
});

console.log(out.join("\n"));
```

Output (order sorted & de-duped):

```
app.id("u1", "u1").
app.is_active("u1", true).
app.user_name("u1", "Alice").
```

- The engine only walks the JSON.
- The projection decides what facts to print.

### Add helper facts for easier rules

The `genericKVWithHelpers` pack adds:

- `attr/3`: flat key/value (`attr(Id, "userName", "Alice")`)
- `flag/2`: presence/yes-no (`flag(Id, "sc.hasDiagram")`)
- `status_item/3`: normalized categorical statuses
- `answered/2` + `answered_value/3` for array coverage

```ts
import { pack, stringify } from "./lib/datalog/mod.ts";

const data = {
  id: "u1",
  userName: "Alice",
  sc: {
    implementationStatus: "Partially",
    training: ["ops", "101"], // multi-select
  },
  pp: { implementationStatus: "Fully implemented" },
};

const Status = {
  not: ["not", "not implemented"],
  partially: ["partially", "partial", "in progress"],
  fully: ["fully", "fully implemented", "complete"],
} as const;

const out = stringify(data, {
  objectId: "u1",
  projections: [
    pack.genericKVWithHelpers({
      prefix: "app.",
      statusKeys: [
        "sc.implementationStatus",
        "pp.implementationStatus",
      ] as const,
      statusSynonyms: Status, // typed and collision-safe
      answeredKeys: ["sc.training"] as const,
    }),
  ],
});

console.log(out.join("\n"));
```

You’ll see (among others):

```
status_item("u1", "pp", "fully").
status_item("u1", "sc", "partially").
answered("u1", "sc.training").
answered_value("u1", "sc.training", "ops").
answered_value("u1", "sc.training", "101").
attr("u1", "userName", "Alice").
```

Your Datalog rules can now be tiny and generic, using just
`status_item/answered/attr`.

### Add schema + provenance (audit-friendly)

Attach entity type (`user(Id)`), attribute types, and provenance metadata:

```ts
const enriched = stringify(data, {
  objectId: "u1",
  projections: [
    pack.genericKVWithHelpers({/* …as above… */}),
    pack.schemaAndProvenance({
      entityPred: "user", // emits user("u1").
      sourceId: "ingestion-42", // emits source/1 & fact_source/2
      txTimeIso: "2025-08-24T00:00:00Z",
      validFromIso: "2025-08-01T00:00:00Z",
      validToIso: "2025-12-31T23:59:59Z",
      booleanUnary: true, // isActive -> active("u1").
    }),
  ],
});
```

You get:

- `attribute_type("userName", "string").`
- `source("ingestion-42").`, `fact_source("<hash>", "ingestion-42").`
- `tx_time("<hash>", "2025-08-24T00:00:00Z").`
- `valid_time("<hash>", "2025-08-01T00:00:00Z", "2025-12-31T23:59:59Z").`

> The pack inspects already-emitted facts in `onAfterAll`, so order matters:
> emit facts first, then attach meta.

### Relationships with optional inverses

Map specific keys to relations and optionally emit an inverse:

```ts
import { pack, stringify } from "./lib/datalog/mod.ts";

const employee = { id: "e9", managerId: "m1" };

const out = stringify(employee, {
  objectId: "e9",
  projections: [
    pack.relationsWithInverse({
      map: { "managerId": "has_manager" },
      inverse: { has_manager: "manages" }, // optional
    }),
  ],
});
// has_manager("e9","m1") and manages("m1","e9")
```

#### Suppress the inverse (fine-grained)

Use `filterEmits` to drop specific emitted facts:

```ts
import { filterEmits } from "./lib/datalog/mod.ts";
const relations = pack.relationsWithInverse({
  map: { managerId: "has_manager" },
  inverse: { has_manager: "manages" },
});

const directOnly = filterEmits((pred) => pred !== "manages", relations);

stringify(employee, { objectId: "e9", projections: [directOnly] });
// only: has_manager("e9","m1")
```

### Ignoring fields (PII & noise)

#### Ignore by path (blocklist)

Wrap your projection with `exceptPaths`:

```ts
import { exceptPaths, pack, stringify } from "./lib/datalog/mod.ts";

const base = pack.genericKVWithHelpers({/* … */});
const meta = pack.schemaAndProvenance({ entityPred: "user", sourceId: "src" });

const blocked = ["password", "ci.ssn"]; // blocks "password" and "ci.*" subtree

const out = stringify(myJson, {
  objectId: "u1",
  projections: [
    exceptPaths(blocked, base),
    exceptPaths(blocked, meta), // even schema ignores these fields
  ],
});
```

#### Ignore by emitted predicate/args

Drop facts based on predicate/arity/values:

```ts
import { filterEmits, pack } from "./lib/datalog/mod.ts";

const kv = pack.basicKV({ prefix: "app.", snakeCase: true });

// Drop the specific `app.id/2` fact
const kvNoId = filterEmits(
  (pred, args) => !(pred === "app.id" && args.length >= 2),
  kv,
);

stringify(myJson, { objectId: "u1", projections: [kvNoId] });
```

### Composing and gating projections

You can compose projections and gate where they run.

```ts
import {
  attrProjection,
  compose,
  kvPredicateProjection,
  onlyKinds,
  onlyPath,
  statusItemProjection,
  withPredicatePrefix,
} from "./lib/datalog/mod.ts";

const Status = {
  ok: ["ok", "green"],
  warn: ["warn", "yellow"],
  err: ["err", "red"],
} as const;

const projections = compose(
  // Base KV with prefix
  kvPredicateProjection({ prefix: "k.", snakeCase: true }),
  // Only run attr for "sc.*" paths
  onlyPath((p) => p.startsWith("sc."), attrProjection("sc_attr")),
  // Namespace status facts under "ns." and run only on primitives
  withPredicatePrefix(
    "ns.",
    onlyKinds(
      ["primitive"],
      statusItemProjection(["health.status"] as const, Status, "health_status"),
    ),
  ),
);

stringify(json, { objectId: "h1", projections });
```

### The projection API (for advanced functionality)

Engine: `stringify(src, { objectId?, projections, sort?, dedupe? }) → string[]`

- Walks every value in `src`.
- Calls your projections with a `NodeContext` and `ProjectionApi`.

NodeContext

```ts
type NodeKind =
  | "primitive"
  | "nullish"
  | "function"
  | "object"
  | "array"
  | "array-item";

type NodeContext = {
  kind: NodeKind;
  value: unknown;
  key?: string; // when visiting object properties
  index?: number; // when visiting array items
};
```

ProjectionApi

```ts
interface ProjectionApi {
  readonly subject?: string | number; // objectId you passed in
  readonly path: readonly string[]; // current path segments
  join(sep?: string): string; // convenience — joined path
  emit(pred: string, ...args: (string | number | boolean)[]): void; // typed fact
  emitRaw(line: string): void; // already-printed line; '.' will be added if missing
  facts(): readonly Fact[]; // snapshot of typed facts so far
}
```

ProjectionPlugin

```ts
interface ProjectionPlugin {
  name: string;
  onInit?(api: ProjectionApi): void; // called before traversal
  onValue(ctx: NodeContext, api: ProjectionApi): void; // called for each visited node
  onAfterAll?(api: ProjectionApi): void; // called after traversal
}
```

Write your own plugin

```ts
import type {
  NodeContext,
  ProjectionApi,
  ProjectionPlugin,
} from "./lib/datalog/mod.ts";

export function myDatesProjection(): ProjectionPlugin {
  return {
    name: "dates→iso",
    onValue(ctx, api) {
      if (api.subject === undefined) return;
      if (ctx.kind !== "primitive") return;
      if (typeof ctx.value !== "string") return;
      if (!/^\d{4}-\d{2}-\d{2}/.test(ctx.value)) return; // naive date detection

      api.emit(
        "date_attr",
        String(api.subject),
        api.join("."),
        ctx.value.slice(0, 10),
      );
    },
  };
}
```

Ship it with a pack

```ts
import { compose, kvPredicateProjection } from "./lib/datalog/mod.ts";
import { myDatesProjection } from "./my-dates.ts";

export const packDates = () =>
  compose(
    kvPredicateProjection({ prefix: "app.", snakeCase: true }),
    myDatesProjection(),
  );
```

### Testing patterns

#### Unit test a projection (no engine)

- Create a tiny mock `ProjectionApi` that captures `emit`/`emitRaw`.
- Call `onValue` with your own `NodeContext` objects.
- Assert captured facts.

(See `projection_test.ts` for examples including `exceptPaths` and
`filterEmits`.)

#### End-to-end test a pack (engine included)

- Call `stringify` with a JSON fixture + your pack(s).
- Assert key facts are present; don’t overfit on ordering (the engine sorts).
- Keep tests small and readable (see `mod_test.ts`).

### Tips, pitfalls, and performance

- Status synonyms: avoid overlaps like `"implemented"` vs `"Not implemented"`.
  Prefer explicit phrases (`"fully implemented"`, `"not implemented"`). If you
  must overlap, list the stricter match earlier (e.g., `not` before `fully`).
- Order matters for meta: anything that inspects _emitted_ facts (schema,
  provenance) should come after base emitters in `projections: []`.
- Gating is cheap: use `onlyPath`, `onlyKinds`, `exceptPaths` to cut unnecessary
  work.
- Typed status unions: with `statusItemProjection<T>`, your synonyms map defines
  the status type and locks downstream TS code to valid values.
- Side-effect free: projections should only use `api.*` to emit; avoid global
  state or I/O.

### Quick reference

Common packs

```ts
pack.basicKV({ prefix, snakeCase, sep, subjectRequired });
pack.genericKVWithHelpers({ prefix, statusKeys, statusSynonyms, answeredKeys });
pack.relationsWithInverse({ map, inverse });
pack.schemaAndProvenance({
  entityPred,
  sourceId,
  txTimeIso,
  validFromIso,
  validToIso,
  booleanUnary,
});
pack.withPrefix(prefix, innerPack);
```

Core projections

```ts
kvPredicateProjection({ prefix?, snakeCase?, sep?, subjectRequired? })
attrProjection(pred = "attr")
flagProjection(pred = "flag", mode = "presence"|"truthy"|"yesNo", yesValues = ["yes","true","y","1"])
statusItemProjection<TStatus>(keys, synonyms: Record<TStatus,string[]>, pred = "status_item")
answeredProjection(keys, answeredPred = "answered", answeredValPred = "answered_value")
entityTypeUnaryProjection(entityPred)
relationMappingProjection({ map, inverse? })
attributeTypeProjection(pred = "attribute_type")
provenanceProjection({ sourceId?, txTimeIso?, validFromIso?, validToIso?, hashPred? })
booleanUnaryProjection(transform? = segment => …)
```

Combinators

```ts
compose(...plugins);
onlyKinds(kinds, inner);
onlyPath(pathPredicate, inner);
withPredicatePrefix(prefix, inner);
exceptPaths(blockedPathsOrFn, inner);
filterEmits(keepFn, inner);
```

### Example: “from 0 to production” in \~10 lines

```ts
import { compose, exceptPaths, pack, stringify } from "./lib/datalog/mod.ts";

const Status = {
  not: ["not", "not implemented"],
  partially: ["partial", "in progress"],
  fully: ["fully", "fully implemented"],
} as const;

const projections = compose(
  pack.genericKVWithHelpers({
    prefix: "app.",
    statusKeys: ["pp.implementationStatus", "sc.implementationStatus"] as const,
    statusSynonyms: Status,
    answeredKeys: ["sc.training"] as const,
  }),
  pack.schemaAndProvenance({
    entityPred: "user",
    sourceId: "prod-import-17",
    booleanUnary: true,
  }),
);

// Block PII (one line)
const hardened = exceptPaths(["password", "ci.ssn"], projections);

// Run
console.log(
  stringify(loadJson(), { objectId: "u123", projections: [hardened] }).join(
    "\n",
  ),
);
```

## Handling Function-Valued Fields (safe, deterministic)

Sometimes a field in your input object isn’t a scalar—it’s a function that can
compute a value on demand (e.g., `metrics.score()`). Executing arbitrary code
during fact generation is risky and can break determinism. This section shows
how to do it safely with two opt-in projections and a few guardrails.

## TL;DR

- Default: don’t run user code. Use `functionInfoProjection` to _describe_
  functions.
- Opt-in: when you must compute results, use `evaluateFunctionsProjection` with:

  - a tight allowlist of paths,
  - sync-only execution (no Promises),
  - depth limits and error capture,
  - output style: `"attr"` or `"kv"`.

Everything stays pure from the engine’s perspective.

### Describe functions without running them

```ts
import { functionInfoProjection, stringify } from "./mod.ts";

const json = { actions: { recalc: function recalc() {/* ... */} } };

const out = stringify(json, {
  objectId: "u1",
  projections: [functionInfoProjection("fn_info")],
});

console.log(out.join("\n"));
/*
fn_info("u1", "actions.recalc", "recalc", 0).
*/
```

This is the safest default. You can write rules like:

```prolog
has_action(Id, Path) :- fn_info(Id, Path, _, _).
```

### Evaluate whitelisted functions (sync, depth-limited)

```ts
import {
  compose,
  evaluateFunctionsProjection,
  kvPredicateProjection,
  stringify,
} from "./mod.ts";

const json = {
  id: "u1",
  metrics: {
    score: () => 99, // primitive
    tags: () => ["alpha", "beta"], // array
  },
};

// Only run *these* functions; emit KV-style facts with a prefix.
const evalFns = evaluateFunctionsProjection({
  allow: ["metrics.score", "metrics.tags"], // tight allowlist
  mode: "kv",
  prefix: "app.",
  snakeCase: true,
  errorPred: "fn_error", // optional: emit errors as facts
  maxDepth: 1, // default; traverse returns shallowly
});

const projections = compose(
  kvPredicateProjection({ prefix: "app.", snakeCase: true }), // regular KV too
  evalFns,
);

const out = stringify(json, { objectId: "u1", projections });
console.log(out.join("\n"));
/*
app.id("u1", "u1").
app.metrics_score("u1", 99).
app.metrics_tags("u1", 0, "alpha").
app.metrics_tags("u1", 1, "beta").
*/
```

#### Notes

- If the function throws, `fn_error(Subject, "path", "Error: message").` is
  emitted when `errorPred` is set.
- If a function returns a Promise, it’s rejected with an error fact (async not
  supported).

### Attribute-style emission instead of KV

```ts
const evalAsAttr = evaluateFunctionsProjection({
  allow: ["profile.computeAge"],
  mode: "attr", // emits attr(Id,"profile.computeAge","42")
  errorPred: "fn_error",
});

stringify(json, { objectId: "u1", projections: [evalAsAttr] });
/*
attr("u1", "profile.computeAge", "42").
*/
```

### Controlling scope & behavior

#### Allowlist predicate

You can allow by function:

```ts
const allow = (path: string, fn: unknown) =>
  path === "metrics.safeCalc" && typeof fn === "function";

evaluateFunctionsProjection({ allow, mode: "attr" });
```

#### Depth & nested functions

- `maxDepth` bounds traversal of returned objects/arrays.
- `skipNestedFunctions` (default `true`) prevents evaluating any functions found
  _inside_ the returned data structure.

#### Custom caller (bind context/args)

```ts
const evalWithContext = evaluateFunctionsProjection({
  allow: ["calc.withContext"],
  call: (fn) => (fn as any).call({ tz: "UTC" }), // no args; still sync
  mode: "attr",
});
```

### Security & determinism checklist

- Never evaluate untrusted code.
- Keep the allowlist tight (exact paths, not wildcards).
- Sync only; no Promises, no timers.
- Avoid non-deterministic functions (e.g., `Date.now()`, `Math.random()`).

  - If unavoidable, record provenance (`pack.schemaAndProvenance`) so results
    are audit-traceable.
- Use `exceptPaths` to block sensitive subtrees entirely.
- Use `filterEmits` to suppress any specific predicates you don’t want to leak.

### Common patterns

#### “Document functions, compute a subset”

```ts
import {
  compose,
  evaluateFunctionsProjection,
  functionInfoProjection,
} from "./mod.ts";

const projections = compose(
  functionInfoProjection("fn_info"),
  evaluateFunctionsProjection({
    allow: ["metrics.score", "risk.estimate"],
    mode: "attr",
    errorPred: "fn_error",
  }),
);
```

#### Gate evaluation to a subtree

```ts
import { evaluateFunctionsProjection, onlyPath } from "./mod.ts";

const gatedEval = onlyPath(
  (p) => p.startsWith("sc."), // e.g., only under System & Communications
  evaluateFunctionsProjection({
    allow: ["sc.computeScore"],
    mode: "kv",
    prefix: "sc.",
  }),
);
```

#### Harden a pack with ignores & filters

```ts
import {
  compose,
  evaluateFunctionsProjection,
  exceptPaths,
  filterEmits,
  pack,
} from "./mod.ts";

const base = pack.genericKVWithHelpers({
  prefix: "app.",
  statusKeys: [],
  statusSynonyms: {},
  answeredKeys: [],
});

const evalFns = evaluateFunctionsProjection({
  allow: ["metrics.score"],
  mode: "kv",
  prefix: "app.",
});

// Block PII entirely, and drop a specific emitted predicate if it sneaks through
const hardened = compose(
  exceptPaths(["ci.ssn", "secrets"], compose(base, evalFns)),
  filterEmits((pred) => pred !== "app.secrets", base),
);
```

### Testing function projections

Unit test projections (no engine):

- Use the mock `ProjectionApi` pattern (see `projection_test.ts`).
- Call `onValue({ kind: "function", value: fn })`.
- Assert emitted facts (or `fn_error`).

End-to-end test (engine + packs):

- Build a minimal JSON fixture with one or two functions.
- Compose KV + `functionInfoProjection` + `evaluateFunctionsProjection`.
- Assert both metadata and computed facts appear.

### Anti-patterns to avoid

- Evaluating everything (no allowlist).
- Async evaluators (they break determinism and the engine contract).
- Hidden I/O inside evaluated functions (network, filesystem).
- Deep, unbounded traversal of returned structures (`maxDepth` exists for a
  reason).
- Overlapping responsibilities: keep computation small; if logic grows, compute
  upstream and pass scalars into the facts generator.

### Quick reference

```ts
functionInfoProjection(pred = "fn_info")
// Emits: fn_info(Subject, "path", "fnName", Arity).

evaluateFunctionsProjection({
  allow: string[] | (path: string, fn: unknown) => boolean,
  mode?: "attr" | "kv",
  prefix?: string, snakeCase?: boolean, sep?: string,
  maxDepth?: number,                    // default 1
  errorPred?: string,                   // e.g., "fn_error"
  skipNestedFunctions?: boolean,        // default true
  call?: (fn: unknown) => unknown,      // default: (fn)=>fn()
})
```

Use these two together to stay safe by default, and explicit when you need
computed values.
