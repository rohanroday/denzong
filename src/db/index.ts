import "server-only";
import { mkdirSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";
import { drizzle as drizzlePglite } from "drizzle-orm/pglite";
import { drizzle as drizzlePostgres } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { DDL, seedKnowledge, type Db } from "./setup";

// With DATABASE_URL set (Supabase, or any hosted Postgres) the app connects
// there; tables and data are set up once with `npm run db:setup`.
// Without it, local development uses PGlite: real Postgres running in-process,
// stored in .data/pglite, created and loaded on every start.

async function init(): Promise<Db> {
  const url = process.env.DATABASE_URL;
  if (url) {
    // prepare: false is required by Supabase's transaction pooler (port 6543).
    const client = postgres(url, { prepare: false, max: 5 });
    return drizzlePostgres({ client, schema });
  }

  const dir = process.env.PGLITE_DIR ?? ".data/pglite";
  mkdirSync(dir, { recursive: true });
  const client = new PGlite(dir);
  await client.exec(DDL);
  const db = drizzlePglite({ client, schema });
  await seedKnowledge(db);
  return db;
}

// One instance per server process, surviving dev hot reloads.
const g = globalThis as unknown as { __denzongDb?: Promise<Db> };

export function getDb(): Promise<Db> {
  g.__denzongDb ??= init().catch((error) => {
    g.__denzongDb = undefined; // let the next request try again
    throw error;
  });
  return g.__denzongDb;
}

export { schema };
