// DRAFT SEED DATA. Seasonal closures and free-text guidance used by the Ask
// feature. Unverified: confirm against official notices and local operators.

type ClosureSeed = {
  placeId: string;
  months: number[];
  severity: "closed" | "risky";
  reason: string;
};

const MONSOON = [6, 7, 8, 9];
const NORTH = ["chungthang", "lachung", "lachen", "yumthang", "thangu", "dzongu"];

export const closureSeeds: ClosureSeed[] = [
  { placeId: "gurudongmar", months: [12, 1, 2, 3], severity: "risky", reason: "Heavy snow often blocks the road beyond Thangu; trips may be cancelled on the day." },
  { placeId: "chopta-valley", months: [12, 1, 2, 3], severity: "risky", reason: "Snow-bound in deep winter." },
  { placeId: "zero-point", months: [12, 1, 2, 3], severity: "risky", reason: "Road above Yumthang is usually snowed in; vehicles turn back where the snow starts." },
  { placeId: "nathula", months: [1, 2], severity: "risky", reason: "Frequent closures after snowfall; permits may not be issued." },
  { placeId: "kupup", months: [1, 2], severity: "risky", reason: "Silk Route upper road often blocked by snow." },
  { placeId: "varsey", months: [6, 7, 8, 9, 12, 1], severity: "risky", reason: "Slippery leech-heavy trail in monsoon; very cold and icy in winter." },
  ...NORTH.map((placeId) => ({
    placeId,
    months: MONSOON,
    severity: "risky" as const,
    reason: "Monsoon landslides on the North Sikkim highway; permits are sometimes suspended for days.",
  })),
  { placeId: "gurudongmar", months: MONSOON, severity: "risky", reason: "Monsoon landslides on the North Sikkim highway; permits are sometimes suspended for days." },
  { placeId: "zuluk", months: MONSOON, severity: "risky", reason: "Monsoon landslides and fog on the Silk Route." },
];

type KbSeed = { id: string; title: string; topic: string; body: string };

export const kbSeeds: KbSeed[] = [
  {
    id: "altitude-basics",
    title: "Altitude sickness and acclimatisation in Sikkim",
    topic: "safety",
    body:
      "Places above about 3,500 m (Tsomgo, Nathu La, Yumthang, Zero Point, Gurudongmar) can cause altitude sickness: headache, nausea, breathlessness, poor sleep. " +
      "Go up gradually: sleep at a middle altitude such as Lachung or Lachen (around 2,700 m) before visiting Zero Point or Gurudongmar, never go there on the same day as leaving Gangtok. " +
      "Spend only a short time at very high places, keep warm, drink water, avoid alcohol. Descend at once if symptoms get worse. " +
      "Young children, elderly travellers and people with heart or lung conditions should consult a doctor and may want to skip Gurudongmar and Zero Point.",
  },
  {
    id: "permits-overview",
    title: "How permits work in Sikkim",
    topic: "permits",
    body:
      "Indian nationals can enter Sikkim freely but need Protected Area Permits for Tsomgo Lake, Nathu La, the Silk Route (Zuluk), North Sikkim (Lachung, Lachen, Yumthang, Gurudongmar) and Dzongu. " +
      "These are arranged through registered tour operators in Gangtok, usually a day or two in advance, with photo ID and passport photos. " +
      "Foreign nationals need a Restricted Area Permit just to enter Sikkim, and can visit some protected areas (Tsomgo, Lachung, Yumthang, Lachen) only in groups of two or more through a registered agency. " +
      "Nathu La, Gurudongmar and Zero Point are closed to foreign nationals. Denzong explains the rules; it does not apply for permits on your behalf.",
  },
  {
    id: "monastery-etiquette",
    title: "Monastery etiquette",
    topic: "culture",
    body:
      "Walk clockwise around stupas, prayer wheels and temples, and turn prayer wheels clockwise. Remove shoes and hats before entering prayer halls. " +
      "Dress modestly, with shoulders and knees covered. Ask before photographing monks or the inside of prayer halls; many forbid photos inside. " +
      "Do not point your feet at altars or touch religious objects. Keep your voice low during prayers. A small offering at the donation box is welcome.",
  },
  {
    id: "best-time",
    title: "Best time to visit Sikkim",
    topic: "seasons",
    body:
      "March to May: spring, rhododendrons in Yumthang and Varsey, clear-ish skies, busy season. " +
      "June to September: monsoon. Lush and quiet, but landslides often close roads, especially in North Sikkim; keep buffer days. " +
      "October to mid-December: the clearest mountain views and stable roads; the best all-round season. " +
      "Mid-December to February: snow at Tsomgo, Lachung and Yumthang; very cold; Gurudongmar, Zero Point and Nathu La are often blocked.",
  },
  {
    id: "getting-around",
    title: "Getting to and around Sikkim",
    topic: "transport",
    body:
      "Most travellers arrive at Bagdogra Airport or New Jalpaiguri (NJP) railway station and take a taxi to Gangtok, about 4–5 hours. " +
      "Shared taxis are the cheapest option and run from Siliguri and NJP; reserved taxis cost more but are flexible. " +
      "Inside Sikkim, North Sikkim and Tsomgo trips are almost always done as permit-included packages with a local driver. " +
      "Mountain roads are slow: plan on 25–30 km per hour on average, and leave margin for landslides and checkposts.",
  },
  {
    id: "plastic-and-environment",
    title: "Responsible travel and plastic",
    topic: "rules",
    body:
      "Sikkim restricts single-use plastics and styrofoam in many places, and some areas restrict packaged water bottles. " +
      "Carry a refillable bottle, take your rubbish back with you from lakes and passes, and do not feed animals at high-altitude sites.",
  },
  {
    id: "money-network",
    title: "Cash, ATMs and phone network",
    topic: "practical",
    body:
      "ATMs are reliable in Gangtok, Namchi and Pelling but rare in North Sikkim; carry cash for Lachung, Lachen and the Silk Route. " +
      "Mobile network is patchy in North Sikkim and Zuluk. Save your itinerary offline and share your plan with someone before you go.",
  },
];
