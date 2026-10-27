import { buildItinerary, type Draft } from "@/lib/itinerary";
import { loadKb, searchKnowledge } from "@/lib/kb";
import type { TripInputs } from "@/lib/types";

// Development-only self-test: runs fixed sample plans through the validator
// without calling the AI model. Open /api/dev/check while `npm run dev` runs.

const inputs: TripInputs = {
  days: 5,
  month: 12,
  travellers: 2,
  groupType: "couple",
  nationality: "indian",
  budgetInr: 60000,
  startFrom: "bagdogra",
  endAt: "bagdogra",
  interests: ["snow", "monasteries"],
};

const good: Draft = {
  title: "Snow and monasteries",
  summary: "Gangtok base with Tsomgo and Lachung.",
  days: [
    { title: "Bagdogra to Gangtok", visit: ["gangtok"], overnight: "gangtok" },
    { title: "Tsomgo and Baba Mandir", visit: ["tsomgo", "baba-mandir"], overnight: "gangtok" },
    { title: "North to Lachung", visit: ["seven-sisters"], overnight: "lachung" },
    { title: "Yumthang and back to Gangtok", visit: ["yumthang"], overnight: "gangtok" },
    { title: "Rumtek and out", visit: ["rumtek"], overnight: "bagdogra" },
  ],
};

const bad: Draft = {
  title: "Too fast",
  summary: "Gurudongmar straight from Gangtok.",
  days: [
    { title: "Bagdogra to Gangtok", visit: [], overnight: "gangtok" },
    { title: "Gurudongmar day trip", visit: ["gurudongmar"], overnight: "gangtok" },
    { title: "Rest", visit: [], overnight: "gangtok" },
    { title: "Rest", visit: [], overnight: "gangtok" },
    { title: "Out", visit: [], overnight: "bagdogra" },
  ],
};

export async function GET() {
  if (process.env.NODE_ENV === "production") return new Response("Not found", { status: 404 });
  const kb = await loadKb();
  const goodResult = buildItinerary(kb, inputs, good);
  const badResult = buildItinerary(kb, inputs, bad);
  const foreign = buildItinerary(kb, { ...inputs, nationality: "foreign" }, good);
  const search = await searchKnowledge("can foreigners visit gurudongmar");
  return Response.json({
    counts: { places: kb.places.size, routes: kb.routes.length, permits: kb.permits.size },
    good: {
      errors: goodResult.errors,
      days: goodResult.itinerary?.days.map((d) => `${d.day}: ${d.title} · ${d.driveMinutes} min · max ${d.maxAltitudeM} m · ₹${d.cost.min}-${d.cost.max}`),
      totals: goodResult.itinerary?.totals,
      warnings: goodResult.warnings,
    },
    badErrors: badResult.errors,
    foreignErrors: foreign.errors,
    search: search.docs.map((d) => d.title).concat(search.permits.map((p) => p.name)),
  });
}
