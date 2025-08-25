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
deterministic engine and composable projection plugins. We start simple
(junior-friendly) and gradually add power (for seniors).

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

### 1) Getting started (the “Hello, facts”)

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

### 2) Add helper facts for easier rules

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

### 3) Add schema + provenance (audit-friendly)

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

### 4) Relationships with optional inverses

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

### 5) Ignoring fields (PII & noise)

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

### 6) Composing and gating projections

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

### 7) The projection API (for advanced functionality)

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

### 8) Testing patterns

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

### 9) Tips, pitfalls, and performance

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

### 10) Quick reference

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

### 11) Migration notes (old → projections-first)

- Replace option soup with packs (start with `genericKVWithHelpers`).
- Move “entity type”, “relations”, “provenance”, “schema” into packs in the
  projections array.
- Where you previously toggled booleans, prefer composition (`compose`) and
  filters (`onlyPath`, `exceptPaths`, `filterEmits`).
- Rules get shorter once you rely on `status_item/answered/attr` instead of
  per-family predicates.

### 12) Example: “from 0 to production” in \~10 lines

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

You’re live, with a tiny engine you’ll almost never touch again — and projection
plugins/packs that you can compose, filter, and evolve safely over time.
