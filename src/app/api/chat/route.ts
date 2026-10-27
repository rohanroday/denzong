import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  isStepCount,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from "ai";
import { plannerInstructions } from "@/lib/agent/instructions";
import { plannerModel } from "@/lib/agent/model";
import { createTools } from "@/lib/agent/tools";
import { loadKb } from "@/lib/kb";

// Free-tier models can be slow, and a plan may take a few validator rounds.
// Vercel Hobby allows up to 300s.
export const maxDuration = 180;

function friendlyError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  if (/per day|daily/i.test(message)) {
    return "Denzong has used up today's free AI allowance. It resets every day, so please try again later.";
  }
  if (/quota|rate|429|exhausted|demand|503|too long/i.test(message)) {
    return "Denzong is getting a lot of questions right now (free-tier limit or busy servers). Please try again in a minute.";
  }
  console.error("[chat]", error);
  return "Something went wrong on our side. Please try again.";
}

export async function POST(req: Request) {
  const { messages, tripSlug }: { messages: UIMessage[]; tripSlug?: string } = await req.json();

  const tools = createTools({ tripSlug });
  const kb = await loadKb();
  const result = streamText({
    model: plannerModel(),
    // plannerModel already falls back across models; one retry of the whole chain is enough.
    maxRetries: 1,
    instructions: plannerInstructions(new Date(), kb),
    messages: await convertToModelMessages(messages),
    tools,
    // Draft, a few validator rounds, and the reply. Each step is one request
    // against a small free-tier daily quota, so keep this tight.
    stopWhen: isStepCount(6),
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream, tools, onError: friendlyError }),
  });
}
