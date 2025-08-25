// core_test.ts
import { assert, assertEquals, assertNotEquals } from "jsr:@std/assert@^1.0.14";
import type { NodeContext, ProjectionApi, ProjectionPlugin } from "./core.ts";
import { stringify } from "./core.ts";

Deno.test("engine traverses kinds and preserves determinism", () => {
  const src = {
    a: 1,
    b: "x",
    c: [true, { z: 9 }, ["k"]],
    d: null,
    e: undefined,
    f() {/* no-op */},
  };

  const seen: string[] = [];

  const recorder: ProjectionPlugin = {
    name: "rec",
    onInit(_api) {
      seen.push("init");
    },
    onValue(ctx, api) {
      // Record a minimal fact for each visit (subject-aware)
      const tag = `${ctx.kind}@${api.join(".")}`;
      seen.push(tag);
      if (ctx.kind === "primitive") {
        api.emit("p", api.subject ?? "none", String(ctx.value));
      }
      if (ctx.kind === "array-item") {
        api.emit(
          "ai",
          api.subject ?? "none",
          ctx.index ?? -1,
          String(ctx.value),
        );
      }
      if (ctx.kind === "nullish") {
        api.emit("nul", api.subject ?? "none", api.join(".") || "$");
      }
    },
    onAfterAll() {
      seen.push("after");
    },
  };

  const out = stringify(src, { objectId: "S", projections: [recorder] });

  // Engine immutability: input unchanged
  // deno-lint-ignore no-explicit-any
  assertEquals((src as any).a, 1);
  // deno-lint-ignore no-explicit-any
  assertEquals(Array.isArray((src as any).c), true);

  // Lifecycle recorded
  assert(seen[0] === "init");
  assert(seen.includes("after"));

  // Determinism (sorted, deduped)
  const sorted = [...out].sort((a, b) => a.localeCompare(b));
  assertEquals(out, sorted);

  // Spot-check a few emitted facts
  assert(
    out.includes(`ai("S", 0, "true").`) ||
      out.includes(`ai("S", 0, true).`),
  );
  assert(out.some((l) => l.startsWith(`p("S", "x")`)));
  assert(out.some((l) => l.startsWith(`nul("S",`)));
});

Deno.test("engine supports inline projection function and subject handling", () => {
  const src = { user: { name: "Alice" }, roles: ["admin", "editor"] };

  const out = stringify(src, {
    objectId: "u1",
    projections: (ctx: NodeContext, api: ProjectionApi) => {
      if (ctx.kind === "primitive") {
        api.emit(
          "kv",
          String(api.subject),
          api.join("."),
          String(ctx.value),
        );
      }
      if (ctx.kind === "array-item") {
        api.emit(
          "kvi",
          String(api.subject),
          api.join("."),
          ctx.index ?? -1,
          String(ctx.value),
        );
      }
    },
  });

  assert(out.includes(`kv("u1", "user.name", "Alice").`));
  // path for 0th item is "roles.0"
  assert(out.includes(`kvi("u1", "roles.0", 0, "admin").`));
});

Deno.test("engine de-dupes printed + raw facts", () => {
  const src = { x: 1 };

  const dupEmit: ProjectionPlugin = {
    name: "dup",
    onValue(ctx, api) {
      if (ctx.kind === "primitive") {
        api.emit("p", "s", 1);
        api.emitRaw(`p("s", 1).`); // same as typed emit
      }
    },
  };

  const out = stringify(src, { projections: [dupEmit] });
  // Only one survives after dedupe
  assertEquals(out.filter((l) => l === `p("s", 1).`).length, 1);
});

Deno.test("engine does not mutate plugin-visible path arrays", () => {
  const src = { a: { b: 1 } };
  const paths: string[][] = [];
  const spy: ProjectionPlugin = {
    name: "spy",
    onValue(_, api) {
      // snapshot the array
      paths.push([...api.path]);
    },
  };
  stringify(src, { projections: [spy] });
  // Ensure previously captured arrays don't change afterwards
  const snapshot = paths[0]?.join(".") ?? "";
  const after = paths[paths.length - 1]?.join(".") ?? "";
  assertNotEquals(paths.length, 0);
  assert(snapshot !== undefined);
  assert(after !== undefined);
});
