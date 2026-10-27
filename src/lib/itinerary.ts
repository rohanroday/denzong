import "server-only";
import type { Place } from "@/db/schema";
import {
  closuresFor,
  MONSOON_FACTOR,
  MONSOON_MONTHS,
  MONTHS,
  permitFor,
  routeBetween,
  type Kb,
} from "./kb";
import type { Itinerary, ItineraryDay, Leg, PermitInfo, StopInfo, TripInputs } from "./types";

// The model drafts a skeleton (which places, which overnight); this module
// computes every fact from the knowledge base and rejects plans that don't
// work on real roads. Errors go back to the model so it can fix the plan.

export type DraftDay = { title: string; visit: string[]; overnight: string; notes?: string };
export type Draft = { title: string; summary: string; days: DraftDay[] };

// Rough cost assumptions, INR. Estimates only; shown to users as a range.
const COST = {
  carPerDriveHour: 700, // reserved taxi, per vehicle
  carMinPerDay: 1500,
  seatsPerCar: 4,
  sharedPerPersonHour: 120, // shared jeeps, for solo travellers and tight budgets
  foodPerPerson: [500, 900],
  peoplePerRoom: 2,
  stayRange: [0.75, 1.3],
};

// Above this, travellers should have slept at a middle altitude the night before.
// Day trips from Gangtok to ~4,000 m (Tsomgo, Nathu La) are routine; Zero Point
// and Gurudongmar are not.
const HIGH_ALTITUDE_M = 4500;
const ACCLIMATISED_SLEEP_M = 2500;
const MAX_SLEEP_GAIN_M = 1500;

function dailyDriveCap(inputs: TripInputs) {
  // Adults: allows the classic Lachen -> Gurudongmar -> Lachung day (~8.5h).
  return inputs.groupType === "family" ? 420 : 540;
}

function toStop(p: Place): StopInfo {
  return { id: p.id, name: p.name, altitudeM: p.altitudeM, lat: p.lat, lng: p.lng, permitId: p.permitId };
}

function hours(min: number) {
  const h = Math.floor(min / 60);
  const m = Math.round(min % 60);
  return m ? `${h}h ${m}m` : `${h}h`;
}

export function buildItinerary(kb: Kb, inputs: TripInputs, draft: Draft) {
  const errors: string[] = [];
  const warnings: string[] = [];
  const monsoon = MONSOON_MONTHS.includes(inputs.month);
  const cap = dailyDriveCap(inputs);

  const lookup = (id: string, where: string) => {
    const p = kb.places.get(id);
    if (!p) errors.push(`${where}: unknown place id "${id}". Use ids returned by findPlaces.`);
    return p;
  };

  if (draft.days.length !== inputs.days) {
    errors.push(`The trip has ${inputs.days} days but the plan has ${draft.days.length}. Plan exactly ${inputs.days} days.`);
  }
  const start = lookup(inputs.startFrom, "Trip start");
  const end = lookup(inputs.endAt, "Trip end");
  if (!start || !end) return { errors, warnings, itinerary: null };

  const days: ItineraryDay[] = [];
  const tripPermits = new Map<string, PermitInfo>();
  let prevNight: Place = start;

  draft.days.forEach((d, i) => {
    const dayNo = i + 1;
    const isLastDay = dayNo === draft.days.length;
    const label = `Day ${dayNo}`;
    const dayWarnings: string[] = [];

    const stops = d.visit.map((id) => lookup(id, label)).filter((p): p is Place => !!p);
    const overnight = lookup(d.overnight, `${label} overnight`);
    if (!overnight || stops.length !== d.visit.length) return;

    if (isLastDay && overnight.id !== end.id) {
      errors.push(`${label} is the last day, so it must end at the trip end point "${end.id}" (set overnight to "${end.id}").`);
    }
    if (!isLastDay && !overnight.canOvernight) {
      errors.push(`${label}: nobody can stay overnight at ${overnight.name}. Pick a place with stays, e.g. a base town or village.`);
    }

    // Legs: previous night -> each stop in order -> tonight.
    const sequence = [prevNight, ...stops, overnight].filter((p, j, arr) => j === 0 || p.id !== arr[j - 1].id);
    const legs: Leg[] = [];
    for (let j = 1; j < sequence.length; j++) {
      const r = routeBetween(kb, sequence[j - 1].id, sequence[j].id);
      if (!r) {
        errors.push(`${label}: no known road from ${sequence[j - 1].name} to ${sequence[j].name}.`);
        continue;
      }
      legs.push({
        from: sequence[j - 1].id,
        to: sequence[j].id,
        minutes: Math.round(r.minutes * (monsoon ? MONSOON_FACTOR : 1)),
        path: r.path,
        coords: r.path.map((id) => {
          const p = kb.places.get(id)!;
          return [p.lng, p.lat] as [number, number];
        }),
        notes: r.notes,
      });
    }
    const driveMinutes = legs.reduce((s, l) => s + l.minutes, 0);
    if (driveMinutes > cap) {
      errors.push(
        `${label}: ${hours(driveMinutes)} of driving is too much (limit ${hours(cap)} for this group${monsoon ? ", monsoon times included" : ""}). Split it or drop stops.`,
      );
    } else if (driveMinutes > cap - 60) {
      dayWarnings.push(`Long driving day (${hours(driveMinutes)}). Start early.`);
    }

    // Altitude: sleep high before going very high; don't jump sleeping altitude.
    const visited = sequence.slice(1);
    const maxAltitudeM = Math.max(...sequence.map((p) => p.altitudeM));
    const veryHigh = visited.filter((p) => p.altitudeM >= HIGH_ALTITUDE_M);
    if (veryHigh.length && prevNight.altitudeM < ACCLIMATISED_SLEEP_M) {
      errors.push(
        `${label}: ${veryHigh.map((p) => p.name).join(", ")} (${veryHigh[0].altitudeM} m) needs a night at ${ACCLIMATISED_SLEEP_M} m or higher first; the night before is at ${prevNight.name} (${prevNight.altitudeM} m).`,
      );
    }
    if (!isLastDay && overnight.altitudeM > ACCLIMATISED_SLEEP_M && overnight.altitudeM - prevNight.altitudeM > MAX_SLEEP_GAIN_M) {
      dayWarnings.push(`Sleeping altitude rises ${overnight.altitudeM - prevNight.altitudeM} m today; go slow and watch for altitude symptoms.`);
    }

    // Permits and seasonal closures for everything visited today.
    const dayPermits = new Map<string, PermitInfo>();
    for (const p of visited) {
      if (p.permitId) {
        const info = permitFor(kb, p.permitId, inputs.nationality);
        if (info) {
          dayPermits.set(info.id, info);
          if (!info.allowed) errors.push(`${label}: ${p.name} is not open to foreign nationals (${info.name}).`);
          const raw = kb.permits.get(p.permitId);
          if (inputs.nationality === "foreign" && raw?.foreignerAllowed === "group" && inputs.travellers < 2) {
            errors.push(`${label}: foreign nationals can visit ${p.name} only in a group of two or more.`);
          }
        }
      }
      for (const c of closuresFor(kb, p.id, inputs.month)) {
        const msg = `${p.name} in ${MONTHS[inputs.month - 1]}: ${c.reason}`;
        if (c.severity === "closed") errors.push(`${label}: ${msg}`);
        else dayWarnings.push(msg);
      }
      if (p.id === "nathula") dayWarnings.push("Nathu La is usually closed to tourists on Mondays and Tuesdays; plan this day for another weekday.");
    }
    for (const [id, info] of dayPermits) tripPermits.set(id, info);
    if (monsoon && legs.length) dayWarnings.push("Monsoon: landslides can close roads for hours. Keep a buffer.");

    // Rough cost for the whole group.
    const t = inputs.travellers;
    const driveHours = driveMinutes / 60;
    const shared = inputs.groupType === "solo" || (inputs.budgetInr ?? Infinity) / inputs.days / t < 2500;
    const transport = !legs.length
      ? 0
      : shared
        ? driveHours * COST.sharedPerPersonHour * t
        : Math.max(COST.carMinPerDay, driveHours * COST.carPerDriveHour) * Math.ceil(t / COST.seatsPerCar);
    const rooms = Math.ceil(t / COST.peoplePerRoom);
    const stay = isLastDay ? 0 : (overnight.stayPerNight ?? 2000) * rooms;
    const fees = [...dayPermits.keys()].reduce((s, id) => s + (kb.permits.get(id)?.approxFeeInr ?? 0) * t, 0);
    const cost = {
      min: Math.round(transport + stay * COST.stayRange[0] + COST.foodPerPerson[0] * t + fees),
      max: Math.round(transport * 1.2 + stay * COST.stayRange[1] + COST.foodPerPerson[1] * t + fees),
    };

    days.push({
      day: dayNo,
      title: d.title,
      notes: d.notes ?? "",
      startAt: toStop(prevNight),
      stops: stops.map(toStop),
      overnight: toStop(overnight),
      isLastDay,
      legs,
      driveMinutes,
      maxAltitudeM,
      permits: [...dayPermits.values()],
      warnings: dayWarnings,
      cost,
    });
    warnings.push(...dayWarnings.map((w) => `Day ${dayNo}: ${w}`));
    prevNight = overnight;
  });

  if (errors.length) return { errors, warnings, itinerary: null };

  const costMin = days.reduce((s, d) => s + d.cost.min, 0);
  const costMax = days.reduce((s, d) => s + d.cost.max, 0);
  if (inputs.budgetInr && costMin > inputs.budgetInr * 1.1) {
    errors.push(
      `Estimated cost is at least ₹${costMin.toLocaleString("en-IN")}, well over the ₹${inputs.budgetInr.toLocaleString("en-IN")} budget. Use cheaper bases, fewer long drives, or skip permit-heavy trips.`,
    );
    return { errors, warnings, itinerary: null };
  }

  const itinerary: Itinerary = {
    title: draft.title,
    summary: draft.summary,
    inputs,
    days,
    totals: { driveMinutes: days.reduce((s, d) => s + d.driveMinutes, 0), costMin, costMax },
    permits: [...tripPermits.values()],
    warnings,
    dataStatus: "draft",
  };
  return { errors, warnings, itinerary };
}
