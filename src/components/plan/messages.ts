import type { InferUITools, UIMessage } from "ai";
import type { DenzongTools } from "@/lib/agent/tools";
import type { Itinerary, Source } from "@/lib/types";

export type DenzongMessage = UIMessage<never, never, InferUITools<DenzongTools>>;
export type DenzongPart = DenzongMessage["parts"][number];

// The latest plan that passed the server's checks, across the whole chat.
export function latestItinerary(messages: DenzongMessage[]): { itinerary: Itinerary; slug: string } | null {
  for (let i = messages.length - 1; i >= 0; i--) {
    const parts = messages[i].parts;
    for (let j = parts.length - 1; j >= 0; j--) {
      const p = parts[j];
      if (p.type === "tool-presentItinerary" && p.state === "output-available" && p.output.ok) {
        return { itinerary: p.output.itinerary, slug: p.output.slug };
      }
    }
  }
  return null;
}

// Sources the tools returned for this message, de-duplicated. Shown under
// the answer so provenance never depends on the model citing correctly.
export function messageSources(message: DenzongMessage): Source[] {
  const seen = new Map<string, Source>();
  for (const p of message.parts) {
    let sources: Source[] = [];
    if (p.type === "tool-checkPermit" && p.state === "output-available" && p.output.found) sources = p.output.sources;
    if (p.type === "tool-searchKnowledge" && p.state === "output-available") sources = p.output.sources;
    if (p.type === "tool-getRouteTime" && p.state === "output-available" && p.output.found) sources = p.output.sources;
    for (const s of sources) seen.set(`${s.label}|${s.url}`, s);
  }
  return [...seen.values()];
}

// A plain-language line for each tool step, so the wait shows real work.
export function stepLabel(part: DenzongPart): { text: string; tone: "work" | "done" | "fix" | "error" } | null {
  if (!part.type.startsWith("tool-")) return null;
  const p = part as Extract<DenzongPart, { type: `tool-${string}` }>;
  const done = p.state === "output-available";
  if (p.state === "output-error") return { text: "A lookup failed; working around it", tone: "error" };
  switch (p.type) {
    case "tool-findPlaces":
      return { text: done ? "Looked up places and seasons" : "Looking up places and seasons", tone: done ? "done" : "work" };
    case "tool-getRouteTime": {
      const i = p.input;
      const leg = i?.from && i?.to ? `: ${i.from} to ${i.to}` : "";
      return { text: `${done ? "Checked" : "Checking"} road time${leg}`, tone: done ? "done" : "work" };
    }
    case "tool-checkPermit": {
      const place = done && p.output.found ? p.output.place : p.input?.place;
      return { text: `${done ? "Checked" : "Checking"} permit rules${place ? ` for ${place}` : ""}`, tone: done ? "done" : "work" };
    }
    case "tool-searchKnowledge":
      return { text: done ? "Read Denzong's guidance notes" : "Reading Denzong's guidance notes", tone: done ? "done" : "work" };
    case "tool-presentItinerary":
      if (!done) return { text: "Checking the plan against roads, permits and altitude", tone: "work" };
      return p.output.ok
        ? { text: "Plan passed every check and is saved", tone: "done" }
        : { text: `Plan needed fixing: ${p.output.errors[0]}`, tone: "fix" };
    default:
      return null;
  }
}
