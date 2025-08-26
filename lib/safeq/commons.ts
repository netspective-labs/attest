import { zod as z } from "./deps.ts";

/* ──────────────────────────────────────────────────────────────────────────
 * Helpers
 * ────────────────────────────────────────────────────────────────────────── */

export const open = <T extends z.ZodRawShape>(shape: T) =>
    z.object(shape).catchall(z.unknown());

export const strict = <T extends z.ZodRawShape>(shape: T) =>
    z.object(shape).strict();
