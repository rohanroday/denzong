import {
  pgTable,
  text,
  integer,
  doublePrecision,
  jsonb,
  timestamp,
  serial,
} from "drizzle-orm/pg-core";

// Knowledge base tables. Every fact carries a source and a verified date;
// verifiedAt is null until someone has checked the row against its source.

export const places = pgTable("places", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  region: text("region").notNull(), // East | North | West | South | Gateway
  kind: text("kind").notNull(), // town | village | lake | pass | monastery | viewpoint | valley | gateway | park
  altitudeM: integer("altitude_m").notNull(),
  lat: doublePrecision("lat").notNull(),
  lng: doublePrecision("lng").notNull(),
  bestMonths: integer("best_months").array().notNull(),
  tags: text("tags").array().notNull(),
  permitId: text("permit_id"),
  canOvernight: integer("can_overnight").notNull().default(0),
  stayPerNight: integer("stay_per_night"), // typical mid-range room, INR
  highlights: text("highlights").notNull(),
  sourceUrl: text("source_url").notNull(),
  verifiedAt: timestamp("verified_at", { mode: "string" }),
});

export const routes = pgTable("routes", {
  id: serial("id").primaryKey(),
  fromPlace: text("from_place").notNull(),
  toPlace: text("to_place").notNull(),
  driveMinutes: integer("drive_minutes").notNull(),
  notes: text("notes"),
  sourceUrl: text("source_url").notNull(),
  verifiedAt: timestamp("verified_at", { mode: "string" }),
});

export const permits = pgTable("permits", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  indianRule: text("indian_rule").notNull(),
  foreignerAllowed: text("foreigner_allowed").notNull(), // yes | group | no
  foreignerRule: text("foreigner_rule").notNull(),
  howToApply: text("how_to_apply").notNull(),
  approxFeeInr: integer("approx_fee_inr"),
  sourceUrl: text("source_url").notNull(),
  verifiedAt: timestamp("verified_at", { mode: "string" }),
});

export const closures = pgTable("closures", {
  id: serial("id").primaryKey(),
  placeId: text("place_id").notNull(),
  months: integer("months").array().notNull(),
  severity: text("severity").notNull(), // closed | risky
  reason: text("reason").notNull(),
  sourceUrl: text("source_url").notNull(),
  verifiedAt: timestamp("verified_at", { mode: "string" }),
});

export const kbDocs = pgTable("kb_docs", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  topic: text("topic").notNull(),
  body: text("body").notNull(),
  sourceUrl: text("source_url").notNull(),
  verifiedAt: timestamp("verified_at", { mode: "string" }),
});

// App tables.

export const trips = pgTable("trips", {
  slug: text("slug").primaryKey(),
  inputs: jsonb("inputs").notNull(),
  itinerary: jsonb("itinerary").notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
});

export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  tripSlug: text("trip_slug"),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: text("status").notNull().default("open"), // open | fixed | dismissed
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
});

export type Place = typeof places.$inferSelect;
export type Route = typeof routes.$inferSelect;
export type Permit = typeof permits.$inferSelect;
export type Closure = typeof closures.$inferSelect;
export type KbDoc = typeof kbDocs.$inferSelect;
