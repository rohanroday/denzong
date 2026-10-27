"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUp } from "lucide-react";

const CHIPS = [
  { label: "4 days · Snow · Monasteries · December", text: "4 days in December for 2 of us, snow and monasteries, starting from Bagdogra." },
  { label: "Family · 6 days · April", text: "6 days in April for a family of 4 with two kids, gentle drives, flowers and lakes." },
  { label: "Villages & homestays · ₹40k", text: "5 days in October, quiet villages and homestays, ₹40,000 for 2 people." },
  { label: "Can foreigners visit Gurudongmar?", text: "Can foreigners visit Gurudongmar Lake?" },
];

export function PromptBox() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);

  function submit(value = text) {
    const q = value.trim();
    if (!q) {
      ref.current?.focus();
      return;
    }
    setSending(true);
    router.push(`/plan?q=${encodeURIComponent(q)}`);
  }

  return (
    <div className="w-full">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="group relative rounded-2xl border border-line bg-paper shadow-raised transition-[border-color,box-shadow] focus-within:border-maroon/50"
      >
        <label htmlFor="trip" className="sr-only">
          Describe your trip
        </label>
        <textarea
          ref={ref}
          id="trip"
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          placeholder="e.g. 5 days in November, 2 of us, snow and monasteries, around ₹35,000"
          className="block w-full resize-none rounded-2xl bg-transparent px-5 pt-4 pb-14 text-base leading-relaxed text-ink placeholder:text-muted focus:outline-none sm:text-lg"
        />
        <button
          type="submit"
          disabled={sending}
          className="absolute right-3 bottom-3 inline-flex items-center gap-2 rounded-xl bg-maroon px-4 py-2.5 text-sm font-semibold text-paper transition-[background-color,transform] hover:bg-maroon-deep active:scale-[0.97] disabled:opacity-70"
        >
          {sending ? "Opening…" : "Plan my trip"}
          <ArrowUp className="size-4" aria-hidden />
        </button>
      </form>
      <ul className="mt-4 flex flex-wrap gap-2" aria-label="Try one of these">
        {CHIPS.map((c) => (
          <li key={c.label}>
            <button
              type="button"
              onClick={() => {
                setText(c.text);
                ref.current?.focus();
              }}
              className="rounded-full border border-line bg-paper/80 px-3.5 py-1.5 text-sm text-slate transition-colors hover:border-pine/40 hover:bg-pine-wash hover:text-pine"
            >
              {c.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
