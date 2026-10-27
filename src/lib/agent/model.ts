import "server-only";
import { google } from "@ai-sdk/google";
import type { LanguageModelV4, LanguageModelV4CallOptions } from "@ai-sdk/provider";

// Free-tier Gemini models are often "experiencing high demand" (503) or slow
// to answer. This model tries each configured model in turn, moving on when
// one fails or doesn't start answering within the timeout.

const START_TIMEOUT_MS = 30_000;

async function withStartTimeout<T>(
  options: LanguageModelV4CallOptions,
  call: (options: LanguageModelV4CallOptions) => PromiseLike<T>,
) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(new Error("Model took too long to start")), START_TIMEOUT_MS);
  const signal = options.abortSignal ? AbortSignal.any([options.abortSignal, controller.signal]) : controller.signal;
  try {
    return await call({ ...options, abortSignal: signal });
  } finally {
    clearTimeout(timer);
  }
}

export function fallbackModel(modelIds: string[]): LanguageModelV4 {
  const models = modelIds.map((id) => google(id) as unknown as LanguageModelV4);

  async function attempt<T>(run: (m: LanguageModelV4, o: LanguageModelV4CallOptions) => PromiseLike<T>, options: LanguageModelV4CallOptions) {
    let lastError: unknown;
    for (const m of models) {
      if (options.abortSignal?.aborted) break;
      try {
        return await withStartTimeout(options, (o) => run(m, o));
      } catch (error) {
        lastError = error;
        console.warn(`[model] ${m.modelId} failed, trying next:`, error instanceof Error ? error.message : error);
      }
    }
    throw lastError;
  }

  return {
    specificationVersion: "v4",
    provider: "google-fallback",
    modelId: modelIds.join(","),
    supportedUrls: models[0].supportedUrls,
    doGenerate: (options) => attempt((m, o) => m.doGenerate(o), options),
    doStream: (options) => attempt((m, o) => m.doStream(o), options),
  };
}

export function plannerModel() {
  const primary = process.env.PLANNER_MODEL ?? "gemini-3.8-flash";
  const fallbacks = (process.env.FALLBACK_MODELS ?? "gemini-3.6-flash,gemini-3.5-flash-lite")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return fallbackModel([primary, ...fallbacks]);
}
