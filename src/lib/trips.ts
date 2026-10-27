import "server-only";
import { eq, sql } from "drizzle-orm";
import { customAlphabet } from "nanoid";
import { getDb, schema } from "@/db";
import type { Itinerary } from "./types";

// Short, unambiguous share codes: denzong.app/t/k7m2qx9a
const newSlug = customAlphabet("23456789abcdefghjkmnpqrstuvwxyz", 8);

export async function saveTrip(itinerary: Itinerary, slug?: string) {
  const db = await getDb();
  if (slug) {
    const updated = await db
      .update(schema.trips)
      .set({ itinerary, inputs: itinerary.inputs, updatedAt: sql`now()` })
      .where(eq(schema.trips.slug, slug))
      .returning({ slug: schema.trips.slug });
    if (updated.length) return slug;
  }
  const created = newSlug();
  await db.insert(schema.trips).values({ slug: created, inputs: itinerary.inputs, itinerary });
  return created;
}

export async function getTrip(slug: string) {
  const db = await getDb();
  const [row] = await db.select().from(schema.trips).where(eq(schema.trips.slug, slug));
  return row ? { ...row, itinerary: row.itinerary as Itinerary } : null;
}
