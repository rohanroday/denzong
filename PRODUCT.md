# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary (confirmed): first-time Indian travellers to Sikkim, such as couples, families and groups of friends from metro cities, planning a 4–7 day trip, mostly on their phones. They want a plan that actually works on mountain roads, with permits explained simply.

Later audiences, from the PRD and not designed for yet: backpackers, foreign travellers, and homestay hosts (host side is Phase 2).

## Product Purpose

Denzong is an AI travel companion for Sikkim. In Phase 1 (MVP) it does two things in one chat:

- **Plan**: turns days, month, group and budget into a realistic day-wise itinerary.
- **Ask**: answers permit and rules questions with sources.

Success means travellers trust the plan enough to follow, save and share it. The name comes from Demazong, the Bhutia name for Sikkim.

## Positioning

Generic AI and blogs produce plans that are impossible on Sikkim's roads. Denzong's facts (drive times, permits, closures, altitude) come from a curated, dated Sikkim knowledge base, and code checks every plan before the traveller sees it. Every fact shows its source and when it was last verified. The data, not the model, is the moat.

## Operating Context

- Travellers plan at home on a phone, then use the plan on the road, where the network is weak in North Sikkim.
- Permits are arranged through registered Gangtok tour operators; Denzong explains them and does not apply for them.
- Plans are shared by link with travel companions.

## Capabilities and Constraints

- Stack: Next.js 16 (App Router, Cache Components) + Tailwind 4, AI SDK 7 with Gemini free tier (model swappable via env), PGlite locally (Postgres + Drizzle), MapLibre with free OpenFreeMap tiles.
- Budget: ₹0 to run during development; free-tier AI is rate-limited and sometimes busy, so the UI must handle slow or failed answers gracefully.
- Knowledge base is draft data: every row is unverified until checked. The UI must say so honestly rather than show fake "verified" dates.
- Language: English only at launch. Hindi and Nepali come with the host side.
- Not in scope for the MVP: bookings, payments, homestays (Phase 2), camera guide (Phase 3), accounts and login.

## Brand Commitments

- Name: Denzong. Calm, trustworthy, local; never touristy or kitschy.
- The binding visual direction lives in `docs/Denzong — Design Direction.md` (palette, fonts, motion, key screens).
- No logo yet: use a type wordmark. No photos yet: use clearly marked placeholders, never stock photos passed off as real.

## Evidence on Hand

- Product docs: `docs/Denzong — Product Requirements Document.md`, `docs/Denzong — Design Direction.md`.
- Knowledge base drafts: `src/data/` (46 places, 68 routes, 8 permits, closures, 7 guidance docs), all unverified.
- No users, testimonials, partner hosts, press or photos yet. Do not invent any.

## Product Principles

1. Trust is the design: every permit, road or altitude fact carries a source and a verified status.
2. One great plan with tweaks, not ten options.
3. Refuse rather than guess when the knowledge base has no answer.
4. Mobile-first and calm: built for a phone on a mountain road.

## Accessibility & Inclusion

Plain English for non-native speakers. Readable on small, low-end phones and in bright outdoor light. Respect reduced-motion preferences.
