# Denzong — Product Requirements Document

Oct 24, 2026 · @Rohan

## Overview

Denzong is an AI travel companion for Sikkim: it plans the trip, answers permit and rules questions with sources, books local homestays, and guides travellers on the ground. Its name comes from Demazong, the Bhutia name for Sikkim.

**One-line pitch:** Tell Denzong your days, budget and mood; get a Sikkim trip that actually works on mountain roads, with permits sorted and homestays booked.

**Vision:** Become the default way people plan and experience Sikkim, while sending more tourist money directly to local homestay owners.

The product has two sides on one shared brain (a curated Sikkim knowledge base plus one AI agent):

- **Traveller side:** Plan, Ask, Stay, Explore
- **Host side:** listing builder, WhatsApp guest copilot, pricing suggestions

## Problem statement

Planning a Sikkim trip is harder than it looks, and generic tools get it wrong. Local homestays, meanwhile, depend on agents and OTAs that take a large cut.

**Travellers**

- Distances look short on a map but mountain roads take 2–3x longer; itineraries from generic AI or blogs are often impossible.
- Permits (protected areas like Nathula, Tsomgo, Gurudongmar, North Sikkim) have rules that differ for Indians and foreigners, and info is scattered.
- Seasonal closures, landslides and snow change what's possible; altitude acclimatisation is often ignored.
- Good homestays in villages are hard to find and book online.
- At sites like monasteries, there's little accessible context on history or etiquette.

**Homestay hosts**

- Weak online presence: poor photos, no written listing, limited English.
- Answering guest queries all day on WhatsApp is time-consuming.
- Pricing is guesswork across seasons.
- Dependence on travel agents for bookings.

## Goals, non-goals and success metrics

The first goal is an itinerary travellers trust enough to follow; bookings and host tools build on that trust.

**Goals**

1. Generate realistic, permit-aware, season-aware itineraries for Sikkim.
2. Answer rules and permit questions with cited sources.
3. Route travellers to local homestays inside their itinerary.
4. Give hosts AI tools that save them time and win more direct bookings.

**Non-goals (for now)**

- Applying for permits on the user's behalf (we guide; we don't file).
- Flights, trains or taxi booking.
- Destinations outside Sikkim (Darjeeling and Bhutan may come later).
- Real-time road status guarantees; we show the latest info we have, with a timestamp.

**Success metrics (targets to set after launch)**

| Metric | What it tells us |
| --- | --- |
| Itineraries generated per week | Top-of-funnel demand |
| % itineraries saved or shared | Trust in the plan |
| Answers with a cited source | Accuracy of the Ask feature |
| Homestay enquiries per 100 itineraries | Plan-to-stay conversion |
| Active hosts onboarded | Supply side health |
| User-reported errors per 100 plans | Quality of the knowledge base |

## Target users and personas

The launch audience is domestic travellers planning their first Sikkim trip; hosts are the second, supply-side user.

| Persona | Who | Needs from Denzong |
| --- | --- | --- |
| First-timer couple | 25–35, metro city, 4–6 day trip, mid budget | A plan that works, snow + scenery, permits explained simply |
| Backpacker | 20–28, solo or friends, tight budget | Cheapest realistic route, shared taxis, homestays |
| Family | Parents + kids or elders | Altitude safety, comfort, fewer long drives |
| Foreign traveller | Any age, limited local context | Clear permit rules for foreigners, culture and etiquette guidance |
| Homestay host | Village family in North/West Sikkim | Listing in good English, help replying to guests, more direct bookings |

## Core features and requirements

Five modules share one knowledge base and one agent. Priority: P0 = MVP, P1 = next, P2 = later.

### 1. Plan — AI trip planner (P0)

- Input by chat or a short form: days, budget (₹), travel month, group type, interests (snow, monasteries, lakes, villages, adventure).
- Output: a day-wise itinerary with stops, drive times on mountain roads, overnight location, rough cost per day.
- Must flag permits needed per day, seasonal closures for the chosen month, and altitude steps (e.g. a night at Lachung before Gurudongmar).
- User can edit ("swap day 3", "cheaper", "less driving") and the plan regenerates.
- Save, share by link, export as PDF.

### 2. Ask — permit and rules assistant (P0)

- Same chat as Plan; answers questions like "Can foreigners visit Gurudongmar?"
- Every factual answer cites a source document and shows when it was last verified.
- If unsure or no source exists, it says so instead of guessing.

### 3. Stay — homestay discovery and booking (P1)

- Homestays appear inside the itinerary for each overnight stop.
- Listing page: photos, price range, amenities, location, host languages.
- MVP: enquiry via WhatsApp or form. Later: instant booking with Razorpay.

### 4. Explore — camera culture guide (P2)

- User photographs a monastery, artwork or landmark; Denzong identifies it using the image plus GPS location.
- Returns history, significance and visitor etiquette, with sources.
- Basic phrase help in Nepali and Bhutia; Lepcha later with community input.

### 5. Host side — homestay copilot (P1–P2)

- Listing builder (P1): host uploads photos and a few details; AI writes the listing in English and Hindi for host review.
- WhatsApp copilot (P2): AI drafts or sends replies to guest questions using the host's details and the knowledge base; host approves.
- Pricing hints (P2): suggested price ranges by season and demand.
- Simple dashboard: enquiries, bookings, calendar.

## Key user flows

The main loop is plan → stay → explore → review; each step feeds the next.

**Flow A — Traveller plans a trip**

1. Opens Denzong, types "4 days, ₹15k, snow + monasteries, December, 2 people."
2. Agent asks one or two clarifying questions only if needed (e.g. starting point: Bagdogra or NJP).
3. Agent checks the knowledge base: routes, December closures, permits, altitude rules.
4. Shows a day-wise itinerary with permit flags and cost estimate.
5. User tweaks ("less driving on day 2"); plan updates.
6. Homestays appear for each overnight; user sends an enquiry.
7. User saves or shares the plan.

**Flow B — Traveller asks a rules question**

1. Asks "Do I need a permit for Tsomgo Lake?"
2. Agent retrieves the relevant rule and answers with source and last-verified date.
3. Offers to add it to their plan.

**Flow C — Host onboards**

1. Host signs up with phone number (OTP).
2. Uploads photos, room count, price range, location pin.
3. AI drafts the listing; host edits and publishes.
4. Enquiries arrive on WhatsApp and the dashboard.

**Flow D — On-trip culture guide**

1. User opens Explore and photographs a monastery.
2. Image + GPS identify the site; app shows history and etiquette.

## Technical architecture

Every surface talks to one API, and every AI answer goes through one agent that reads from the Sikkim knowledge base.

&#91;embedded content: Denzong architecture · 3 apps, 1 agent, 3 data sources\]

The agent never answers permit or route questions from the model's memory; it calls a tool that reads the knowledge base and returns the source.

**Stack**

| Layer | Choice | Why |
| --- | --- | --- |
| Frontend | Next.js + Tailwind | SEO for trip pages, fast to build |
| Mobile (later) | React Native | Reuse Chito experience |
| Backend | Node.js (Express or Next API routes) | One language across the stack |
| Database | Postgres + pgvector | Structured data and embeddings in one place |
| LLM | Claude or OpenAI API with tool calling | Agent with tools, vision for Explore |
| Payments | Razorpay | Already used in Chito |
| Messaging | WhatsApp Business Cloud API | Where hosts and guests already are |
| Hosting | Vercel (web) + a managed Postgres | Low ops effort |

**Core data model**

| Table | Key fields |
| --- | --- |
| users | id, phone, role (traveller/host), name |
| places | id, name, region, altitude\_m, best\_months, permit\_id, lat/lng |
| routes | from\_place, to\_place, drive\_minutes, season, notes, verified\_at |
| permits | id, name, who\_can\_go, how\_to\_apply, source\_url, verified\_at |
| homestays | id, host\_id, place\_id, price\_range, amenities, photos, status |
| trips | id, user\_id, inputs, itinerary (JSON), shared\_slug |
| enquiries | id, trip\_id, homestay\_id, dates, guests, status |
| kb\_chunks | id, text, embedding, source\_url, verified\_at |

## Knowledge base and data strategy

The data, not the AI model, is Denzong's moat: accurate, local, and dated.

| Dataset | Contents | Source | Refresh |
| --- | --- | --- | --- |
| Places | \~50 places at launch: name, region, altitude, best months, highlights | Field knowledge, tourism dept, verified blogs | Quarterly |
| Routes | Point-to-point drive times on real roads, by season | Local drivers, own trips, maps | Quarterly + after monsoon |
| Permits | Which places need which permit, who can go, how to get it | Official tourism/permit pages | Monthly, dated |
| Seasons and closures | Snow months, monsoon risk, typical closures | Official notices, local news | Monthly in peak season |
| Monasteries and culture | History, significance, etiquette | Official sources, books, community input | As added |
| Homestays | Host-provided listing data | Hosts | Live |

**Rules for the knowledge base**

- Every fact carries a source and a last-verified date.
- Structured data (routes, permits) lives in tables, not only in text, so the agent can compute times and costs.
- Free-text documents (rules, history) are chunked and embedded for RAG.
- Users can flag "this is wrong"; flags go to a review queue.

## Phased roadmap and MVP scope

The MVP is Phase 1 only: the planner and permit assistant in one chat, targeted at 2–3 weeks of build time.

&#91;embedded content: Denzong roadmap · 4 phases, 3 gates\]

Each gate is a check before moving on; exact thresholds get set once Phase 1 has real users.

**Phase 1 MVP checklist**

- [ ] Curate \~50 places, routes with drive times, permits, seasonal closures
- [ ] Postgres + pgvector schema and seed data
- [ ] Agent with tools: planItinerary, checkPermit, getRouteTime
- [ ] Chat UI with day-wise itinerary cards
- [ ] Source citations and last-verified dates on answers
- [ ] Save and share itinerary by link
- [ ] "Report a mistake" button and review queue
- [ ] Test with 10–20 real travellers before Phase 2

## Business model, risks and open questions

Planning stays free; revenue comes from bookings and host tools.

**Revenue streams**

- Commission on homestay bookings (aim lower than OTAs to win hosts).
- Host subscription for the WhatsApp copilot and pricing tools.
- Featured listings for homestays and local tour operators.
- Later: partner commissions from verified taxi and tour operators.

**Risks and mitigations**

| Risk | Mitigation |
| --- | --- |
| AI gives a wrong permit or road answer | Cite sources, show last-verified date, refuse when unsure, user flags |
| Data goes stale (monsoon, rule changes) | Refresh schedule, dated facts, review queue |
| Few hosts at launch | Onboard 10–20 hosts manually in one region first |
| LLM costs grow with usage | Cache common itineraries, use smaller models for simple turns |
| Camera guide misidentifies a site | Combine GPS with the image; show confidence; ask user to confirm |
| Cultural sensitivity (Lepcha, Bhutia heritage) | Consult community members; credit sources |

**Open questions**

- [ ] Which region to launch hosts in first: North Sikkim (Lachung/Lachen) or West (Pelling)?
- [ ] Web-first or app-first for the MVP?
- [ ] Which LLM provider, and monthly budget for API costs?
- [ ] Trademark filing for Denzong: confirm availability and classes (9, 39, 42, 43).
- [ ] Booking model: enquiry-only vs. instant booking with payment?
