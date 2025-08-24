// modctl_test.ts
import { assert, assertStringIncludes } from "jsr:@std/assert@^1.0.14";
import $ from "jsr:@david/dax@^0.42.0";

// Compute absolute path to the CLI so relative imports work inside the script.
const scriptPath = new URL("./modctl.ts", import.meta.url).pathname;

function parseLines(out: string): string[] {
    return out.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
}

Deno.test("to-facts: basic entity + attribute", async () => {
    const input = { userName: "Alice" };
    const stdout =
        await $`deno run -A ${scriptPath} to-facts --entity-type user --object-id u1 --camel-to-snake --prefix app.`
            .stdinText(JSON.stringify(input))
            .text();

    const lines = parseLines(stdout);
    assert(lines.includes(`user("u1").`), "should emit unary entity fact");
    assert(
        lines.includes(`app.user_name("u1", "Alice").`),
        "should emit prefixed snake_case attribute fact",
    );
});

Deno.test("to-facts: relation mapping + inverse + strict arity registry", async () => {
    const input = { managerId: "m9" };
    const relationKeys = { managerId: "has_manager" };
    const relationInverse = { has_manager: "manages" };
    const registry = { user: 1, has_manager: 2, manages: 2 };

    const stdout = await $`deno run -A ${scriptPath} to-facts --entity-type user
    --object-id u1
    --relation-keys ${JSON.stringify(relationKeys)}
    --relation-inverse ${JSON.stringify(relationInverse)}
    --registry ${JSON.stringify(registry)}
    --strict-arity`
        .stdinText(JSON.stringify(input))
        .text();

    const lines = parseLines(stdout);
    assert(lines.includes(`user("u1").`), "should include entity unary fact");
    assert(
        lines.includes(`has_manager("u1", "m9").`),
        "should map relationKeys to has_manager/2",
    );
    assert(
        lines.includes(`manages("m9", "u1").`),
        "should emit inverse manages/2",
    );
});

Deno.test("to-facts: object-id-path extraction for arrays", async () => {
    const input = [
        { id: "u1", name: "A" },
        { id: "u2", name: "B" },
    ];

    const stdout = await $`deno run -A ${scriptPath} to-facts
    --entity-type user
    --object-id-path id
    --camel-to-snake`
        .stdinText(JSON.stringify(input))
        .text();

    const lines = parseLines(stdout);
    assert(lines.includes(`user("u1").`));
    assert(lines.includes(`name("u1", "A").`));
    assert(lines.includes(`user("u2").`));
    assert(lines.includes(`name("u2", "B").`));
});

Deno.test("to-facts: includeTypes + exclude", async () => {
    const input = { age: 30, secret: "x" };
    const stdout =
        await $`deno run -A ${scriptPath} to-facts --include-types --exclude secret`
            .stdinText(JSON.stringify(input))
            .text();

    const lines = parseLines(stdout);
    assert(lines.includes(`age(30).`), "should include age fact");
    assert(
        lines.includes(`attribute_type("age", "number").`),
        "should include attribute_type for age",
    );
    assert(
        !lines.some((l) => l.startsWith("secret(")),
        "should not emit excluded key",
    );
});

Deno.test("to-facts: friendly error when relation used without objectId in strict mode", async () => {
    // Will throw inside the CLI; use Dax .noThrow() and capture stderr.
    const input = { bad: 1 };
    const registry = { has_manager: 2 };
    const relationKeys = { bad: "has_manager" };

    const proc = await $`deno run -A ${scriptPath} to-facts
    --relation-keys ${JSON.stringify(relationKeys)}
    --registry ${JSON.stringify(registry)}
    --strict-arity`
        .stdinText(JSON.stringify(input))
        .noThrow()
        .stdout("piped")
        .stderr("piped")
        .spawn();

    // Expect non-zero exit and friendly error text.
    assert(
        proc.code !== 0,
        "CLI should exit with non-zero on strict arity error",
    );
    const stderr = new TextDecoder().decode(proc.stderrBytes);
    assertStringIncludes(
        stderr,
        "Relational predicate 'has_manager' requires an objectId to supply the subject",
    );
});
