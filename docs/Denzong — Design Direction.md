# Denzong — Design Direction

Oct 24, 2026 · @Rohan

Denzong should feel like Sikkim, not a generic blue-and-white booking app: calm, trustworthy and local.

## Brand feel

Think misty mornings, monastery colours, and prayer flags against snow: premium but warm, never touristy or kitschy.

**Colours**

| Role | Colour | Use |
| --- | --- | --- |
| Base | Mist white / soft stone | Backgrounds, cards |
| Primary | Monastery maroon | Brand, primary buttons, key highlights |
| Secondary | Pine green, slate | Mountains, forests, secondary UI |
| Accents | Prayer-flag colours (blue, white, red, green, yellow) | Sparingly: small markers, itinerary day dots, a thin strip in the logo |

**Type**

- Headings: a serif with character (Fraunces or similar) for an editorial, story-like feel
- Body and UI: a clean sans (Inter or Manrope) for readability

**Texture and motion**

- Subtle mountain contour lines as background texture
- Mist fade-ins on load
- Signature moment: the route line draws itself along the map as the itinerary generates (also strong Instagram reel content)

## Key screens

The Plan view is the core screen; everything else supports it.

1. **Home:** full-bleed Kanchenjunga photo, one big prompt ("Where in Sikkim, and for how long?"), and quick chips like *4 days · Snow · Monasteries · December*. It should feel like asking a local friend.
2. **Plan view:** chat on the left, itinerary on the right; on mobile they become tabs. Each day card shows:
   - route with drive time (e.g. "Gangtok → Lachung · 6 hrs")
   - altitude badge
   - permit badge, tappable to see the source
   - overnight homestay strip
3. **Homestay page:** big photos, the host's name and face, and price; about people, not hotel rooms.
4. **Explore (camera):** dark, minimal camera view; the result slides up as a card with history and an etiquette tip.
5. **Host dashboard:** very simple and mobile-first, with big buttons and Hindi/Nepali support; only three things: enquiries, calendar, listing.

## UX principles

- **Trust is the design:** a source chip and "verified on" date on every permit or road fact.
- **Mobile-first:** most people plan trips on their phones.
- **Works on weak signal:** itineraries saved offline, since the network drops in North Sikkim.
- **Few choices:** one great plan with tweaks, not 10 options.

## Building the UI with Claude skills

All design and frontend work for Denzong uses the Claude skills already added and saved in Claude, so every screen follows the same direction set out in this doc.

- When asking Claude to build or mock up a screen, invoke those saved skills first, then point to this doc for colours, type and principles.
- Skills in use: *list the saved skill names here** *  "C:\\Users\\Rohan\\.claude\\skills".
