import { ArrowRight, Car, Mountain, ScrollText } from "lucide-react";
import { ContourField, Ridge } from "@/components/Contours";
import { PromptBox } from "@/components/PromptBox";
import { PrayerFlagStrip, Wordmark } from "@/components/Wordmark";

// A sample day, shown to demonstrate what Denzong checks. Draft data.
const SAMPLE = [
  { day: 2, route: "Gangtok → Tsomgo Lake → Baba Mandir → Gangtok", drive: "5h", alt: "4,000 m", permit: "Tsomgo + Nathu La permits", dot: "bg-flag-white ring-1 ring-line" },
  { day: 3, route: "Gangtok → Seven Sisters → Lachung", drive: "5h", alt: "2,700 m", permit: "North Sikkim permit", dot: "bg-flag-red" },
  { day: 4, route: "Lachung → Yumthang → Gangtok", drive: "7h 15m", alt: "3,564 m", permit: "North Sikkim permit", dot: "bg-flag-green" },
];

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="relative isolate flex min-h-[100svh] flex-col overflow-hidden">
        <ContourField className="absolute inset-0 -z-10 h-full w-full text-pine/30" />
        <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 pt-6 sm:px-8">
          <Wordmark />
          <a href="#how" className="text-sm font-medium text-slate hover:text-maroon">
            How it works
          </a>
        </header>

        <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-5 pt-10 pb-[max(9rem,24vw)] sm:px-8">
          <h1
            className="animate-mist-in font-display text-[clamp(2.4rem,7vw,4.5rem)] leading-[1.02] font-medium tracking-[-0.03em] text-balance text-ink"
            style={{ fontVariationSettings: '"opsz" 144, "SOFT" 30' }}
          >
            Where in Sikkim, and for how long?
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate">
            Tell Denzong your days, month and mood. You get one plan that works on real mountain roads, with permits and
            altitude checked.
          </p>
          <div className="mt-8">
            <PromptBox />
          </div>
        </div>

        <Ridge className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 aspect-[4/1] w-full" />
      </section>

      <section id="how" className="bg-paper">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[1fr_1.15fr] lg:gap-20 lg:py-28">
          <div>
            <h2 className="font-display text-4xl leading-tight font-medium tracking-[-0.02em] text-balance text-ink sm:text-5xl">
              A map says two hours. The road says five.
            </h2>
            <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-slate">
              Generic planners squeeze Gurudongmar into a day trip from Gangtok. Denzong drafts the plan, then checks every day
              against drive times on Sikkim&apos;s actual roads, the permit rules for your nationality, the season, and how fast
              you climb.
            </p>
            <dl className="mt-10 space-y-6">
              {[
                { icon: Car, t: "Real road times", d: "Days over about nine hours of driving are split before you ever see them." },
                { icon: ScrollText, t: "Permits, with sources", d: "Each permit badge opens the rule, how to get it, and whether it has been verified." },
                { icon: Mountain, t: "Altitude steps", d: "Zero Point and Gurudongmar only after a night at Lachung or Lachen." },
              ].map(({ icon: Icon, t, d }) => (
                <div key={t} className="flex gap-4">
                  <Icon className="mt-0.5 size-5 shrink-0 text-maroon" aria-hidden />
                  <div>
                    <dt className="font-semibold text-ink">{t}</dt>
                    <dd className="mt-1 text-slate">{d}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>

          <figure className="self-center rounded-3xl border border-line bg-mist p-5 shadow-card sm:p-7">
            <figcaption className="flex items-center justify-between gap-4 text-sm text-muted">
              <span className="font-medium text-slate">Sample plan · 5 days in December</span>
              <span className="rounded-full bg-caution-wash px-2 py-0.5 text-xs font-medium text-caution">Draft data</span>
            </figcaption>
            <PrayerFlagStrip className="mt-4" />
            <ol className="mt-5 space-y-3">
              {SAMPLE.map((s) => (
                <li key={s.day} className="rounded-2xl bg-paper p-4 shadow-card">
                  <div className="flex items-center gap-3">
                    <span className={`size-2.5 shrink-0 rounded-full ${s.dot}`} aria-hidden />
                    <span className="text-xs font-semibold tracking-wide text-muted uppercase">Day {s.day}</span>
                  </div>
                  <p className="mt-2 font-medium text-ink">
                    {s.route.split(" → ").map((place, i) => (
                      <span key={place + i}>
                        {i > 0 && <ArrowRight className="mx-1 inline size-3.5 align-[-2px] text-muted" aria-label="then" />}
                        {place}
                      </span>
                    ))}
                  </p>
                  <p className="tabular mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate">
                    <span>{s.drive} driving</span>
                    <span>Up to {s.alt}</span>
                    <span className="text-maroon">{s.permit}</span>
                  </p>
                </li>
              ))}
            </ol>
          </figure>
        </div>
      </section>

      <footer className="border-t border-line bg-paper">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-8 text-sm text-muted sm:flex-row sm:justify-between sm:px-8">
          <span>Denzong, from Demazong, the Bhutia name for Sikkim.</span>
          <span>Early preview. Facts are drafts until verified.</span>
        </div>
      </footer>
    </main>
  );
}
