"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import { Check, CircleAlert, Link2, Share2 } from "lucide-react";
import type { Itinerary } from "@/lib/types";
import { AltitudeProfile } from "./AltitudeProfile";
import { DayCard } from "./DayCard";
import { hours, inr, MONTH_NAMES } from "./format";
import { ReportForm } from "./ReportForm";

const RouteMap = dynamic(() => import("./RouteMap").then((m) => m.RouteMap), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-mist-deep" />,
});

function ShareButton({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);
  async function share() {
    const url = `${window.location.origin}/t/${slug}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Our Sikkim plan", url });
        return;
      } catch {
        // dismissed: fall back to copying
      }
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <button
      type="button"
      onClick={share}
      className="inline-flex items-center gap-2 rounded-xl bg-maroon px-4 py-2.5 text-sm font-semibold text-paper transition-[background-color,transform] hover:bg-maroon-deep active:scale-[0.97]"
    >
      {copied ? <Check className="size-4" aria-hidden /> : <Share2 className="size-4" aria-hidden />}
      {copied ? "Link copied" : "Share plan"}
    </button>
  );
}

export function ItineraryView({ itinerary, slug, readOnly = false }: { itinerary: Itinerary; slug?: string; readOnly?: boolean }) {
  const { inputs, totals } = itinerary;
  const who = inputs.groupType === "solo" ? "Solo" : `${inputs.travellers} travellers · ${inputs.groupType}`;

  return (
    <div className="space-y-5">
      <header className="space-y-3">
        <p className="tabular text-sm text-muted">
          {inputs.days} days · {MONTH_NAMES[inputs.month - 1]} · {who}
          {inputs.nationality === "foreign" ? " · foreign nationals" : ""}
        </p>
        <h2 className="font-display text-3xl leading-tight font-medium tracking-[-0.02em] text-balance text-ink sm:text-4xl">
          {itinerary.title}
        </h2>
        <p className="max-w-[65ch] leading-relaxed text-slate">{itinerary.summary}</p>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-1">
          <dl className="tabular flex gap-6 text-sm">
            <div>
              <dt className="text-muted">Driving</dt>
              <dd className="font-semibold text-ink">{hours(totals.driveMinutes)}</dd>
            </div>
            <div>
              <dt className="text-muted">Estimated cost</dt>
              <dd className="font-semibold text-ink">
                {inr(totals.costMin)}–{inr(totals.costMax)}
              </dd>
            </div>
            {inputs.budgetInr ? (
              <div>
                <dt className="text-muted">Your budget</dt>
                <dd className="font-semibold text-ink">{inr(inputs.budgetInr)}</dd>
              </div>
            ) : null}
          </dl>
          {slug && !readOnly && <ShareButton slug={slug} />}
          {slug && readOnly && (
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-maroon underline">
              <Link2 className="size-4" aria-hidden /> Plan your own trip
            </Link>
          )}
        </div>
      </header>

      {itinerary.dataStatus === "draft" && (
        <p className="flex gap-2.5 rounded-xl border border-caution/25 bg-caution-wash px-4 py-3 text-sm leading-relaxed text-caution">
          <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
          <span>
            Drive times, permits and costs come from Denzong&apos;s draft knowledge base and haven&apos;t been verified yet.
            Confirm permits with a registered Gangtok operator before you travel.
          </span>
        </p>
      )}

      <div className="relative h-64 overflow-hidden rounded-2xl border border-line sm:h-80">
        <RouteMap itinerary={itinerary} className="h-full w-full" />
      </div>

      <AltitudeProfile itinerary={itinerary} />

      <ol className="space-y-4">
        {itinerary.days.map((d) => (
          <li key={d.day}>
            <DayCard day={d} />
          </li>
        ))}
      </ol>

      <footer className="flex flex-col gap-3 border-t border-line pt-5 text-sm text-muted">
        <p>Costs are rough estimates for the whole group: stays, a shared or reserved taxi, food and permit fees. Flights and trains are not included.</p>
        <ReportForm itinerary={itinerary} slug={slug} />
      </footer>
    </div>
  );
}
