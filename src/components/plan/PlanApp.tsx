"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { ArrowUp, Square } from "lucide-react";
import { Ridge } from "@/components/Contours";
import { ItineraryView } from "@/components/itinerary/ItineraryView";
import { Wordmark } from "@/components/Wordmark";
import { ChatThread } from "./ChatThread";
import { latestItinerary, stepLabel, type DenzongMessage } from "./messages";

const TWEAKS = ["Less driving", "Make it cheaper", "Add a village homestay night", "Is this OK for my parents?"];

export function PlanApp() {
  const params = useSearchParams();
  const initial = params.get("q");
  const [transport] = useState(() => new DefaultChatTransport<DenzongMessage>({ api: "/api/chat" }));
  const { messages, sendMessage, status, error, regenerate, stop } = useChat<DenzongMessage>({ transport });
  const [input, setInput] = useState("");
  const [tab, setTab] = useState<"chat" | "plan">("chat");
  const sentInitial = useRef(false);
  const threadEnd = useRef<HTMLDivElement>(null);

  const plan = latestItinerary(messages);
  // Edits update the same saved trip, so its share link stays the same.
  const body = { tripSlug: plan?.slug };
  const busy = status === "submitted" || status === "streaming";

  // Send the question from the home page once. The timeout lets React's
  // development double-mount cancel the first attempt instead of losing it.
  useEffect(() => {
    if (!initial || sentInitial.current) return;
    const t = setTimeout(() => {
      sentInitial.current = true;
      sendMessage({ text: initial });
      window.history.replaceState(null, "", "/plan"); // a reload shouldn't resend it
    }, 0);
    return () => clearTimeout(t);
  }, [initial, sendMessage]);

  // On phones, jump to the plan the moment a new one passes its checks.
  const lastSlugShown = useRef<string | undefined>(undefined);
  const planKey = plan ? `${plan.slug}:${plan.itinerary.days.length}:${plan.itinerary.totals.costMin}` : undefined;
  useEffect(() => {
    if (planKey && planKey !== lastSlugShown.current) {
      lastSlugShown.current = planKey;
      setTab("plan");
    }
  }, [planKey]);

  useEffect(() => {
    threadEnd.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, status]);

  function send(text: string) {
    const t = text.trim();
    if (!t || busy) return;
    sendMessage({ text: t }, { body });
    setInput("");
    setTab("chat");
  }

  const liveSteps = busy ? (messages.at(-1)?.role === "assistant" ? messages.at(-1)!.parts.map(stepLabel).filter(Boolean) : []) : [];

  return (
    <div className="flex h-[100dvh] flex-col">
      <header className="flex items-center justify-between gap-4 border-b border-line bg-paper/90 px-4 py-3 backdrop-blur sm:px-6">
        <Wordmark />
        <div role="tablist" aria-label="View" className="flex rounded-xl bg-mist p-1 text-sm font-medium lg:hidden">
          {(["chat", "plan"] as const).map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={`relative rounded-lg px-4 py-1.5 capitalize transition-colors ${tab === t ? "bg-paper text-ink shadow-card" : "text-muted"}`}
            >
              {t}
              {t === "plan" && plan && tab !== "plan" && <span className="absolute top-1 right-1.5 size-1.5 rounded-full bg-maroon" aria-label="ready" />}
            </button>
          ))}
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* Chat */}
        <section
          aria-label="Chat"
          className={`min-h-0 w-full flex-col border-line lg:flex lg:w-[420px] lg:shrink-0 lg:border-r xl:w-[460px] ${tab === "chat" ? "flex" : "hidden"}`}
        >
          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6">
            {messages.length === 0 && !initial ? (
              <div className="space-y-2 pt-6">
                <h1 className="font-display text-2xl font-medium text-ink">Where in Sikkim, and for how long?</h1>
                <p className="text-slate">Tell me days, month, who&apos;s coming and what you love. Or ask about permits.</p>
              </div>
            ) : (
              <ChatThread messages={messages} status={status} error={error} onRetry={() => regenerate({ body })} />
            )}
            <div ref={threadEnd} />
          </div>

          <div className="border-t border-line bg-paper px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-6">
            {plan && !busy && (
              <ul className="mb-2.5 flex gap-2 overflow-x-auto pb-1" aria-label="Quick tweaks">
                {TWEAKS.map((t) => (
                  <li key={t} className="shrink-0">
                    <button
                      type="button"
                      onClick={() => send(t)}
                      className="rounded-full border border-line px-3 py-1 text-sm text-slate transition-colors hover:border-pine/40 hover:bg-pine-wash hover:text-pine"
                    >
                      {t}
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-end gap-2 rounded-2xl border border-line bg-mist p-1.5 focus-within:border-maroon/50"
            >
              <label htmlFor="chat-input" className="sr-only">
                Message Denzong
              </label>
              <textarea
                id="chat-input"
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send(input);
                  }
                }}
                placeholder={plan ? "Change something, or ask a question" : "Days, month, who's coming…"}
                className="max-h-36 min-h-10 flex-1 resize-none bg-transparent px-2.5 py-2 text-base text-ink placeholder:text-muted focus:outline-none"
              />
              {busy ? (
                <button
                  type="button"
                  onClick={() => stop()}
                  className="inline-flex size-10 items-center justify-center rounded-xl bg-ink text-paper"
                  aria-label="Stop"
                >
                  <Square className="size-3.5 fill-current" aria-hidden />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="inline-flex size-10 items-center justify-center rounded-xl bg-maroon text-paper transition-[background-color,opacity] hover:bg-maroon-deep disabled:opacity-40"
                  aria-label="Send"
                >
                  <ArrowUp className="size-4" aria-hidden />
                </button>
              )}
            </form>
          </div>
        </section>

        {/* Plan */}
        <section
          aria-label="Your plan"
          className={`min-h-0 flex-1 overflow-y-auto bg-mist lg:block ${tab === "plan" ? "block" : "hidden"}`}
        >
          <div className="mx-auto max-w-3xl px-4 py-6 sm:px-8 sm:py-8">
            {plan ? (
              <div key={plan.slug} className="animate-mist-in">
                <ItineraryView itinerary={plan.itinerary} slug={plan.slug} />
              </div>
            ) : (
              <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
                <Ridge className="h-28 w-full max-w-md opacity-90" />
                <p className="mt-6 font-display text-2xl font-medium text-ink">
                  {busy ? "Checking roads, permits and altitude" : "Your plan will appear here"}
                </p>
                <p className="mt-2 max-w-sm text-slate">
                  {busy
                    ? liveSteps.length
                      ? `${liveSteps.length} check${liveSteps.length === 1 ? "" : "s"} done so far.`
                      : "Starting up…"
                    : "Day by day, with drive times, altitude and the permits you need."}
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
