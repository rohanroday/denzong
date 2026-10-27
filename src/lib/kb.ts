import "server-only";
import { sql } from "drizzle-orm";
import { getDb, schema } from "@/db";
import type { Closure, KbDoc, Permit, Place, Route } from "@/db/schema";
import type { Nationality, PermitInfo, Source } from "./types";

// The knowledge base is small (tens of rows), so tools load it whole and
// work in memory. Revisit when it grows past a few thousand rows.

export type Kb = {
  places: Map<string, Place>;
  routes: Route[];
  permits: Map<string, Permit>;
  closures: Closure[];
};

export async function loadKb(): Promise<Kb> {
  const db = await getDb();
  const [places, routes, permits, closures] = await Promise.all([
    db.select().from(schema.places),
    db.select().from(schema.routes),
    db.select().from(schema.permits),
    db.select().from(schema.closures),
  ]);
  return {
    places: new Map(places.map((p) => [p.id, p])),
    routes,
    permits: new Map(permits.map((p) => [p.id, p])),
    closures,
  };
}

export function sourceOf(row: { sourceUrl: string; verifiedAt: string | null }, label: string): Source {
  return { label, url: row.sourceUrl, verifiedAt: row.verifiedAt };
}

export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Place lookup tolerant of names and loose spellings ("Changu lake" -> tsomgo).
export function resolvePlace(kb: Kb, query: string): Place | undefined {
  const q = query.trim().toLowerCase();
  if (kb.places.has(q)) return kb.places.get(q);
  const slug = q.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  if (kb.places.has(slug)) return kb.places.get(slug);
  const all = [...kb.places.values()];
  return (
    all.find((p) => p.name.toLowerCase() === q) ??
    all.find((p) => p.name.toLowerCase().includes(q) || q.includes(p.id.replace(/-/g, " ")))
  );
}

// Shortest drive between two places over the route graph (Dijkstra).
export function routeBetween(kb: Kb, from: string, to: string) {
  if (from === to) return { minutes: 0, path: [from], notes: [] as string[], routes: [] as Route[] };

  const edges = new Map<string, { to: string; route: Route }[]>();
  for (const r of kb.routes) {
    for (const [a, b] of [[r.fromPlace, r.toPlace], [r.toPlace, r.fromPlace]]) {
      if (!edges.has(a)) edges.set(a, []);
      edges.get(a)!.push({ to: b, route: r });
    }
  }

  const dist = new Map<string, number>([[from, 0]]);
  const prev = new Map<string, { from: string; route: Route }>();
  const queue = new Set([from]);
  while (queue.size) {
    let current = "";
    let best = Infinity;
    for (const id of queue) {
      const d = dist.get(id)!;
      if (d < best) [current, best] = [id, d];
    }
    queue.delete(current);
    if (current === to) break;
    for (const e of edges.get(current) ?? []) {
      const nd = best + e.route.driveMinutes;
      if (nd < (dist.get(e.to) ?? Infinity)) {
        dist.set(e.to, nd);
        prev.set(e.to, { from: current, route: e.route });
        queue.add(e.to);
      }
    }
  }

  if (!dist.has(to)) return null;
  const path = [to];
  const used: Route[] = [];
  while (path[0] !== from) {
    const step = prev.get(path[0])!;
    used.unshift(step.route);
    path.unshift(step.from);
  }
  return {
    minutes: dist.get(to)!,
    path,
    notes: used.map((r) => r.notes).filter((n): n is string => !!n),
    routes: used,
  };
}

// Monsoon months slow every road down; this is applied on top of dry-season times.
export const MONSOON_MONTHS = [6, 7, 8, 9];
export const MONSOON_FACTOR = 1.3;

export function permitFor(kb: Kb, permitId: string, nationality: Nationality): PermitInfo | null {
  const p = kb.permits.get(permitId);
  if (!p) return null;
  const allowed = nationality === "indian" || p.foreignerAllowed !== "no";
  return {
    id: p.id,
    name: p.name,
    rule: nationality === "indian" ? p.indianRule : p.foreignerRule,
    howToApply: p.howToApply,
    allowed,
    source: sourceOf(p, "Sikkim Tourism"),
  };
}

export function closuresFor(kb: Kb, placeId: string, month: number) {
  return kb.closures.filter((c) => c.placeId === placeId && c.months.includes(month));
}

// Full-text search over guidance docs and permit rules.
// Words are OR-ed so natural questions ("can foreigners visit gurudongmar")
// still match; ts_rank puts the best matches first.
export async function searchKnowledge(query: string, limit = 4) {
  const db = await getDb();
  const words = query.toLowerCase().match(/[a-z]{3,}/g) ?? [];
  if (!words.length) return { docs: [], permits: [] };
  const q = words.join(" or ");
  const docs = await db.execute<KbDoc & { rank: number }>(sql`
    SELECT id, title, topic, body, source_url AS "sourceUrl", verified_at AS "verifiedAt",
      ts_rank(to_tsvector('english', title || ' ' || body), websearch_to_tsquery('english', ${q})) AS rank
    FROM kb_docs
    WHERE to_tsvector('english', title || ' ' || body) @@ websearch_to_tsquery('english', ${q})
    ORDER BY rank DESC
    LIMIT ${limit}
  `);
  const permits = await db.execute<Permit>(sql`
    SELECT id, name, indian_rule AS "indianRule", foreigner_allowed AS "foreignerAllowed",
      foreigner_rule AS "foreignerRule", how_to_apply AS "howToApply", source_url AS "sourceUrl",
      verified_at AS "verifiedAt",
      ts_rank(to_tsvector('english', name || ' ' || indian_rule || ' ' || foreigner_rule), websearch_to_tsquery('english', ${q})) AS rank
    FROM permits
    WHERE to_tsvector('english', name || ' ' || indian_rule || ' ' || foreigner_rule)
      @@ websearch_to_tsquery('english', ${q})
    ORDER BY rank DESC
    LIMIT ${limit}
  `);
  return { docs: docs.rows, permits: permits.rows };
}
