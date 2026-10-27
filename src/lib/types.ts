// Shapes shared by the server (agent, validator) and the client (cards, map).

export type Nationality = "indian" | "foreign";
export type GroupType = "solo" | "couple" | "friends" | "family";

export type TripInputs = {
  days: number;
  month: number; // 1–12
  travellers: number;
  groupType: GroupType;
  nationality: Nationality;
  budgetInr?: number; // whole trip, all travellers
  startFrom: string; // place id
  endAt: string; // place id
  interests: string[];
};

// A fact shown with its provenance. verifiedAt is null for unverified drafts.
export type Source = { label: string; url: string; verifiedAt: string | null };

export type PermitInfo = {
  id: string;
  name: string;
  rule: string; // the rule for this traveller's nationality
  howToApply: string;
  allowed: boolean;
  source: Source;
};

export type StopInfo = {
  id: string;
  name: string;
  altitudeM: number;
  lat: number;
  lng: number;
  permitId: string | null;
};

export type Leg = {
  from: string;
  to: string;
  minutes: number;
  path: string[]; // place ids including from and to
  coords: [lng: number, lat: number][]; // one per path place, for the map
  notes: string[];
};

export type ItineraryDay = {
  day: number;
  title: string;
  notes: string;
  startAt: StopInfo;
  stops: StopInfo[];
  overnight: StopInfo;
  isLastDay: boolean;
  legs: Leg[];
  driveMinutes: number; // after any seasonal slowdown
  maxAltitudeM: number;
  permits: PermitInfo[];
  warnings: string[];
  cost: { min: number; max: number };
};

export type Itinerary = {
  title: string;
  summary: string;
  inputs: TripInputs;
  days: ItineraryDay[];
  totals: { driveMinutes: number; costMin: number; costMax: number };
  permits: PermitInfo[];
  warnings: string[];
  dataStatus: "draft" | "verified"; // draft while any fact used is unverified
};

export type PresentItineraryResult =
  | { ok: true; slug: string; itinerary: Itinerary }
  | { ok: false; errors: string[]; warnings: string[] };
