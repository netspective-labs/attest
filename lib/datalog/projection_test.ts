// projection_test.ts
import { assert, assertArrayIncludes } from "jsr:@std/assert@^1.0.14";
import type { Fact, ProjectionApi } from "./core.ts";
import {
  answeredProjection,
  attributeTypeProjection,
  attrProjection,
  booleanUnaryProjection,
  compose,
  entityTypeUnaryProjection,
  evaluateFunctionsProjection,
  exceptPaths,
  filterEmits,
  flagProjection,
  functionInfoProjection,
  kvPredicateProjection,
  provenanceProjection,
  relationMappingProjection,
  statusItemProjection,
} from "./projection.ts";

/** Minimal mock API to unit test plugins without the engine. */
function makeMockApi(subject?: string | number, initialPath: string[] = []) {
  const facts: Fact[] = [];
  const raws: string[] = [];
  let path = [...initialPath];
  const api: ProjectionApi = {
    subject,
    get path() {
      return path;
    },
    join(sep = ".") {
      return path.join(sep);
    },
    emit(pred, ...args) {
      facts.push({ pred, args, meta: { path } });
    },
    emitRaw(line) {
      const s = line.trim();
      raws.push(s.endsWith(".") ? s : s + ".");
    },
    facts() {
      return facts.slice();
    },
  };
  return {
    api,
    setPath: (p: string[]) => {
      path = [...p];
    },
    facts,
    raws,
  };
}

const printer = (f: Fact) =>
  `${f.pred}(${
    f.args.map((a) => typeof a === "string" ? JSON.stringify(a) : String(a))
      .join(", ")
  }).`;

Deno.test("kvPredicateProjection emits predicates for primitive and array-item", () => {
  const { api, setPath, facts } = makeMockApi("S");
  const kv = kvPredicateProjection({ prefix: "p.", snakeCase: true });

  // primitive at a.bName
  setPath(["a", "bName"]);
  kv.onValue({ kind: "primitive", value: "X" }, api);

  // array-item at roles.0
  setPath(["roles", "0"]);
  kv.onValue({ kind: "array-item", value: "admin", index: 0 }, api);

  const lines = facts.map(printer).sort();
  assertArrayIncludes(lines, [
    `p.a_b_name("S", "X").`,
    `p.roles("S", 0, "admin").`,
  ]);
});

Deno.test("attr / flag projections", () => {
  const { api, setPath, facts } = makeMockApi("U1");
  const attr = attrProjection("attr");
  const flag = flagProjection("flag", "yesNo", ["yes", "true"]);

  setPath(["profile", "city"]);
  attr.onValue({ kind: "primitive", value: "Seattle" }, api);

  setPath(["sc", "hasDiagram"]);
  flag.onValue({ kind: "primitive", value: "yes" }, api);

  const lines = facts.map(printer).sort();
  assertArrayIncludes(lines, [
    `attr("U1", "profile.city", "Seattle").`,
    `flag("U1", "sc.hasDiagram").`,
  ]);
});

Deno.test("statusItemProjection<TStatus> normalizes and types status", () => {
  const { api, setPath, facts } = makeMockApi("U");
  const syn = {
    fully: ["fully", "complete"],
    partially: ["partial"],
    not: ["not", "none"],
  } as const;
  const st = statusItemProjection(["pp.implementationStatus"], syn);

  setPath(["pp", "implementationStatus"]);
  st.onValue({ kind: "primitive", value: "Fully implemented" }, api);

  const lines = facts.map(printer);
  assert(lines.includes(`status_item("U", "pp", "fully").`));
});

Deno.test("answeredProjection emits coverage and values", () => {
  const { api, setPath, facts } = makeMockApi("U");
  const ans = answeredProjection(["pf.training"]);

  setPath(["pf", "training"]);
  ans.onValue({ kind: "array", value: ["101", "advanced"] }, api);

  const lines = facts.map(printer).sort();
  assertArrayIncludes(lines, [
    `answered("U", "pf.training").`,
    `answered_value("U", "pf.training", "101").`,
    `answered_value("U", "pf.training", "advanced").`,
  ]);
});

Deno.test("entityTypeUnaryProjection emits unary on init", () => {
  const { api, facts } = makeMockApi("U");
  const ent = entityTypeUnaryProjection("user");
  ent.onInit?.(api);
  assert(facts.map(printer).includes(`user("U").`));
});

Deno.test("relationMappingProjection emits mapping and inverse", () => {
  const { api, setPath, facts } = makeMockApi("E");
  const rel = relationMappingProjection({
    map: { "managerId": "has_manager" },
    inverse: { "has_manager": "manages" },
  });

  setPath(["managerId"]);
  rel.onValue({ kind: "primitive", value: "M" }, api);

  const lines = facts.map(printer).sort();
  assertArrayIncludes(lines, [
    `has_manager("E", "M").`,
    `manages("M", "E").`,
  ]);
});

Deno.test("attributeTypeProjection collects and emits per path types", () => {
  const { api, setPath, facts } = makeMockApi("S");
  const at = attributeTypeProjection();

  setPath(["ci", "email"]);
  at.onValue({ kind: "primitive", value: "x@y" }, api);
  setPath(["ci", "age"]);
  at.onValue({ kind: "primitive", value: 42 }, api);
  at.onAfterAll?.(api);

  const lines = facts.map(printer).sort();
  assertArrayIncludes(lines, [
    `attribute_type("ci.email", "string").`,
    `attribute_type("ci.age", "number").`,
  ]);
});

Deno.test("provenanceProjection inspects facts and emits meta", () => {
  const { api, facts } = makeMockApi("S");
  // seed some facts
  api.emit("p", "S", "X");

  const prov = provenanceProjection({
    sourceId: "src-1",
    txTimeIso: "2024-01-01T00:00:00Z",
    hashPred: "h",
  });
  prov.onAfterAll?.(api);

  const lines = facts.map(printer).sort();
  // Expect at least source, fact_source and h(hash)
  assert(lines.some((l) => l.startsWith(`source("src-1")`)));
  assert(lines.some((l) => l.startsWith(`fact_source(`)));
  assert(lines.some((l) => l.startsWith(`tx_time(`)));
  assert(lines.some((l) => l.startsWith(`h("0x`))); // hash exposer
});

Deno.test("booleanUnaryProjection emits helper on true", () => {
  const { api, setPath, facts } = makeMockApi("U");
  const b = booleanUnaryProjection();

  setPath(["isActive"]);
  b.onValue({ kind: "primitive", value: true }, api);

  const lines = facts.map(printer);
  assert(lines.includes(`active("U").`));
});

Deno.test("compose orchestrates multiple plugins", () => {
  const { api, setPath, facts } = makeMockApi("S");
  const c = compose(attrProjection("a1"), flagProjection("f1", "presence"));
  setPath(["k"]);
  c.onValue({ kind: "primitive", value: "v" }, api);
  const lines = facts.map(printer).sort();
  assertArrayIncludes(lines, [
    `a1("S", "k", "v").`,
    `f1("S", "k").`,
  ]);
});

Deno.test("exceptPaths blocks inner plugin for blocked paths/subtrees", () => {
  const { api, setPath, facts } = makeMockApi("S");
  // Block "pii" subtree and exact "password"
  const safeAttr = exceptPaths(["pii", "password"], attrProjection("attr"));

  // Blocked exact
  setPath(["password"]);
  safeAttr.onValue({ kind: "primitive", value: "secret" }, api);

  // Blocked subtree
  setPath(["pii", "ssn"]);
  safeAttr.onValue({ kind: "primitive", value: "123-45-6789" }, api);

  // Allowed
  setPath(["profile", "city"]);
  safeAttr.onValue({ kind: "primitive", value: "Seattle" }, api);

  const lines = facts.map(printer).sort();
  // Only the allowed one should be present
  if (
    lines.length !== 1 ||
    lines[0] !== `attr("S", "profile.city", "Seattle").`
  ) {
    throw new Error(
      "exceptPaths did not block correctly:\n" + lines.join("\n"),
    );
  }
});

Deno.test("filterEmits drops selected emitted facts (by predicate)", () => {
  const { api, setPath, facts } = makeMockApi("E");

  // relationMapping emits has_manager & manages; drop the inverse manages
  const rel = relationMappingProjection({
    map: { "managerId": "has_manager" },
    inverse: { has_manager: "manages" },
  });
  const relNoInverse = filterEmits((pred) => pred !== "manages", rel);

  setPath(["managerId"]);
  relNoInverse.onValue({ kind: "primitive", value: "M" }, api);

  const lines = facts.map(printer).sort();
  if (
    !lines.includes(`has_manager("E", "M").`) ||
    lines.some((l) => l.startsWith(`manages("M", "E")`))
  ) {
    throw new Error(
      "filterEmits did not suppress inverse 'manages':\n" +
        lines.join("\n"),
    );
  }
});

Deno.test("filterEmits can drop a specific KV predicate (e.g., app.id/2)", () => {
  const { api, setPath, facts } = makeMockApi("S");
  const kv = kvPredicateProjection({ prefix: "app.", snakeCase: true });

  const kvNoId = filterEmits(
    (pred) => pred !== "app.id", // drop base 'id' only
    kv,
  );

  setPath(["id"]);
  kvNoId.onValue({ kind: "primitive", value: "S" }, api);

  if (facts.length !== 0) {
    throw new Error("expected no facts after dropping app.id");
  }
});

Deno.test("functionInfoProjection emits fn_info without executing", () => {
  const { api, setPath, facts } = makeMockApi("U");
  const fnInfo = functionInfoProjection("fn_info");

  function calcScore() {
    return 99;
  }
  setPath(["metrics", "score"]);
  fnInfo.onValue({ kind: "function", value: calcScore }, api);

  const s = facts.map(printer).sort();
  if (!s.includes(`fn_info("U", "metrics.score", "calcScore", 0).`)) {
    throw new Error("expected fn_info fact");
  }
});

Deno.test("evaluateFunctionsProjection: attr mode on whitelisted function", () => {
  const { api, setPath, facts } = makeMockApi("U");
  const evalFns = evaluateFunctionsProjection({
    allow: ["profile.computeAge"],
    mode: "attr",
    errorPred: "fn_error",
  });

  setPath(["profile", "computeAge"]);
  evalFns.onValue({ kind: "function", value: () => 42 }, api);

  const s = facts.map(printer).sort();
  if (!s.includes(`attr("U", "profile.computeAge", "42").`)) {
    throw new Error("expected attr fact from computed value");
  }
});

Deno.test("evaluateFunctionsProjection: kv mode with prefix + array result", () => {
  const { api, setPath, facts } = makeMockApi("S");
  const evalFns = evaluateFunctionsProjection({
    allow: ["tags.loader"],
    mode: "kv",
    prefix: "app.",
    snakeCase: true,
  });

  setPath(["tags", "loader"]);
  evalFns.onValue({ kind: "function", value: () => ["a", "b"] }, api);

  const s = facts.map(printer).sort();
  if (
    !s.includes(`app.tags_loader("S", 0, "a").`) ||
    !s.includes(`app.tags_loader("S", 1, "b").`)
  ) {
    throw new Error("expected kv facts for array result");
  }
});

Deno.test("evaluateFunctionsProjection: error path emits fn_error", () => {
  const { api, setPath, facts } = makeMockApi("S");
  const evalFns = evaluateFunctionsProjection({
    allow: ["broken.fn"],
    mode: "attr",
    errorPred: "fn_error",
  });

  setPath(["broken", "fn"]);
  evalFns.onValue({
    kind: "function",
    value: () => {
      throw new Error("boom");
    },
  }, api);

  const s = facts.map(printer).join("\n");
  if (!s.includes(`fn_error("S", "broken.fn", "Error: boom").`)) {
    throw new Error("expected fn_error fact");
  }
});
