import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import * as schema from "./schema";
import { DRAFT_SOURCE, placeSeeds } from "@/data/places";
import { routeSeeds } from "@/data/routes";
import { permitSeeds, PERMIT_SOURCE } from "@/data/permits";
import { closureSeeds, kbSeeds } from "@/data/knowledge";

// Table creation and knowledge-base loading, shared by the app (local PGlite,
// on every start) and scripts/db-setup.ts (hosted Postgres, run by hand).
// No "server-only" import here so the script can run outside Next.js.

export type Db = PgDatabase<PgQueryResultHKT, typeof schema>;

export const TABLES = ["places", "routes", "permits", "closures", "kb_docs", "trips", "reports"];

export const DDL = `
CREATE TABLE IF NOT EXISTS places (
  id text PRIMARY KEY, name text NOT NULL, region text NOT NULL, kind text NOT NULL,
  altitude_m integer NOT NULL, lat double precision NOT NULL, lng double precision NOT NULL,
  best_months integer[] NOT NULL, tags text[] NOT NULL, permit_id text,
  can_overnight integer NOT NULL DEFAULT 0, stay_per_night integer, highlights text NOT NULL,
  source_url text NOT NULL, verified_at timestamp
);
CREATE TABLE IF NOT EXISTS routes (
  id serial PRIMARY KEY, from_place text NOT NULL, to_place text NOT NULL,
  drive_minutes integer NOT NULL, notes text, source_url text NOT NULL, verified_at timestamp
);
CREATE TABLE IF NOT EXISTS permits (
  id text PRIMARY KEY, name text NOT NULL, indian_rule text NOT NULL,
  foreigner_allowed text NOT NULL, foreigner_rule text NOT NULL, how_to_apply text NOT NULL,
  approx_fee_inr integer, source_url text NOT NULL, verified_at timestamp
);
CREATE TABLE IF NOT EXISTS closures (
  id serial PRIMARY KEY, place_id text NOT NULL, months integer[] NOT NULL,
  severity text NOT NULL, reason text NOT NULL, source_url text NOT NULL, verified_at timestamp
);
CREATE TABLE IF NOT EXISTS kb_docs (
  id text PRIMARY KEY, title text NOT NULL, topic text NOT NULL, body text NOT NULL,
  source_url text NOT NULL, verified_at timestamp
);
CREATE TABLE IF NOT EXISTS trips (
  slug text PRIMARY KEY, inputs jsonb NOT NULL, itinerary jsonb NOT NULL,
  created_at timestamp NOT NULL DEFAULT now(), updated_at timestamp NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS reports (
  id serial PRIMARY KEY, trip_slug text, subject text NOT NULL, message text NOT NULL,
  status text NOT NULL DEFAULT 'open', created_at timestamp NOT NULL DEFAULT now()
);
`;

// Supabase exposes the public schema through its REST API to anyone with the
// project's anon key. Row level security with no policies closes that door;
// the app connects as the database owner, which is not affected.
export const LOCK_DOWN = TABLES.map((t) => `ALTER TABLE ${t} ENABLE ROW LEVEL SECURITY;`).join("\n");

// The knowledge base lives in src/data for now, so loading replaces it whole.
// Trips and reports are user data and are never touched here.
export async function seedKnowledge(db: Db) {
  await db.transaction(async (tx) => {
    await tx.delete(schema.places);
    await tx.delete(schema.routes);
    await tx.delete(schema.permits);
    await tx.delete(schema.closures);
    await tx.delete(schema.kbDocs);

    await tx.insert(schema.places).values(
      placeSeeds.map((p) => ({
        ...p,
        permitId: p.permitId ?? null,
        canOvernight: p.canOvernight ? 1 : 0,
        stayPerNight: p.stayPerNight ?? null,
        sourceUrl: DRAFT_SOURCE,
      })),
    );
    await tx.insert(schema.routes).values(
      routeSeeds.map(([fromPlace, toPlace, driveMinutes, notes]) => ({
        fromPlace,
        toPlace,
        driveMinutes,
        notes: notes ?? null,
        sourceUrl: DRAFT_SOURCE,
      })),
    );
    await tx.insert(schema.permits).values(
      permitSeeds.map((p) => ({ ...p, approxFeeInr: p.approxFeeInr ?? null, sourceUrl: PERMIT_SOURCE })),
    );
    await tx.insert(schema.closures).values(closureSeeds.map((c) => ({ ...c, sourceUrl: DRAFT_SOURCE })));
    await tx.insert(schema.kbDocs).values(kbSeeds.map((k) => ({ ...k, sourceUrl: DRAFT_SOURCE })));
  });
}
