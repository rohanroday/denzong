// DRAFT SEED DATA. Altitudes, coordinates and costs are approximate and
// unverified (verifiedAt = null). Check each row against an official source or
// local knowledge, then set its sourceUrl and verifiedAt.

export const DRAFT_SOURCE = "draft://denzong-seed";
export const SIKKIM_TOURISM = "https://www.sikkimtourism.gov.in/";

type PlaceSeed = {
  id: string;
  name: string;
  region: "East" | "North" | "West" | "South" | "Gateway";
  kind: string;
  altitudeM: number;
  lat: number;
  lng: number;
  bestMonths: number[];
  tags: string[];
  permitId?: string;
  canOvernight?: boolean;
  stayPerNight?: number;
  highlights: string;
};

const ALL_YEAR = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export const placeSeeds: PlaceSeed[] = [
  // Gateways
  { id: "bagdogra", name: "Bagdogra Airport", region: "Gateway", kind: "gateway", altitudeM: 126, lat: 26.681, lng: 88.328, bestMonths: ALL_YEAR, tags: ["airport"], canOvernight: true, stayPerNight: 2500, highlights: "Nearest major airport to Sikkim, in West Bengal." },
  { id: "njp", name: "New Jalpaiguri (NJP) / Siliguri", region: "Gateway", kind: "gateway", altitudeM: 120, lat: 26.683, lng: 88.443, bestMonths: ALL_YEAR, tags: ["railway"], canOvernight: true, stayPerNight: 2000, highlights: "Main railway station for Sikkim; shared and reserved taxis leave from here." },
  { id: "pakyong", name: "Pakyong Airport", region: "Gateway", kind: "gateway", altitudeM: 1400, lat: 27.227, lng: 88.587, bestMonths: [3, 4, 5, 10, 11], tags: ["airport"], highlights: "Sikkim's own airport near Gangtok; flights are few and often weather-cancelled." },

  // East Sikkim
  { id: "gangtok", name: "Gangtok", region: "East", kind: "town", altitudeM: 1650, lat: 27.3314, lng: 88.6138, bestMonths: ALL_YEAR, tags: ["city", "food", "shopping", "base"], canOvernight: true, stayPerNight: 2500, highlights: "Capital and main base. MG Marg, cafes, permits and taxis for North and East Sikkim." },
  { id: "enchey", name: "Enchey Monastery", region: "East", kind: "monastery", altitudeM: 1850, lat: 27.3363, lng: 88.619, bestMonths: ALL_YEAR, tags: ["monasteries"], highlights: "Nyingma monastery above Gangtok, known for its annual Cham dance." },
  { id: "rumtek", name: "Rumtek Monastery", region: "East", kind: "monastery", altitudeM: 1550, lat: 27.2886, lng: 88.5612, bestMonths: ALL_YEAR, tags: ["monasteries"], highlights: "Seat of the Karma Kagyu lineage in exile; large monastery complex near Gangtok. ID check at the gate." },
  { id: "hanuman-tok", name: "Hanuman Tok", region: "East", kind: "viewpoint", altitudeM: 2194, lat: 27.354, lng: 88.638, bestMonths: [10, 11, 12, 1, 2, 3, 4], tags: ["views", "temples"], highlights: "Temple and viewpoint above Gangtok with Kanchenjunga views on clear mornings." },
  { id: "tsomgo", name: "Tsomgo (Changu) Lake", region: "East", kind: "lake", altitudeM: 3753, lat: 27.375, lng: 88.764, bestMonths: [1, 2, 3, 4, 5, 10, 11, 12], tags: ["lakes", "snow"], permitId: "pap-east", highlights: "Glacial lake on the Nathu La road; frozen and snowy in winter." },
  { id: "baba-mandir", name: "Baba Harbhajan Singh Mandir", region: "East", kind: "temple", altitudeM: 4000, lat: 27.364, lng: 88.82, bestMonths: [3, 4, 5, 10, 11, 12], tags: ["snow", "temples"], permitId: "pap-nathula", highlights: "Army shrine near Nathu La, usually combined with Tsomgo." },
  { id: "nathula", name: "Nathu La Pass", region: "East", kind: "pass", altitudeM: 4310, lat: 27.3863, lng: 88.8307, bestMonths: [3, 4, 5, 10, 11], tags: ["snow", "border"], permitId: "pap-nathula", highlights: "India–China border pass. Indian nationals only; separate permit; closed some weekdays." },
  { id: "aritar", name: "Aritar", region: "East", kind: "village", altitudeM: 1400, lat: 27.19, lng: 88.672, bestMonths: [3, 4, 5, 10, 11, 12], tags: ["lakes", "villages"], canOvernight: true, stayPerNight: 2000, highlights: "Quiet village with Lampokhari Lake; first stop on the Silk Route circuit." },
  { id: "zuluk", name: "Zuluk", region: "East", kind: "village", altitudeM: 2850, lat: 27.252, lng: 88.778, bestMonths: [3, 4, 5, 10, 11, 12], tags: ["villages", "views", "snow"], permitId: "pap-silk-route", canOvernight: true, stayPerNight: 1800, highlights: "Old Silk Route village famous for the zig-zag road; basic homestays." },
  { id: "thambi", name: "Thambi Viewpoint", region: "East", kind: "viewpoint", altitudeM: 3400, lat: 27.27, lng: 88.8, bestMonths: [3, 4, 5, 10, 11, 12], tags: ["views"], permitId: "pap-silk-route", highlights: "Viewpoint over the Zuluk loops and the Kanchenjunga range." },
  { id: "kupup", name: "Kupup (Elephant Lake)", region: "East", kind: "lake", altitudeM: 4000, lat: 27.33, lng: 88.83, bestMonths: [4, 5, 10, 11], tags: ["lakes", "snow"], permitId: "pap-silk-route", highlights: "High lake shaped like an elephant, on the Silk Route between Zuluk and Nathu La." },

  // North Sikkim
  { id: "kabi", name: "Kabi Lungchok", region: "North", kind: "viewpoint", altitudeM: 1400, lat: 27.42, lng: 88.6, bestMonths: ALL_YEAR, tags: ["culture"], highlights: "Site of the historic Lepcha–Bhutia blood-brotherhood treaty, on the road north." },
  { id: "seven-sisters", name: "Seven Sisters Waterfall", region: "North", kind: "viewpoint", altitudeM: 1600, lat: 27.43, lng: 88.6, bestMonths: [6, 7, 8, 9, 10], tags: ["waterfalls"], highlights: "Roadside waterfall on the way to Mangan; strongest in monsoon." },
  { id: "phodong", name: "Phodong Monastery", region: "North", kind: "monastery", altitudeM: 1400, lat: 27.41, lng: 88.58, bestMonths: ALL_YEAR, tags: ["monasteries"], highlights: "Kagyu monastery on the North Sikkim highway." },
  { id: "mangan", name: "Mangan", region: "North", kind: "town", altitudeM: 950, lat: 27.508, lng: 88.531, bestMonths: [3, 4, 5, 10, 11, 12], tags: ["base"], canOvernight: true, stayPerNight: 1800, highlights: "North Sikkim district HQ; gateway to Dzongu." },
  { id: "dzongu", name: "Dzongu", region: "North", kind: "village", altitudeM: 1200, lat: 27.56, lng: 88.48, bestMonths: [3, 4, 5, 10, 11], tags: ["villages", "culture"], permitId: "dzongu", canOvernight: true, stayPerNight: 2200, highlights: "Lepcha reserve with village homestays, hot springs and waterfalls. Separate permit." },
  { id: "chungthang", name: "Chungthang", region: "North", kind: "town", altitudeM: 1790, lat: 27.604, lng: 88.645, bestMonths: [3, 4, 5, 10, 11], tags: ["base"], permitId: "pap-north", highlights: "Junction where the roads to Lachung and Lachen split." },
  { id: "lachung", name: "Lachung", region: "North", kind: "village", altitudeM: 2700, lat: 27.689, lng: 88.744, bestMonths: [3, 4, 5, 10, 11, 12], tags: ["villages", "snow", "base"], permitId: "pap-north", canOvernight: true, stayPerNight: 2500, highlights: "Mountain village and base for Yumthang Valley and Zero Point." },
  { id: "yumthang", name: "Yumthang Valley", region: "North", kind: "valley", altitudeM: 3564, lat: 27.826, lng: 88.696, bestMonths: [3, 4, 5, 10, 11], tags: ["snow", "flowers", "valleys"], permitId: "pap-north", highlights: "'Valley of flowers': rhododendrons in spring, snow in winter, hot spring nearby." },
  { id: "zero-point", name: "Zero Point (Yumesamdong)", region: "North", kind: "viewpoint", altitudeM: 4700, lat: 27.88, lng: 88.72, bestMonths: [4, 5, 10, 11], tags: ["snow"], permitId: "pap-zero-point", highlights: "End of the road above Yumthang; snow most of the year. Extra charge; access depends on snow." },
  { id: "lachen", name: "Lachen", region: "North", kind: "village", altitudeM: 2750, lat: 27.717, lng: 88.555, bestMonths: [3, 4, 5, 10, 11], tags: ["villages", "base"], permitId: "pap-north", canOvernight: true, stayPerNight: 2500, highlights: "Village and overnight base for Gurudongmar Lake; early-morning departures." },
  { id: "thangu", name: "Thangu", region: "North", kind: "village", altitudeM: 3900, lat: 27.89, lng: 88.53, bestMonths: [4, 5, 10, 11], tags: ["snow"], permitId: "pap-north", highlights: "High hamlet on the way to Gurudongmar; short breakfast stop." },
  { id: "chopta-valley", name: "Chopta Valley", region: "North", kind: "valley", altitudeM: 3950, lat: 27.9, lng: 88.55, bestMonths: [4, 5, 10, 11], tags: ["snow", "valleys"], permitId: "pap-gurudongmar", highlights: "Open valley near Thangu, often combined with Gurudongmar." },
  { id: "gurudongmar", name: "Gurudongmar Lake", region: "North", kind: "lake", altitudeM: 5183, lat: 28.024, lng: 88.711, bestMonths: [4, 5, 10, 11], tags: ["lakes", "snow"], permitId: "pap-gurudongmar", highlights: "One of the highest lakes in the world; sacred to Buddhists and Sikhs. Very high altitude: short visit only." },

  // West Sikkim
  { id: "pelling", name: "Pelling", region: "West", kind: "town", altitudeM: 2150, lat: 27.3, lng: 88.235, bestMonths: [3, 4, 5, 10, 11, 12], tags: ["views", "base"], canOvernight: true, stayPerNight: 2500, highlights: "Best close-up views of Kanchenjunga at sunrise; skywalk and monasteries nearby." },
  { id: "pemayangtse", name: "Pemayangtse Monastery", region: "West", kind: "monastery", altitudeM: 2085, lat: 27.3, lng: 88.25, bestMonths: ALL_YEAR, tags: ["monasteries"], highlights: "One of Sikkim's oldest and most important Nyingma monasteries." },
  { id: "rabdentse", name: "Rabdentse Ruins", region: "West", kind: "viewpoint", altitudeM: 2000, lat: 27.293, lng: 88.255, bestMonths: ALL_YEAR, tags: ["history"], highlights: "Ruins of Sikkim's second royal capital, a short forest walk from the road." },
  { id: "sangachoeling", name: "Sangachoeling Monastery", region: "West", kind: "monastery", altitudeM: 2150, lat: 27.305, lng: 88.24, bestMonths: [3, 4, 5, 10, 11, 12], tags: ["monasteries"], highlights: "Ridge-top monastery above Pelling, reached by a steep walk." },
  { id: "khecheopalri", name: "Khecheopalri Lake", region: "West", kind: "lake", altitudeM: 1700, lat: 27.35, lng: 88.188, bestMonths: ALL_YEAR, tags: ["lakes", "sacred"], highlights: "Sacred 'wishing lake' in the forest; quiet, with a short walk from parking." },
  { id: "kanchenjunga-falls", name: "Kanchenjunga Falls", region: "West", kind: "viewpoint", altitudeM: 1700, lat: 27.34, lng: 88.21, bestMonths: [6, 7, 8, 9, 10], tags: ["waterfalls"], highlights: "Roadside waterfall between Pelling and Yuksom." },
  { id: "yuksom", name: "Yuksom", region: "West", kind: "village", altitudeM: 1780, lat: 27.376, lng: 88.22, bestMonths: [3, 4, 5, 10, 11, 12], tags: ["villages", "history", "trekking", "base"], canOvernight: true, stayPerNight: 2000, highlights: "First capital of Sikkim and trailhead for the Goecha La trek; relaxed village homestays." },
  { id: "dubdi", name: "Dubdi Monastery", region: "West", kind: "monastery", altitudeM: 2100, lat: 27.37, lng: 88.23, bestMonths: [3, 4, 5, 10, 11, 12], tags: ["monasteries", "history"], highlights: "Believed to be Sikkim's oldest monastery; about an hour's uphill walk from Yuksom." },
  { id: "tashiding", name: "Tashiding Monastery", region: "West", kind: "monastery", altitudeM: 1465, lat: 27.31, lng: 88.29, bestMonths: ALL_YEAR, tags: ["monasteries", "sacred"], highlights: "Hilltop monastery considered among Sikkim's holiest; Bumchu festival." },
  { id: "rinchenpong", name: "Rinchenpong", region: "West", kind: "village", altitudeM: 1700, lat: 27.24, lng: 88.27, bestMonths: [3, 4, 5, 10, 11, 12], tags: ["villages", "views"], canOvernight: true, stayPerNight: 2000, highlights: "Quiet village with a monastery and wide Kanchenjunga views; good for homestays." },
  { id: "uttarey", name: "Uttarey", region: "West", kind: "village", altitudeM: 1950, lat: 27.25, lng: 88.13, bestMonths: [3, 4, 5, 10, 11, 12], tags: ["villages"], canOvernight: true, stayPerNight: 1800, highlights: "Remote village near the Nepal border with forest walks and homestays." },
  { id: "okhrey", name: "Okhrey", region: "West", kind: "village", altitudeM: 2400, lat: 27.15, lng: 88.11, bestMonths: [3, 4, 10, 11], tags: ["villages", "flowers"], canOvernight: true, stayPerNight: 1800, highlights: "Sherpa village and base for Varsey; rhododendrons in spring." },
  { id: "varsey", name: "Varsey Rhododendron Sanctuary", region: "West", kind: "park", altitudeM: 3000, lat: 27.17, lng: 88.11, bestMonths: [3, 4], tags: ["flowers", "trekking"], highlights: "Rhododendron forest reached by a ~4 km walk from Hilley; peak bloom March–April." },

  // South Sikkim
  { id: "namchi", name: "Namchi", region: "South", kind: "town", altitudeM: 1315, lat: 27.165, lng: 88.364, bestMonths: ALL_YEAR, tags: ["base", "temples"], canOvernight: true, stayPerNight: 2200, highlights: "South Sikkim HQ; base for Samdruptse and Char Dham. Easy roads, good for families." },
  { id: "samdruptse", name: "Samdruptse (Guru Padmasambhava statue)", region: "South", kind: "monastery", altitudeM: 2100, lat: 27.18, lng: 88.37, bestMonths: ALL_YEAR, tags: ["monasteries", "views"], highlights: "Giant statue of Guru Rinpoche on a hilltop above Namchi." },
  { id: "char-dham", name: "Char Dham (Siddhesvara Dham)", region: "South", kind: "temple", altitudeM: 1300, lat: 27.16, lng: 88.37, bestMonths: ALL_YEAR, tags: ["temples"], highlights: "Pilgrimage complex with replicas of the four Hindu dhams and a large Shiva statue." },
  { id: "ravangla", name: "Ravangla", region: "South", kind: "town", altitudeM: 2100, lat: 27.306, lng: 88.364, bestMonths: [3, 4, 5, 10, 11, 12], tags: ["monasteries", "views", "base"], canOvernight: true, stayPerNight: 2200, highlights: "Small hill town between Gangtok and Pelling; home of Buddha Park." },
  { id: "buddha-park", name: "Buddha Park (Tathagata Tsal)", region: "South", kind: "park", altitudeM: 2100, lat: 27.29, lng: 88.37, bestMonths: ALL_YEAR, tags: ["monasteries", "views"], highlights: "Large Buddha statue and gardens just outside Ravangla." },
  { id: "temi", name: "Temi Tea Garden", region: "South", kind: "viewpoint", altitudeM: 1500, lat: 27.24, lng: 88.42, bestMonths: [3, 4, 5, 10, 11], tags: ["tea", "views"], highlights: "Sikkim's only tea estate, on hill slopes between Ravangla and Namchi." },
];

