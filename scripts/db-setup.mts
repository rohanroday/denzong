// Creates the tables in the database at DATABASE_URL (e.g. Supabase), locks
// them from Supabase's public REST API, and loads the knowledge base from
// src/data. Safe to re-run: tables are kept, the knowledge base is replaced,
// trips and reports are left alone.
//
//   npm run db:setup

import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../src/db/schema";
import { DDL, LOCK_DOWN, seedKnowledge, TABLES } from "../src/db/setup";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set. Add it to .env.local first.");
  process.exit(1);
}

const client = postgres(url, { prepare: false, max: 1, onnotice: () => {} });
const db = drizzle({ client, schema });

try {
  await client.unsafe(DDL);
  console.log("Tables ready:", TABLES.join(", "));
  await client.unsafe(LOCK_DOWN);
  console.log("Row level security on: tables are closed to Supabase's public API");
  await seedKnowledge(db);
  for (const t of TABLES) {
    const [{ n }] = await db.execute<{ n: number }>(sql.raw(`select count(*)::int as n from ${t}`));
    console.log(`  ${t}: ${n} rows`);
  }
  console.log("Done.");
} catch (error) {
  console.error("Setup failed:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  await client.end({ timeout: 5 });
}
