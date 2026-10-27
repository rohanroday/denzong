import "server-only";
import { tool } from "ai";
import { z } from "zod";
import { buildItinerary } from "../itinerary";
import { closuresFor, loadKb, MONTHS, permitFor, resolvePlace, routeBetween, searchKnowledge, sourceOf } from "../kb";
import { saveTrip } from "../trips";
import type { PresentItineraryResult, Source } from "../types";

// Every factual tool returns `sources` so the UI can show where an answer
// came from and when it was last verified, without trusting the model's text.

const month = z.number().int().min(1).max(12).describe("Travel month, 1 = January");
const nationality = z.enum(["indian", "foreign"]);

export function createTools(ctx: { tripSlug?: string }) {
  return {
    findPlaces: tool({
      description:
        "List places in the Sikkim knowledge base with their ids, altitude, region, best months, permit and whether you can stay overnight. Use the returned ids in every other tool.",
      inputSchema: z.object({
        region: z.enum(["East", "North", "West", "South", "Gateway"]).optional(),
        interest: z.string().optional().describe("e.g. snow, monasteries, lakes, villages, views"),
        month: month.optional(),
      }),
      execute: async ({ region, interest, month: m }) => {
        const kb = await loadKb();
        const places = [...kb.places.values()]
          .filter((p) => !region || p.region === region)
          .filter((p) => !interest || p.tags.some((t) => t.includes(interest.toLowerCase())))
          .map((p) => ({
            id: p.id,
            name: p.name,
            region: p.region,
            altitudeM: p.altitudeM,
            tags: p.tags,
            permitId: p.permitId,
            canOvernight: !!p.canOvernight,
            goodInMonth: m ? p.bestMonths.includes(m) : undefined,
            seasonalIssues: m ? closuresFor(kb, p.id, m).map((c) => `${c.severity}: ${c.reason}`) : undefined,
            highlights: p.highlights,
          }));
        return { count: places.length, places };
      },
    }),

    getRouteTime: tool({
      description: "Drive time on real mountain roads between two places, with the route and road notes.",
      inputSchema: z.object({ from: z.string(), to: z.string(), month: month.optional() }),
      execute: async ({ from, to, month: m }) => {
        const kb = await loadKb();
        const a = resolvePlace(kb, from);
        const b = resolvePlace(kb, to);
        if (!a || !b) return { found: false as const, message: `Unknown place: ${!a ? from : to}` };
        const r = routeBetween(kb, a.id, b.id);
        if (!r) return { found: false as const, message: `No known road between ${a.name} and ${b.name}.` };
        const monsoon = m !== undefined && [6, 7, 8, 9].includes(m);
        return {
          found: true as const,
          from: a.name,
          to: b.name,
          dryMinutes: r.minutes,
          monsoonNote: monsoon ? "Monsoon month: allow about 30% longer, and expect landslide delays." : undefined,
          via: r.path.map((id) => kb.places.get(id)!.name),
          notes: r.notes,
          sources: r.routes.map((x) => sourceOf(x, "Drive times")).slice(0, 1),
        };
      },
    }),

    checkPermit: tool({
      description:
        "Permit rules for a place for Indian or foreign travellers, plus seasonal closures if a month is given. Always use this before answering any permit or access question.",
      inputSchema: z.object({ place: z.string(), nationality, month: month.optional() }),
      execute: async ({ place, nationality: nat, month: m }) => {
        const kb = await loadKb();
        const p = resolvePlace(kb, place);
        if (!p) return { found: false as const, message: `No place called "${place}" in the knowledge base.` };
        const permit = p.permitId ? permitFor(kb, p.permitId, nat) : null;
        const closures = m ? closuresFor(kb, p.id, m) : [];
        const sources: Source[] = [sourceOf(p, p.name)];
        if (permit) sources.unshift(permit.source);
        return {
          found: true as const,
          place: p.name,
          altitudeM: p.altitudeM,
          permitNeeded: !!permit,
          permit,
          entryNote:
            nat === "foreign"
              ? "Foreign nationals also need the Restricted Area Permit (RAP) to enter Sikkim at all."
              : undefined,
          seasonal: closures.map((c) => ({ month: MONTHS[m! - 1], severity: c.severity, reason: c.reason })),
          sources,
        };
      },
    }),

    searchKnowledge: tool({
      description:
        "Search Denzong's guidance documents (altitude safety, permits overview, etiquette, seasons, transport, cash and network).",
      inputSchema: z.object({ query: z.string() }),
      execute: async ({ query }) => {
        const { docs, permits } = await searchKnowledge(query);
        return {
          results: [
            ...docs.map((d) => ({ title: d.title, text: d.body })),
            ...permits.map((p) => ({ title: p.name, text: `Indians: ${p.indianRule} Foreigners: ${p.foreignerRule}` })),
          ],
          sources: [
            ...docs.map((d) => sourceOf(d, d.title)),
            ...permits.map((p) => sourceOf(p, p.name)),
          ],
        };
      },
    }),

    presentItinerary: tool({
      description:
        "Submit a day-wise itinerary. The server checks drive times, altitude, permits, closures and budget. If it returns ok:false, fix every error and call this tool again. Only describe the plan to the user after ok:true.",
      inputSchema: z.object({
        inputs: z.object({
          days: z.number().int().min(1).max(21),
          month,
          travellers: z.number().int().min(1).max(20),
          groupType: z.enum(["solo", "couple", "friends", "family"]),
          nationality,
          budgetInr: z.number().int().positive().optional().describe("Total budget for the whole group, only if the user gave one"),
          startFrom: z.string().describe("Place id where day 1 starts, e.g. bagdogra or njp"),
          endAt: z.string().describe("Place id where the last day ends, usually the same gateway"),
          interests: z.array(z.string()),
        }),
        title: z.string().describe("Short trip title, e.g. 'Snow and monasteries, 5 days'"),
        summary: z.string().describe("One or two sentences on the shape of the trip"),
        days: z.array(
          z.object({
            title: z.string().describe("e.g. 'Gangtok to Lachung'"),
            visit: z.array(z.string()).describe("Place ids visited today, in order, excluding where the day starts"),
            overnight: z.string().describe("Place id where the night is spent; on the last day, the trip end point"),
            notes: z.string().optional().describe("One practical tip for the day"),
          }),
        ),
      }),
      execute: async ({ inputs, title, summary, days }): Promise<PresentItineraryResult> => {
        const kb = await loadKb();
        const { errors, warnings, itinerary } = buildItinerary(kb, inputs, { title, summary, days });
        if (!itinerary) return { ok: false, errors, warnings };
        const slug = await saveTrip(itinerary, ctx.tripSlug);
        ctx.tripSlug = slug;
        return { ok: true, slug, itinerary };
      },
      // The model only needs the verdict, not the whole enriched plan.
      toModelOutput: ({ output }) => {
        if (!output.ok) return { type: "json", value: { ok: false, errors: output.errors } };
        const it = output.itinerary;
        return {
          type: "json",
          value: {
            ok: true,
            shownToUser: "The itinerary is displayed as cards next to the chat.",
            days: it.days.map((d) => ({
              day: d.day,
              title: d.title,
              driveHours: +(d.driveMinutes / 60).toFixed(1),
              overnight: d.overnight.name,
              maxAltitudeM: d.maxAltitudeM,
            })),
            permits: it.permits.map((p) => p.name),
            costRangeInr: [it.totals.costMin, it.totals.costMax],
            warnings: it.warnings,
          },
        };
      },
    }),
  };
}

export type DenzongTools = ReturnType<typeof createTools>;
