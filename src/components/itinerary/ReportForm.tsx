"use client";

import { useState } from "react";
import { Flag } from "lucide-react";
import type { Itinerary } from "@/lib/types";

// "This is wrong" feedback. Reports land in the review queue at /review.
export function ReportForm({ itinerary, slug }: { itinerary: Itinerary; slug?: string }) {
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState("Whole plan");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    setState("sending");
    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ tripSlug: slug, subject, message }),
      });
      setState(res.ok ? "sent" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <p className="rounded-xl bg-pine-wash px-4 py-3 text-sm text-pine">
        Thanks. Someone will check this against the source and fix the knowledge base.
      </p>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 text-sm font-medium text-slate underline decoration-line underline-offset-4 hover:text-maroon"
      >
        <Flag className="size-4" aria-hidden /> Report a mistake
      </button>
    );
  }

  return (
    <form onSubmit={send} className="space-y-3 rounded-2xl border border-line bg-paper p-4">
      <p className="font-semibold text-ink">What&apos;s wrong?</p>
      <label className="block text-sm text-slate">
        About
        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-line bg-mist px-3 py-2 text-ink"
        >
          <option>Whole plan</option>
          {itinerary.days.map((d) => (
            <option key={d.day}>{`Day ${d.day}: ${d.title}`}</option>
          ))}
          {itinerary.permits.map((p) => (
            <option key={p.id}>{p.name}</option>
          ))}
        </select>
      </label>
      <label className="block text-sm text-slate">
        Details
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          required
          maxLength={2000}
          placeholder="e.g. Gangtok to Lachung took us 8 hours in May, not 6."
          className="mt-1 block w-full rounded-lg border border-line bg-mist px-3 py-2 text-ink placeholder:text-muted"
        />
      </label>
      {state === "error" && <p className="text-sm text-danger">Couldn&apos;t send that. Check your connection and try again.</p>}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={state === "sending" || !message.trim()}
          className="rounded-lg bg-maroon px-4 py-2 text-sm font-semibold text-paper hover:bg-maroon-deep disabled:opacity-50"
        >
          {state === "sending" ? "Sending…" : "Send report"}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="rounded-lg px-4 py-2 text-sm font-medium text-slate hover:bg-mist">
          Cancel
        </button>
      </div>
    </form>
  );
}
