# Denzong

AI travel companion for Sikkim. Phase 1 (MVP): **Plan** a realistic day-wise trip and **Ask** permit and rules questions, in one chat. Product and design docs live in [`docs/`](docs/).

## Run it

You need Node.js 22+ and a free Gemini API key from [Google AI Studio](https://aistudio.google.com).

```bash
npm install
```

Copy `.env.example` to `.env.local` and paste your key after `GOOGLE_GENERATIVE_AI_API_KEY=`. Then:

```bash
npm run dev
```

Open http://localhost:3000.

### Database

- **No `DATABASE_URL`:** the app uses PGlite (real Postgres running inside the app) in `.data/`. It needs no setup and reloads the knowledge base on every start.
- **With `DATABASE_URL` (Supabase):** the app uses that database. Set it up once, and again whenever you change `src/data/`:

```bash
npm run db:setup
```

This creates the tables, turns on row level security (so Supabase's public API can't read or write them), and replaces the knowledge base with `src/data/`. Trips and reports are never touched.

## Pages

| URL | What it is |
| --- | --- |
| `/` | Home: one prompt and quick chips |
| `/plan` | Chat on the left, itinerary on the right (tabs on phones) |
| `/t/<code>` | Shared, read-only trip plan |
| `/review` | Mistakes reported by travellers (open in development only, no login yet) |
| `/api/dev/check` | Development self-test of the plan validator, no AI calls |

## How it works

1. The AI (Gemini via the AI SDK) drafts a skeleton plan: which places each day, where to sleep.
2. `src/lib/itinerary.ts` checks it in plain code against the knowledge base: real road times, daily driving limits, altitude steps, permits for the traveller's nationality, seasonal closures and budget. Failures go back to the AI to fix.
3. Only a plan that passes is saved and shown. Drive times, costs and permits on the cards come from the database, not from the AI.

Every fact carries a source and a verified date. **All seed data in `src/data/` is an unverified draft.** The app labels it as draft until someone checks each row and sets `verifiedAt`.

## Free-tier limits

The free Gemini tier currently allows about **20 requests per model per day**. A plan takes roughly 2–4 requests and a question 1–2. When a model is busy or out of quota, the app falls back to the next model in `FALLBACK_MODELS`. To change models, edit `.env.local`; no code change is needed.

## Project map

- `src/data/`: knowledge base seed (places, routes, permits, closures, guidance). Edit here, then restart (local database) or run `npm run db:setup` (Supabase).
- `src/db/`: schema and database setup.
- `src/lib/agent/`: AI instructions, tools and model fallback.
- `src/lib/itinerary.ts`: the plan validator.
- `src/components/`: UI. Design direction is in `docs/Denzong — Design Direction.md`.

## Not built yet

Homestays and booking (Phase 2), offline saving (PWA), the camera culture guide, accounts, and deployment to Vercel.
