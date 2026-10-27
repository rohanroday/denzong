"use client";

import { Fragment } from "react";
import { Check, LoaderCircle, RotateCcw, TriangleAlert, Wrench } from "lucide-react";
import { SourceChip } from "@/components/SourceChip";
import { messageSources, stepLabel, type DenzongMessage } from "./messages";

// Just enough markdown for the model's replies: paragraphs, bullets, **bold**.
function Prose({ text }: { text: string }) {
  const blocks = text.trim().split(/\n{2,}/);
  const inline = (s: string) =>
    s.split(/(\*\*[^*]+\*\*)/g).map((chunk, i) =>
      chunk.startsWith("**") && chunk.endsWith("**") ? (
        <strong key={i} className="font-semibold text-ink">
          {chunk.slice(2, -2)}
        </strong>
      ) : (
        <Fragment key={i}>{chunk}</Fragment>
      ),
    );
  return (
    <div className="space-y-2.5">
      {blocks.map((b, i) => {
        const lines = b.split("\n");
        if (lines.every((l) => /^\s*[-*] /.test(l))) {
          return (
            <ul key={i} className="list-disc space-y-1 pl-5 marker:text-maroon">
              {lines.map((l, j) => (
                <li key={j}>{inline(l.replace(/^\s*[-*] /, ""))}</li>
              ))}
            </ul>
          );
        }
        return <p key={i}>{lines.map((l, j) => <Fragment key={j}>{j > 0 && <br />}{inline(l)}</Fragment>)}</p>;
      })}
    </div>
  );
}

function Steps({ message, live }: { message: DenzongMessage; live: boolean }) {
  const steps = message.parts.map(stepLabel).filter((s): s is NonNullable<ReturnType<typeof stepLabel>> => !!s);
  if (!steps.length) return null;
  return (
    <ol className="space-y-1.5 text-[13px] leading-snug" aria-label="What Denzong checked">
      {steps.map((s, i) => {
        const working = s.tone === "work" && live;
        const Icon = working ? LoaderCircle : s.tone === "fix" ? Wrench : s.tone === "error" ? TriangleAlert : Check;
        return (
          <li key={i} className={`flex gap-2 ${s.tone === "fix" || s.tone === "error" ? "text-caution" : "text-muted"}`}>
            <Icon className={`mt-px size-3.5 shrink-0 ${working ? "animate-spin" : ""} ${s.tone === "done" ? "text-pine" : ""}`} aria-hidden />
            <span>{s.text}</span>
          </li>
        );
      })}
    </ol>
  );
}

export function ChatThread({
  messages,
  status,
  error,
  onRetry,
}: {
  messages: DenzongMessage[];
  status: "submitted" | "streaming" | "ready" | "error";
  error?: Error;
  onRetry: () => void;
}) {
  const busy = status === "submitted" || status === "streaming";
  return (
    <div className="space-y-6" aria-live="polite">
      {messages.map((m, idx) => {
        if (m.role === "user") {
          const text = m.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
          return (
            <div key={m.id} className="flex justify-end">
              <p className="max-w-[85%] rounded-2xl rounded-br-md bg-pine px-4 py-2.5 text-[15px] leading-relaxed text-paper">{text}</p>
            </div>
          );
        }
        const text = m.parts.map((p) => (p.type === "text" ? p.text : "")).join("\n\n");
        const sources = messageSources(m);
        const live = busy && idx === messages.length - 1;
        return (
          <div key={m.id} className="space-y-3">
            <Steps message={m} live={live} />
            {text.trim() && (
              <div className="text-[15px] leading-relaxed text-slate">
                <Prose text={text} />
              </div>
            )}
            {sources.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {sources.map((s) => (
                  <SourceChip key={`${s.label}${s.url}`} source={s} />
                ))}
              </div>
            )}
          </div>
        );
      })}

      {status === "submitted" && (
        <p className="flex items-center gap-2 text-[13px] text-muted">
          <LoaderCircle className="size-3.5 animate-spin" aria-hidden />
          Reading your trip. Free AI can take a minute; Denzong checks every road and permit.
        </p>
      )}

      {status === "error" && (
        <div className="flex flex-col items-start gap-2 rounded-xl bg-danger-wash px-4 py-3 text-sm text-danger">
          <p>{error?.message || "Something went wrong."}</p>
          <button type="button" onClick={onRetry} className="inline-flex items-center gap-1.5 font-semibold underline">
            <RotateCcw className="size-3.5" aria-hidden /> Try again
          </button>
        </div>
      )}
    </div>
  );
}
