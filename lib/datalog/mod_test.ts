import { assertEquals, assertThrows } from "jsr:@std/assert@^1.0.7";
import { createRegistry, DataLogFacts } from "./mod.ts";

Deno.test("entity + attrs + deterministic output", () => {
    const src = {
        userId: 123,
        userName: "Alice",
        isActive: true,
        profile: { city: "São Paulo" },
        roles: ["admin", "editor"],
    };

    const out = DataLogFacts.stringify(src, {
        entityType: "user",
        objectId: "u1",
        camelToSnakeCase: true,
        keySeparator: ".",
        prefix: "app.",
        includeTypes: true,
        normalizeLowerCase: true,
        normalizeAscii: true,
        booleanUnaryHelper: true,
        schemaNs: "app.v1",
    });

    // Spot-check a few representative facts (not full equality to keep test robust).
    const has = (needle: string) => out.some((l) => l === needle);

    assertEquals(has(`schema_ns("app.v1").`), true);
    assertEquals(has(`user("u1").`), true);
    assertEquals(has(`app.user_id("u1", 123).`), true);
    assertEquals(has(`attribute_type("user_id", "number").`), true);
    assertEquals(has(`app.is_active("u1", true).`), true);
    // boolean unary:
    // heuristic drops "is_" -> "active"
    assertEquals(has(`app_active("u1").`), true);

    // nested keys with dots + normalization variants
    assertEquals(has(`app.profile.city("u1", "São Paulo").`), true);
    assertEquals(has(`app.profile.city_lc("u1", "são paulo").`), true);
    assertEquals(has(`app.profile.city_ascii("u1", "SaoPaulo").`), true);

    // arrays
    assertEquals(has(`app.roles("u1", 0, "admin").`), true);
    assertEquals(has(`app.roles("u1", 1, "editor").`), true);
});

Deno.test("relation mapping + inverse + arity registry strictness", async () => {
    const src = { managerId: "m9" };

    const registry = createRegistry({
        user: 1,
        has_manager: 2,
        manages: 2,
    });

    const ok = DataLogFacts.stringify(src, {
        objectId: "u1",
        entityType: "user",
        relationKeys: { managerId: "has_manager" },
        relationInverse: { has_manager: "manages" },
        registry,
        strictArity: true,
    });

    const has = (s: string) => ok.includes(s);
    assertEquals(has(`user("u1").`), true);
    assertEquals(has(`has_manager("u1", "m9").`), true);
    assertEquals(has(`manages("m9", "u1").`), true);

    // Arity error example
    await assertThrows(
        () =>
            Promise.resolve(
                DataLogFacts.stringify(
                    { bad: 1 },
                    {
                        // objectId intentionally omitted to trigger the friendly error
                        relationKeys: { bad: "has_manager" },
                        registry,
                        strictArity: true,
                    },
                ),
            ),
        Error,
        "Relational predicate 'has_manager' requires an objectId to supply the subject; expected arity 2, but only the object value is available.",
    );
});

Deno.test("exclude + required -> missing_attr", () => {
    const src = { id: 1, email: "x@y", phone: undefined, password: "secret" };
    const out = DataLogFacts.stringify(src, {
        objectId: "u1",
        exclude: ["password"],
        required: ["phone", "profile.address"],
        includeProvenance: true,
        sourceId: "fixture-A",
    });

    // excluded
    const has = (s: string) => out.includes(s);
    assertEquals(false, has(`password("u1", "secret").`));

    // missing_attr for undefined + required not present
    assertEquals(true, out.some((l) => l.startsWith("missing_attr(")));
    // source & fact_source should appear at least once
    assertEquals(true, out.some((l) => l.startsWith("source(")));
    assertEquals(true, out.some((l) => l.startsWith("fact_source(")));
});

Deno.test("enum allowed + cardinality meta", () => {
    const out = DataLogFacts.stringify({ status: "invited" }, {
        enumAllowed: { status: ["invited", "active", "suspended"] as const },
        cardinality: { email: "one", roles: "many" },
    });
    const has = (s: string) => out.includes(s);
    assertEquals(has(`attribute_allowed("status", "invited").`), true);
    assertEquals(has(`attribute_allowed("status", "active").`), true);
    assertEquals(has(`attribute_allowed("status", "suspended").`), true);
    assertEquals(has(`cardinality("email", "one").`), true);
    assertEquals(has(`cardinality("roles", "many").`), true);
});
