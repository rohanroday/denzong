import type { Itinerary } from "@/lib/types";
import { dayDot, metres } from "./format";

// The trip's climb at a glance: where you sleep each night (solid line) and
// the highest point you reach that day (faint bar). Sharp climbs are what
// the altitude rules guard against, so they should be visible.
export function AltitudeProfile({ itinerary }: { itinerary: Itinerary }) {
  const days = itinerary.days;
  const peak = Math.max(5200, ...days.map((d) => d.maxAltitudeM));
  const W = 100;
  const H = 40;
  const x = (i: number) => (days.length === 1 ? W / 2 : (i / (days.length - 1)) * (W - 8) + 4);
  const y = (m: number) => H - (m / peak) * (H - 4) - 2;
  const sleep = days.map((d, i) => `${i ? "L" : "M"} ${x(i).toFixed(2)} ${y(d.overnight.altitudeM).toFixed(2)}`).join(" ");
  const highest = days.reduce((a, d) => (d.maxAltitudeM > a.maxAltitudeM ? d : a), days[0]);

  return (
    <figure className="rounded-2xl border border-line bg-paper p-4">
      <figcaption className="flex flex-wrap items-baseline justify-between gap-2 text-sm">
        <span className="font-semibold text-ink">Altitude, day by day</span>
        <span className="tabular text-muted">
          Highest: {highest.stops.concat(highest.overnight).sort((a, b) => b.altitudeM - a.altitudeM)[0]?.name} ·{" "}
          {metres(highest.maxAltitudeM)}
        </span>
      </figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="mt-3 h-20 w-full" aria-hidden>
        {[2500, 4000].map((m) => (
          <line key={m} x1="0" x2={W} y1={y(m)} y2={y(m)} className="stroke-line" strokeWidth="0.3" strokeDasharray="1 1" vectorEffect="non-scaling-stroke" />
        ))}
        {days.map((d, i) => (
          <line
            key={d.day}
            x1={x(i)}
            x2={x(i)}
            y1={H}
            y2={y(d.maxAltitudeM)}
            className="stroke-maroon/20"
            strokeWidth="5"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        ))}
        <path d={sleep} fill="none" className="stroke-pine" strokeWidth="2" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      </svg>
      <ol className="mt-2 grid" style={{ gridTemplateColumns: `repeat(${days.length}, minmax(0, 1fr))` }}>
        {days.map((d) => (
          <li key={d.day} className="flex flex-col items-center gap-1 text-center">
            <span className={`size-2.5 rounded-full ${dayDot(d.day)}`} aria-hidden />
            <span className="tabular text-[11px] leading-tight text-muted">
              <span className="sr-only">Day {d.day}: sleep at </span>
              {d.isLastDay ? "home" : d.overnight.altitudeM.toLocaleString("en-IN")}
            </span>
          </li>
        ))}
      </ol>
      <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-0.5 w-4 rounded bg-pine" aria-hidden /> Where you sleep
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-1.5 rounded bg-maroon/20" aria-hidden /> Highest point that day
        </span>
      </p>
    </figure>
  );
}
