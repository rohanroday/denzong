---
version: 1
slug: "src-app-plan"
primary_target: "src/app/plan"
related_targets: ["src/app/page.tsx","src/app/t","src/app/review"]
---

# Surface brief: traveller app (Home, Plan, Trip share, Review)

Scope: Home (Persuade-light entry: one prompt), Plan view and shared trip page (Operate), Review queue (Operate, internal).
Audience: first-time Indian travellers planning a 4–7 day Sikkim trip on a phone.
Task: describe a trip in one sentence, read a plan they can trust, tweak it, share it.
Constraints: free-tier AI can be slow (30s–3min) or busy; data is unverified draft; no photos or logo yet; English only.
Seed: none (direction pinned by docs/Denzong — Design Direction.md).

## Direction contract

THESIS: A Sikkim trip you can trust at a glance. Refuses the blue-and-white booking-app grid of hotel cards and star ratings; the plan reads like a local friend's route notes with every fact sourced.
OWN-WORLD: Mist-white stone ground, monastery maroon for brand and primary action, pine and slate for structure, prayer-flag blue/white/red/green/yellow only as day dots and a thin strip in the wordmark. Fraunces for headings, Inter for UI. Faint contour lines as texture. Light theme: phones in bright mountain daylight.
STORY: Type a trip → watch the agent check roads, permits and altitude → read day cards with drive time, altitude and permit badges → tap a badge to see the source and its verified status → share the link.
FIRST VIEWPORT: Home: contour-line field with the Kanchenjunga ridge as a drawn line (no stock photo), the prompt "Where in Sikkim, and for how long?", four quick chips. Plan: chat column left, plan column right (tabs on mobile), the route map at the top of the plan.
SIGNATURE: The route line draws itself across the map as the plan arrives, and an altitude profile of sleeping heights runs under the day dots so the acclimatisation climb is visible.
RISK: Free-tier latency makes the wait long; progress must narrate real tool steps, not a spinner.
