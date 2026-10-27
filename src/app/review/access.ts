import "server-only";

// The review queue has no login yet. It is open in development and hidden in
// production unless ENABLE_REVIEW=true. Add real auth before deploying it.
export function reviewEnabled() {
  return process.env.NODE_ENV !== "production" || process.env.ENABLE_REVIEW === "true";
}
