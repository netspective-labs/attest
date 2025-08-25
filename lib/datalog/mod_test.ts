// mod_test.ts
import {
  assert,
  assertArrayIncludes,
  assertEquals,
} from "jsr:@std/assert@^1.0.14";
import {
  answeredProjection,
  attrProjection,
  booleanUnaryProjection,
  compose,
  evaluateFunctionsProjection,
  exceptPaths,
  filterEmits,
  functionInfoProjection,
  kvPredicateProjection,
  onlyPath,
  pack,
  relationMappingProjection,
  statusItemProjection,
  stringify,
} from "./mod.ts";

Deno.test("pack.genericKVWithHelpers end-to-end-ish", () => {
  const json = {
    id: "u1",
    userName: "Alice",
    isActive: true,
    pp: { implementationStatus: "Fully implemented" },
    sc: {
      implementationStatus: "Partially",
      implementationStatus2: "Not implemented",
      training: ["101", "ops"],
    },
  };

  const statusSyn = {
    not: ["not", "not implemented", "none", "missing"],
    partially: ["partial", "partially", "in progress"],
    fully: ["fully", "fully implemented", "complete"],
  } as const;

  const projections = pack.genericKVWithHelpers({
    prefix: "app.",
    statusKeys: [
      "pp.implementationStatus",
      "sc.implementationStatus",
      "sc.implementationStatus2",
    ] as const,
    statusSynonyms: statusSyn,
    answeredKeys: ["sc.training"] as const,
  });

  const meta = pack.schemaAndProvenance({
    entityPred: "user",
    sourceId: "fixture-1",
    booleanUnary: true,
  });

  const out = stringify(json, {
    objectId: "u1",
    projections: [projections, meta],
  });

  // Determinism
  const sorted = [...out].sort((a, b) => a.localeCompare(b));
  assertEquals(out, sorted);

  // Entity + unary boolean
  assert(out.includes(`user("u1").`));
  assert(out.includes(`active("u1").`)); // from booleanUnaryProjection

  // Classic KV (snake case + prefix)
  assert(out.includes(`app.user_name("u1", "Alice").`));
  assert(
    out.includes(`app.is_active("u1", true).`) ||
      out.includes(`app.is_active("u1", "true").`),
  );

  // Status items
  assertArrayIncludes(out, [
    `status_item("u1", "pp", "fully").`,
    `status_item("u1", "sc", "partially").`,
    `status_item("u1", "sc", "not").`,
  ]);

  // Answered coverage
  assertArrayIncludes(out, [
    `answered("u1", "sc.training").`,
    `answered_value("u1", "sc.training", "101").`,
    `answered_value("u1", "sc.training", "ops").`,
  ]);

  // Attribute types (emitted in onAfterAll)
  assert(
    out.some((l) => l.startsWith(`attribute_type("userName",`)) &&
      out.some((l) => l.startsWith(`attribute_type("isActive",`)),
  );

  // Provenance (source + fact_source)
  assert(out.some((l) => l.startsWith(`source("fixture-1")`)));
  assert(out.some((l) => l.startsWith(`fact_source("0x`)));
});

Deno.test("pack.basicKV respects subjectless mode (skip when required)", () => {
  const json = { a: 1 };
  // subjectRequired = true (should emit nothing when objectId is missing)
  const kv = pack.basicKV({ prefix: "p.", subjectRequired: true });
  const out = stringify(json, { projections: [kv] });
  assertEquals(out.length, 0);
});

Deno.test("custom pack: relations (with inverse) + namespacing + schema/provenance", () => {
  const json = { id: "u2", userName: "Bob", managerId: "u1" };

  // Compose a custom pack: namespaced relations + entity + provenance
  const rels = pack.withPrefix(
    "ns.", // prefix relation predicate names
    pack.relationsWithInverse({
      map: { "managerId": "has_manager" },
      inverse: { "has_manager": "manages" },
    }),
  );

  const meta = pack.schemaAndProvenance({
    entityPred: "user",
    sourceId: "src-2",
    booleanUnary: false,
  });

  // Add a tiny KV so we also get typed attributes
  const kv = pack.basicKV({
    prefix: "k.",
    snakeCase: true,
    subjectRequired: true,
  });

  const out = stringify(json, {
    objectId: "u2",
    projections: [rels, meta, kv],
  });

  // Relations (with prefix)
  const expect = [
    `ns.has_manager("u2", "u1").`,
    `ns.manages("u1", "u2").`,
    `user("u2").`,
    `k.user_name("u2", "Bob").`,
  ];
  for (const e of expect) {
    if (!out.includes(e)) {
      throw new Error(
        `missing expected fact: ${e}\nGot:\n${out.join("\n")}`,
      );
    }
  }

  // Provenance snippets exist
  if (!out.some((l) => l.startsWith(`source("src-2")`))) {
    throw new Error("expected source('src-2')");
  }
  if (!out.some((l) => l.startsWith(`fact_source("0x`))) {
    throw new Error("expected fact_source(hash, 'src-2')");
  }
});

Deno.test("custom status palette (R/Y/G) via generic statusItemProjection", () => {
  const json = { health: { status: "green" }, id: "h1" };

  const HealthSyn = {
    red: ["red", "critical"],
    yellow: ["yellow", "warn"],
    green: ["green", "ok"],
  } as const;

  const custom = compose(
    kvPredicateProjection({ prefix: "k.", snakeCase: true }),
    statusItemProjection(
      ["health.status"] as const,
      HealthSyn,
      "health_status",
    ),
    pack.schemaAndProvenance({
      entityPred: "host",
      sourceId: "src-health",
    }),
  );

  const out = stringify(json, { objectId: "h1", projections: [custom] });

  const expect = [
    `health_status("h1", "health", "green").`,
    `k.health_status("h1", "green").`,
    `host("h1").`,
  ];
  for (const e of expect) {
    if (!out.includes(e)) {
      throw new Error(
        `missing expected fact: ${e}\nGot:\n${out.join("\n")}`,
      );
    }
  }
});

Deno.test("gated attr projection for sc.* only (with base KV for all)", () => {
  const json = {
    pp: { implementationStatus: "Fully" },
    sc: { implementationStatus: "Partially", training: ["101"] },
  };

  const kvAll = pack.basicKV({ prefix: "p.", snakeCase: true });
  const scAttrsOnly = onlyPath(
    (j) => j.startsWith("sc."),
    attrProjection("sc_attr"),
  );

  const out = stringify(json, {
    objectId: "u3",
    projections: [kvAll, scAttrsOnly],
  });

  // KV exists for both pp.* and sc.*
  if (!out.includes(`p.pp_implementation_status("u3", "Fully").`)) {
    throw new Error("expected KV for pp.*");
  }
  if (!out.includes(`p.sc_implementation_status("u3", "Partially").`)) {
    throw new Error("expected KV for sc.*");
  }

  // Attr exists only for sc.*
  if (
    !out.includes(`sc_attr("u3", "sc.implementationStatus", "Partially").`)
  ) {
    throw new Error("expected attr for sc.*");
  }
  if (out.some((l) => l.startsWith(`sc_attr("u3", "pp.`))) {
    throw new Error("unexpected attr for pp.*");
  }
});

Deno.test("booleanUnaryProjection standalone helper", () => {
  const json = { isAdmin: true, isOwner: false };

  const custom = compose(
    kvPredicateProjection({ prefix: "u.", snakeCase: true }),
    booleanUnaryProjection(), // emits admin("id") from isAdmin = true
  );

  const out = stringify(json, { objectId: "u42", projections: [custom] });

  if (!out.includes(`admin("u42").`)) {
    throw new Error("expected admin('u42') unary fact");
  }
  // Should NOT emit for false
  if (out.includes(`owner("u42").`)) {
    throw new Error("did not expect owner('u42') for false boolean");
  }
});

Deno.test("provenance with valid time window", () => {
  const json = { a: 1 };

  const p = pack.schemaAndProvenance({
    entityPred: "thing",
    sourceId: "src-3",
    txTimeIso: "2025-08-24T00:00:00Z",
    validFromIso: "2025-08-01T00:00:00Z",
    validToIso: "2025-12-31T23:59:59Z",
  });

  const out = stringify(json, {
    objectId: "t1",
    projections: [pack.basicKV(), p],
  });

  if (!out.includes(`thing("t1").`)) {
    throw new Error("expected thing('t1')");
  }
  if (!out.some((l) => l.startsWith(`source("src-3")`))) {
    throw new Error("expected source('src-3')");
  }
  if (!out.some((l) => l.startsWith(`tx_time("0x`))) {
    throw new Error("expected tx_time(hash, ...)");
  }
  if (!out.some((l) => l.startsWith(`valid_time("0x`))) {
    throw new Error("expected valid_time(hash, ...)");
  }
});

Deno.test("inline custom pack: KV + relations + status + answered + boolean unary + schema/provenance", () => {
  const json = {
    id: "u9",
    userName: "Eve",
    isActive: true,
    managerId: "u1",
    sc: { implementationStatus: "Not implemented", training: ["ops"] },
  };

  const statusSyn = {
    not: ["not", "not implemented", "none", "missing"],
    partially: ["partial", "partially", "in progress"],
    fully: ["fully", "fully implemented", "complete"],
  } as const;

  const customPack = compose(
    kvPredicateProjection({ prefix: "k.", snakeCase: true }),
    relationMappingProjection({
      map: { "managerId": "has_manager" },
      inverse: { "has_manager": "manages" },
    }),
    statusItemProjection(
      ["sc.implementationStatus"] as const,
      statusSyn,
      "status_item",
    ),
    answeredProjection(
      ["sc.training"] as const,
      "answered",
      "answered_value",
    ),
    booleanUnaryProjection(),
    pack.schemaAndProvenance({
      entityPred: "user",
      sourceId: "src-kitchen",
    }),
  );

  const out = stringify(json, { objectId: "u9", projections: [customPack] });

  const expect = [
    `user("u9").`,
    `k.user_name("u9", "Eve").`,
    `k.is_active("u9", true).`,
    `has_manager("u9", "u1").`,
    `manages("u1", "u9").`,
    `status_item("u9", "sc", "not").`,
    `answered("u9", "sc.training").`,
    `answered_value("u9", "sc.training", "ops").`,
    `active("u9").`,
  ];
  for (const e of expect) {
    if (!out.includes(e)) {
      throw new Error(
        `missing expected fact: ${e}\nGot:\n${out.join("\n")}`,
      );
    }
  }
});

Deno.test("end-to-end: exceptPaths ignores PII across packs", () => {
  const json = {
    id: "u1",
    userName: "Alice",
    password: "secret",
    ci: { ssn: "123-45-6789", email: "a@b" },
  };

  // Base pack
  const base = pack.genericKVWithHelpers({
    prefix: "app.",
    statusKeys: [] as const,
    statusSynonyms: {} as const,
    answeredKeys: [] as const,
  });

  // Also wrap schema/provenance so attribute_type doesn't learn about blocked fields
  const meta = pack.schemaAndProvenance({
    entityPred: "user",
    sourceId: "src-safe",
  });

  const blocked = ["password", "ci.ssn"];

  const out = stringify(json, {
    objectId: "u1",
    projections: [
      exceptPaths(blocked, base),
      exceptPaths(blocked, meta),
    ],
  });

  // Allowed
  if (!out.includes(`app.user_name("u1", "Alice").`)) {
    throw new Error("expected user_name KV fact");
  }
  if (!out.includes(`attr("u1", "ci.email", "a@b").`)) {
    throw new Error("expected attr for ci.email");
  }

  // Blocked: no KV or attr or attribute_type for these keys
  for (
    const bad of [
      `app.password("u1",`,
      `attr("u1", "password",`,
      `attribute_type("password",`,
      `app.ci_ssn("u1",`,
      `attr("u1", "ci.ssn",`,
      `attribute_type("ci.ssn",`,
    ]
  ) {
    if (out.some((l) => l.startsWith(bad))) {
      throw new Error("blocked PII leaked: " + bad);
    }
  }
});

Deno.test("end-to-end: relations keep direct and drop inverse via filterEmits", () => {
  const json = { managerId: "u1" };

  const rels = pack.relationsWithInverse({
    map: { "managerId": "has_manager" },
    inverse: { has_manager: "manages" },
  });

  const relsNoInverse = filterEmits((pred) => pred !== "manages", rels);

  const out = stringify(json, {
    objectId: "u9",
    projections: [relsNoInverse],
  });

  if (!out.includes(`has_manager("u9", "u1").`)) {
    throw new Error("missing direct relation has_manager");
  }
  if (out.some((l) => l.startsWith(`manages("u1", "u9")`))) {
    throw new Error("inverse manages should have been suppressed");
  }
});

Deno.test("E2E: function info + evaluated results (kv) mixed with KV pack", () => {
  const json = {
    id: "u1",
    metrics: {
      score: () => 99,
      tags: () => ["alpha", "beta"],
    },
  };

  const projections = compose(
    // Regular KV will ignore functions (no facts)
    kvPredicateProjection({ prefix: "app.", snakeCase: true }),
    // Describe functions without running
    functionInfoProjection("fn_info"),
    // Evaluate only the functions we whitelist, emit KV-style facts
    evaluateFunctionsProjection({
      allow: ["metrics.score", "metrics.tags"],
      mode: "kv",
      prefix: "app.",
      snakeCase: true,
      errorPred: "fn_error",
    }),
  );

  const out = stringify(json, { objectId: "u1", projections: [projections] });

  // fn_info present
  if (!out.includes(`fn_info("u1", "metrics.score", "score", 0).`)) {
    throw new Error("missing fn_info for score");
  }
  if (!out.includes(`fn_info("u1", "metrics.tags", "tags", 0).`)) {
    throw new Error("missing fn_info for tags");
  }

  // Evaluated results in KV form
  const expects = [
    `app.metrics_score("u1", 99).`,
    `app.metrics_tags("u1", 0, "alpha").`,
    `app.metrics_tags("u1", 1, "beta").`,
  ];
  for (const e of expects) {
    if (!out.includes(e)) {
      throw new Error(`expected: ${e}\nGot:\n${out.join("\n")}`);
    }
  }
});

Deno.test("E2E: evaluateFunctionsProjection does not evaluate non-whitelisted functions", () => {
  const json = { utils: { now: () => Date.now() } };

  const projections = compose(
    functionInfoProjection("fn_info"),
    evaluateFunctionsProjection({
      allow: [], // nothing allowed
      mode: "attr",
      errorPred: "fn_error",
    }),
  );

  const out = stringify(json, { objectId: "sys", projections: [projections] });

  // We only get fn_info; no attr, no errors
  if (!out.includes(`fn_info("sys", "utils.now", "now", 0).`)) {
    throw new Error("expected fn_info for utils.now");
  }
  if (out.some((l) => l.startsWith(`attr("sys", "utils.now"`))) {
    throw new Error("did not expect attr fact");
  }
  if (out.some((l) => l.startsWith(`fn_error("sys",`))) {
    throw new Error("did not expect fn_error");
  }
});
