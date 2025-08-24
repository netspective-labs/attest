# Attest Datalog Aide

Attest [Datalog](https://en.wikipedia.org/wiki/Datalog) Aide is a small, focused
toolkit for turning plain JavaScript/TypeScript objects into rich, schema-aware
Datalog facts you can query with hand-written rules in a Datalog engine like
Prolog, [Google Mangle](https://github.com/google/mangle) or
[Soufflé](https://souffle-lang.github.io/). See
[Modern Datalog Engines](https://soft.vub.ac.be/Publications/2022/vub-tr-soft-22-21.pdf)
for a good list.

Datalog Aide includes:

- a TypeScript API: `DatalogFacts.stringify(obj, options)`
- a CLI: `modctl.ts to-facts` that reads JSON from stdin and writes facts to
  stdout

It is designed for evidence-friendly systems where provenance, temporal
annotations, and deterministic outputs matter.

## What it does

- Flattens nested objects and arrays into Datalog facts
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

## Architecture at a glance

Input

- JSON object or array of objects

Processor

- `DatalogFacts.stringify` traverses properties, arrays, and nested objects
- Applies naming, relation mappings, type metadata, provenance, and temporal
  options
- Validates predicate arities when a registry is provided and strict mode is
  enabled

Output

- One fact per line: `predicate(arg1, arg2, ...).`
- Deterministically sorted and de-duplicated

## Installation

Use the library directly in a Deno 2 project:

```ts
// Local import; adjust path to where mod.ts lives in your repo
import { createRegistry, DatalogFacts } from "./mod.ts";
```

Use the CLI:

```bash
./modctl.ts --help
```

## TypeScript API quick start

```ts
import { createRegistry, DatalogFacts } from "./mod.ts";

const user = {
    userId: 123,
    userName: "Alice",
    isActive: true,
    profile: { city: "São Paulo" },
    roles: ["admin", "editor"],
};

const registry = createRegistry({
    user: 1,
    has_manager: 2,
    manages: 2,
});

const facts = DatalogFacts.stringify(user, {
    entityType: "user", // emits user(Id).
    objectId: "u1", // subject for attribute/relational facts
    prefix: "app.", // predicate prefix
    camelToSnakeCase: true, // userName -> user_name
    keySeparator: ".", // nested.profile.city -> profile.city
    includeTypes: true, // attribute_type("user_name","string")
    normalizeLowerCase: true, // *_lc variant for strings
    normalizeAscii: true, // *_ascii variant for strings
    booleanUnaryHelper: true, // is_active(u,true) => active(u)
    registry, // predicate arity map
    strictArity: true, // enforce arities
    schemaNs: "app.v1", // schema_ns("app.v1")
    required: ["email"], // missing_attr if absent
    cardinality: { roles: "many" },
    enumAllowed: { status: ["invited", "active", "suspended"] },
    includeProvenance: true, // fact_source/json_path/tx_time/valid_time
    sourceId: "fixture-001",
    txTimeIso: "2025-08-24T15:00:00Z",
});

console.log(facts.join("\n"));
```

Typical output highlights

```datalog
schema_ns("app.v1").
user("u1").
app.user_id("u1", 123).
attribute_type("user_id", "number").
app.user_name("u1", "Alice").
app.user_name_lc("u1", "alice").
app.user_name_ascii("u1", "Alice").
attribute_type("user_name", "string").
app.is_active("u1", true).
active("u1").
attribute_type("is_active", "boolean").
app.profile.city("u1", "São Paulo").
app.profile.city_lc("u1", "são paulo").
app.profile.city_ascii("u1", "Sao Paulo").
app.roles("u1", 0, "admin").
app.roles("u1", 1, "editor").
missing_attr("u1", "email").
...
```

## Options you will actually use

Naming and shapes

- prefix: prepend to every derived predicate (for namespacing)
- camelToSnakeCase: convert key paths to lower snake case
- keySeparator: used when building nested key paths (default “\_”)

Entity and relations

- entityType: emits a unary class predicate like user(Id)
- objectId: the subject for attribute and relation facts
- relationKeys: map property paths to relation predicates, e.g.
  `{ managerId: "has_manager" }`
- relationInverse: optional inverse relations, e.g. `{ has_manager: "manages" }`
- booleanUnaryHelper: emit a unary helper when a boolean attribute is true

Schema and meta

- includeTypes: emit attribute\_type facts
- enumAllowed: emit attribute\_allowed for finite domains
- cardinality: annotate one vs many
- required: emit missing\_attr if absent or undefined

Provenance and temporal

- includeProvenance: enable provenance output
- sourceId: identify the source
- txTimeIso: transaction time
- validFromIso and validToIso: validity time range

Quality controls

- registry and strictArity: arity registry and enforcement
- exclude: skip noisy keys

Arrays

- primitive arrays emit ternary facts `(subject, index, value)`
- complex arrays recurse with index in the path

Determinism

- output is sorted and de-duplicated

Friendly errors

- if a relation is mapped via relationKeys and strictArity is on but no objectId
  is provided, the library throws a clear error indicating the missing subject

## CLI quick start

The CLI reads JSON from stdin and writes facts to stdout.

Basic emit

```bash
cat user.json \
| ./modctl.ts to-facts \
  --entity-type user \
  --object-id u1 \
  --camel-to-snake \
  --prefix app.
```

Relational mapping with inverse and arity checks

```bash
cat user.json \
| ./modctl.ts to-facts \
  --entity-type user \
  --object-id u1 \
  --relation-keys '{"managerId":"has_manager"}' \
  --relation-inverse '{"has_manager":"manages"}' \
  --registry '{"user":1,"has_manager":2,"manages":2}' \
  --strict-arity
```

Derive subject ids from input objects

```bash
# users.json is an array of objects each with { "id": "...", ... }
cat users.json \
| ./modctl.ts to-facts \
  --entity-type user \
  --object-id-path id \
  --camel-to-snake
```

Schema and provenance

```bash
cat obj.json \
| ./modctl.ts to-facts \
  --include-types \
  --schema-ns app.v1 \
  --enum-allowed '{"status":["invited","active","suspended"]}' \
  --cardinality '{"roles":"many"}' \
  --required email \
  --include-provenance \
  --source-id "import-42" \
  --tx-time-iso "2025-08-24T15:10:00Z" \
  --valid-from-iso "2025-08-01T00:00:00Z"
```

Key flags

- JSON-accepting flags: `--relation-keys`, `--relation-inverse`, `--registry`,
  `--enum-allowed`, `--cardinality`
- CSV flags: `--exclude`, `--required`
- Derive id: `--object-id-path` for single objects or arrays
- Normalization: `--normalize-lower`, `--normalize-ascii`
- Safety: `--strict-arity` with `--registry`

Exit behavior

- exits non-zero on input parse failures or strict arity violations
- writes warnings to stderr for non-object array entries or non-primitive ids at
  `--object-id-path`

## Authoring rules on top of emitted facts

Unary helpers for class membership

```prolog
active_user(U) :- user(U), active(U).
```

Relations for org charts

```prolog
manages(M, E) :- has_manager(E, M).
manages(M, E) :- has_manager(E, X), manages(M, X).
```

Presence, required attributes, and data quality

```prolog
missing_required(U, A) :- user(U), required(attr:A, true), not has_attr(U, A).
invalid_email(U) :- has_attr(U, "email"), not email_e164(U, _).  % example with your own validators
```

String normalization helpers

```prolog
city_matches_ascii(U, "Sao Paulo") :- app.profile.city_ascii(U, "Sao Paulo").
```

Temporal reasoning with provenance

```prolog
recent_fact(H) :- tx_time(H, T), T >= "2025-08-01T00:00:00Z".
from_source(H, "import-42") :- fact_source(H, "import-42").
```

## Testing and CI patterns

Golden snapshots

- capture `.facts` files and compare in Deno tests
- deterministic sorting and de-dupe keep diffs stable

CLI tests with Dax

- invoke `modctl.ts` with `$` from JSR, pipe stdin, assert on stdout/stderr

Example target assertions

- presence of key facts, not exact ordering
- friendly error when relation is used without `objectId` in strict mode

## Troubleshooting

Relation mapped but no objectId

- enable strict mode and provide `objectId` or `--object-id-path`
- or remove the relation mapping for that property

Arity mismatch

- ensure `--registry` matches the predicates you emit and their argument counts
- inverse relations also need entries in the registry when `--strict-arity` is
  on

Unexpected predicate names

- review `prefix`, `camelToSnakeCase`, and `keySeparator` interactions
- relation mappings bypass prefix and case conversion, by design

No facts for a key

- key may be in `--exclude`
- value may be null/undefined and you did not supply an `undefinedFact` handler

## Recommended conventions

- subject-first, value-second for attributes; subject-object for relations;
  subject-index-value for arrays
- give relation predicates semantic names (`has_manager`) rather than scalar
  ones (`manager_id`)
- always emit a unary entity predicate (`user(Id)`) per object
- choose and stick to a schema namespace version (`schema_ns("app.v1")`) for
  evolution

## Roadmap ideas

- optional Soufflé printer while keeping the current printer
- JSON-Lines (`jsonl`) input mode for the CLI
- round-trip helpers from facts to objects for selected patterns
- richer normalization (ICU) delegated to platform features
