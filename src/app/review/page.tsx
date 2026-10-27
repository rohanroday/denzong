import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { desc } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { Wordmark } from "@/components/Wordmark";
import { setReportStatus } from "./actions";
import { reviewEnabled } from "./access";

export const metadata: Metadata = { title: "Review queue", robots: { index: false } };

const STATUS_STYLE: Record<string, string> = {
  open: "bg-caution-wash text-caution",
  fixed: "bg-pine-wash text-pine",
  dismissed: "bg-mist-deep text-muted",
};

async function Reports() {
  await connection();
  if (!reviewEnabled()) notFound();
  const db = await getDb();
  const rows = await db.select().from(schema.reports).orderBy(desc(schema.reports.createdAt));
  const open = rows.filter((r) => r.status === "open").length;

  if (!rows.length) {
    return (
      <p className="rounded-2xl border border-line bg-paper p-6 text-slate">
        No reports yet. When travellers tap &ldquo;Report a mistake&rdquo; on a plan, it shows up here.
      </p>
    );
  }

  return (
    <>
      <p className="text-slate">
        <span className="tabular font-semibold text-ink">{open}</span> open of {rows.length}. Fix the row in{" "}
        <code className="rounded bg-mist-deep px-1.5 py-0.5 text-sm">src/data/</code>, set its source and verified date, then mark the
        report fixed.
      </p>
      <ul className="mt-6 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-paper">
        {rows.map((r) => (
          <li key={r.id} className="grid gap-3 p-4 sm:grid-cols-[1fr_auto] sm:items-start">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${STATUS_STYLE[r.status] ?? ""}`}>{r.status}</span>
                <span className="font-semibold text-ink">{r.subject}</span>
                <time className="tabular text-muted" dateTime={r.createdAt}>
                  {new Date(r.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                </time>
              </div>
              <p className="mt-1.5 leading-relaxed whitespace-pre-wrap text-slate">{r.message}</p>
              {r.tripSlug && (
                <Link href={`/t/${r.tripSlug}`} className="mt-1.5 inline-block text-sm font-medium text-maroon underline">
                  Open the plan
                </Link>
              )}
            </div>
            <form action={setReportStatus} className="flex gap-1.5">
              <input type="hidden" name="id" value={r.id} />
              {(["fixed", "dismissed", "open"] as const)
                .filter((s) => s !== r.status)
                .map((s) => (
                  <button
                    key={s}
                    name="status"
                    value={s}
                    className="rounded-lg border border-line px-3 py-1.5 text-sm font-medium text-slate capitalize hover:border-pine/40 hover:text-pine"
                  >
                    {s === "open" ? "Reopen" : `Mark ${s}`}
                  </button>
                ))}
            </form>
          </li>
        ))}
      </ul>
    </>
  );
}

export default function ReviewPage() {
  return (
    <div className="min-h-[100dvh] bg-mist">
      <header className="border-b border-line bg-paper px-4 py-3 sm:px-6">
        <Wordmark />
      </header>
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-8">
        <h1 className="font-display text-3xl font-medium text-ink">Mistakes reported by travellers</h1>
        <div className="mt-4">
          <Suspense fallback={<p className="text-muted">Loading reports…</p>}>
            <Reports />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
