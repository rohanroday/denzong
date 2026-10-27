"use client";

import { useState } from "react";
import { ArrowRight, BedDouble, Car, ChevronDown, Lightbulb, Mountain, ScrollText, TriangleAlert } from "lucide-react";
import { SourceChip } from "@/components/SourceChip";
import type { ItineraryDay, PermitInfo } from "@/lib/types";
import { dayDot, hours, inr, metres } from "./format";

function PermitBadge({ permit }: { permit: PermitInfo }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="w-full">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
          permit.allowed
            ? "border-maroon/25 bg-maroon-wash text-maroon hover:border-maroon/50"
            : "border-danger/30 bg-danger-wash text-danger"
        }`}
      >
        <ScrollText className="size-3.5" aria-hidden />
        {permit.name.replace(/^Protected Area Permit: /, "")} permit
        <ChevronDown className={`size-3 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden />
      </button>
      {open && (
        <div className="mt-2 rounded-xl border border-line bg-mist p-3 text-sm leading-relaxed text-slate">
          <p className="font-semibold text-ink">{permit.name}</p>
          <p className="mt-1">{permit.rule}</p>
          <p className="mt-2">
            <span className="font-medium text-ink">How to get it: </span>
            {permit.howToApply}
          </p>
          <div className="mt-2">
            <SourceChip source={permit.source} />
          </div>
        </div>
      )}
    </div>
  );
}

export function DayCard({ day }: { day: ItineraryDay }) {
  const places = [day.startAt, ...day.stops, day.overnight].filter((p, i, a) => i === 0 || p.id !== a[i - 1].id);
  const roadNotes = [...new Set(day.legs.flatMap((l) => l.notes))];

  return (
    <article className="rounded-2xl border border-line bg-paper p-4 shadow-card sm:p-5" aria-labelledby={`day-${day.day}`}>
      <header className="flex items-start gap-3">
        <span className={`mt-1.5 size-3 shrink-0 rounded-full ${dayDot(day.day)}`} aria-hidden />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold tracking-wide text-muted uppercase">
            Day {day.day}
            {day.isLastDay ? " · last day" : ""}
          </p>
          <h3 id={`day-${day.day}`} className="mt-0.5 font-display text-xl leading-snug font-medium text-ink">
            {day.title}
          </h3>
        </div>
        <p className="tabular shrink-0 text-right text-sm text-muted">
          {inr(day.cost.min)}–{inr(day.cost.max)}
          <span className="block text-[11px]">est. for group</span>
        </p>
      </header>

      <p className="mt-3 text-[15px] leading-relaxed text-slate">
        {places.map((p, i) => (
          <span key={`${p.id}-${i}`}>
            {i > 0 && <ArrowRight className="mx-1 inline size-3.5 align-[-2px] text-muted" aria-label="then" />}
            <span className={i === 0 || i === places.length - 1 ? "font-medium text-ink" : ""}>{p.name}</span>
          </span>
        ))}
      </p>

      <ul className="tabular mt-3 flex flex-wrap gap-2 text-xs font-medium">
        {day.driveMinutes > 0 && (
          <li className="inline-flex items-center gap-1.5 rounded-full bg-mist px-2.5 py-1 text-slate">
            <Car className="size-3.5" aria-hidden /> {hours(day.driveMinutes)} on the road
          </li>
        )}
        <li
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 ${
            day.maxAltitudeM >= 4000 ? "bg-pine text-paper" : "bg-pine-wash text-pine"
          }`}
        >
          <Mountain className="size-3.5" aria-hidden /> Up to {metres(day.maxAltitudeM)}
        </li>
      </ul>

      {day.permits.length > 0 && (
        <div className="mt-3 flex flex-col items-start gap-2">
          {day.permits.map((p) => (
            <PermitBadge key={p.id} permit={p} />
          ))}
        </div>
      )}

      {day.warnings.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {day.warnings.map((w) => (
            <li key={w} className="flex gap-2 rounded-lg bg-caution-wash px-3 py-2 text-sm leading-snug text-caution">
              <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
              {w}
            </li>
          ))}
        </ul>
      )}

      {(day.notes || roadNotes.length > 0) && (
        <div className="mt-3 space-y-1.5 text-sm leading-relaxed text-slate">
          {day.notes && (
            <p className="flex gap-2">
              <Lightbulb className="mt-0.5 size-4 shrink-0 text-maroon" aria-hidden />
              {day.notes}
            </p>
          )}
          {roadNotes.slice(0, 2).map((n) => (
            <p key={n} className="pl-6 text-muted">
              {n}
            </p>
          ))}
        </div>
      )}

      <footer className="mt-4 flex items-center gap-3 border-t border-line pt-3 text-sm">
        <BedDouble className="size-4 shrink-0 text-pine" aria-hidden />
        {day.isLastDay ? (
          <span className="text-slate">
            Trip ends at <span className="font-medium text-ink">{day.overnight.name}</span>
          </span>
        ) : (
          <span className="text-slate">
            Night at <span className="font-medium text-ink">{day.overnight.name}</span>
            <span className="tabular text-muted"> · {metres(day.overnight.altitudeM)}</span>
            <span className="block text-xs text-muted">Local homestays here are coming soon.</span>
          </span>
        )}
      </footer>
    </article>
  );
}
