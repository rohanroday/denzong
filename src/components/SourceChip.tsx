"use client";

import { useEffect, useId, useRef, useState } from "react";
import { BookOpenCheck, CircleAlert, ExternalLink } from "lucide-react";
import type { Source } from "@/lib/types";

export function isDraft(source: Source) {
  return !source.verifiedAt;
}

function verifiedLabel(source: Source) {
  if (!source.verifiedAt) return "Not verified yet";
  return `Verified ${new Date(source.verifiedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`;
}

// A small chip that opens a note on where a fact came from. Draft facts say
// so plainly; they never show a made-up verified date.
export function SourceChip({ source, compact = false }: { source: Source; compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const ref = useRef<HTMLSpanElement>(null);
  const draft = isDraft(source);
  const external = source.url.startsWith("http");

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  return (
    <span ref={ref} className="relative inline-flex">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium transition-colors ${
          draft
            ? "border-caution/30 bg-caution-wash text-caution hover:border-caution/60"
            : "border-pine/25 bg-pine-wash text-pine hover:border-pine/50"
        }`}
      >
        {draft ? <CircleAlert className="size-3" aria-hidden /> : <BookOpenCheck className="size-3" aria-hidden />}
        {compact ? (draft ? "Draft" : "Source") : `${source.label} · ${draft ? "draft" : "verified"}`}
      </button>
      {open && (
        <span
          id={id}
          role="dialog"
          aria-label="Source"
          className="absolute bottom-full left-0 z-30 mb-2 w-64 rounded-xl border border-line bg-paper p-3 text-left text-xs leading-relaxed text-slate shadow-raised"
        >
          <span className="block font-semibold text-ink">{source.label}</span>
          <span className={`mt-0.5 block font-medium ${draft ? "text-caution" : "text-pine"}`}>{verifiedLabel(source)}</span>
          {draft ? (
            <span className="mt-1.5 block">
              From Denzong&apos;s draft knowledge base. Check with Sikkim Tourism or a registered Gangtok operator before relying on it.
            </span>
          ) : null}
          {external && (
            <a href={source.url} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 font-medium text-maroon underline">
              Open source <ExternalLink className="size-3" aria-hidden />
            </a>
          )}
        </span>
      )}
    </span>
  );
}
