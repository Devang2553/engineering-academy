import type { PgliteDatabase } from "drizzle-orm/pglite";
import * as schema from "./schema";

export type Db = PgliteDatabase<typeof schema>;
const g = globalThis as unknown as { __eaDb?: Promise<Db> };

export const databaseUrl = () => process.env.DATABASE_URL ?? process.env.POSTGRES_URL;

/**
 * Production: Postgres via DATABASE_URL (e.g. Neon on Vercel).
 * Local development with no DATABASE_URL: an embedded Postgres (PGlite) stored in ./.data.
 */
export function getDb(): Promise<Db> {
  g.__eaDb ??= (async () => {
    const url = databaseUrl();
    if (url) {
      const postgres = (await import("postgres")).default;
      const { drizzle } = await import("drizzle-orm/postgres-js");
      return drizzle(postgres(url, { max: 1, prepare: false }), { schema }) as unknown as Db;
    }
    const { PGlite } = await import("@electric-sql/pglite");
    const { drizzle } = await import("drizzle-orm/pglite");
    const { mkdirSync } = await import("node:fs");
    mkdirSync(".data", { recursive: true });
    return drizzle(new PGlite(".data/pg"), { schema });
  })();
  return g.__eaDb;
}
