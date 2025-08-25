/**
 * core.ts
 * The tiny, deterministic, functional “engine”.
 * - Walks a JSON value.
 * - Invokes user-supplied projections (plugins).
 * - Collects facts and returns them as sorted, de-duplicated strings.
 *
 * No I/O, no globals, no side effects beyond returning a value.
 */

/** A printed fact is `pred(arg1, arg2, ...).` */
export type Fact = {
  readonly pred: string;
  readonly args: ReadonlyArray<string | number | boolean>;
  readonly meta?: { readonly path?: ReadonlyArray<string> };
};

/** Node kinds you can see during traversal. */
export type NodeKind =
  | "primitive" // string | number | boolean
  | "nullish" // null | undefined
  | "function"
  | "object"
  | "array"
  | "array-item"; // a primitive array element (index provided in NodeContext)

/** Context provided to plugins for each visited value. */
export type NodeContext = Readonly<{
  kind: NodeKind;
  value: unknown;
  key?: string;
  index?: number;
}>;

/** Minimal API surface that plugins can use to emit facts. */
export interface ProjectionApi {
  /** Subject identifier (usually your objectId). */
  readonly subject?: string | number;
  /** Current path segments from the root (immutable view). */
  readonly path: ReadonlyArray<string>;
  /** Join current path into a string for convenience. */
  join(sep?: string): string;
  /** Emit a typed fact (recommended). */
  emit(pred: string, ...args: Fact["args"]): void;
  /** Emit a raw, ready-to-print fact line (ends with '.' automatically if missing). */
  emitRaw(line: string): void;
  /** Inspect currently emitted typed facts (snapshot copy). */
  facts(): ReadonlyArray<Fact>;
}

/** Projection plugin lifecycle. Keep these pure and composable. */
export interface ProjectionPlugin {
  readonly name: string;
  onInit?(api: ProjectionApi): void;
  onValue(ctx: NodeContext, api: ProjectionApi): void;
  onAfterAll?(api: ProjectionApi): void;
}

/** Options for stringify. */
export type StringifyOptions = Readonly<{
  objectId?: string | number;
  projections:
    | ReadonlyArray<ProjectionPlugin>
    | ((ctx: NodeContext, api: ProjectionApi) => void); // inline one-off
  sort?: boolean; // default: true
  dedupe?: boolean; // default: true
}>;

/** Stable printer: JSON.stringify for strings; others via String(). */
function printFact(f: Fact): string {
  const args = f.args.map((a) =>
    typeof a === "string" ? JSON.stringify(a) : String(a)
  ).join(", ");
  return `${f.pred}(${args}).`;
}

/**
 * stringify
 * Walks `src`, invokes projections, and returns printed fact lines.
 */
export function stringify(src: unknown, opts: StringifyOptions): string[] {
  const subject = opts.objectId;
  const wantSort = opts.sort ?? true;
  const wantDedupe = opts.dedupe ?? true;

  // Internal immutable accumulators
  const facts: Fact[] = [];
  const raws: string[] = [];

  // currentPath captured by getter to keep API immutable
  let currentPath: ReadonlyArray<string> = [];

  const api: ProjectionApi = {
    subject,
    get path() {
      return currentPath;
    },
    join(sep = ".") {
      return currentPath.join(sep);
    },
    emit(pred, ...args) {
      facts.push({ pred, args, meta: { path: currentPath } });
    },
    emitRaw(line) {
      const s = line.trim();
      raws.push(s.endsWith(".") ? s : `${s}.`);
    },
    facts() {
      // return a snapshot (shallow copy) to avoid external mutation
      return facts.slice();
    },
  };

  const plugins: ReadonlyArray<ProjectionPlugin> =
    typeof opts.projections === "function"
      ? [{ name: "inline", onValue: opts.projections }]
      : opts.projections;

  // Lifecycle: onInit
  for (const p of plugins) p.onInit?.(api);

  // Pure recursive visit (does not mutate src)
  const visit = (
    value: unknown,
    path: ReadonlyArray<string>,
    key?: string,
  ): void => {
    currentPath = path;

    if (value === null || value === undefined) {
      for (const p of plugins) {
        p.onValue({ kind: "nullish", value, key }, api);
      }
      return;
    }

    if (Array.isArray(value)) {
      for (const p of plugins) {
        p.onValue({ kind: "array", value, key }, api);
      }
      // visit items
      for (let i = 0; i < value.length; i++) {
        const item = value[i];
        const itemPath = [...path, String(i)];
        currentPath = itemPath;

        const itemKind: NodeKind = item === null || item === undefined
          ? "nullish"
          : Array.isArray(item)
          ? "array"
          : typeof item === "object"
          ? "object"
          : typeof item === "function"
          ? "function"
          : "array-item";

        for (const p of plugins) {
          p.onValue({ kind: itemKind, value: item, index: i }, api);
        }

        if (itemKind === "array" || itemKind === "object") {
          visit(item, itemPath);
        }
      }
      currentPath = path;
      return;
    }

    if (typeof value === "object") {
      for (const p of plugins) {
        p.onValue({ kind: "object", value, key }, api);
      }
      const obj = value as Record<string, unknown>;
      for (const k of Object.keys(obj)) {
        const nextPath = [...path, k];
        visit(obj[k], nextPath, k);
      }
      return;
    }

    if (typeof value === "function") {
      for (const p of plugins) {
        p.onValue({ kind: "function", value, key }, api);
      }
      return;
    }

    // primitive (string | number | boolean)
    for (const p of plugins) {
      p.onValue({ kind: "primitive", value, key }, api);
    }
  };

  // Traverse root
  visit(src, []);

  // Lifecycle: onAfterAll
  for (const p of plugins) p.onAfterAll?.(api);

  // Finalize: print typed + merge raw, then sort & dedupe
  let out = [...facts.map(printFact), ...raws];
  if (wantSort) out = out.sort((a, b) => a.localeCompare(b));
  if (wantDedupe) {
    const seen = new Set<string>();
    out = out.filter((s) => (seen.has(s) ? false : (seen.add(s), true)));
  }
  return out;
}
