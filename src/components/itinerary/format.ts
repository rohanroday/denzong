export function hours(min: number) {
  const h = Math.floor(min / 60);
  const m = Math.round(min % 60);
  if (!h) return `${m}m`;
  return m ? `${h}h ${m}m` : `${h}h`;
}

export function inr(n: number) {
  return `₹${Math.round(n / 100) * 100 >= 1000 ? (Math.round(n / 100) * 100).toLocaleString("en-IN") : Math.round(n)}`;
}

export function metres(m: number) {
  return `${m.toLocaleString("en-IN")} m`;
}

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// Prayer-flag order: blue, white, red, green, yellow. Used for day dots.
export const DAY_COLOURS = ["#2b5fa6", "#ffffff", "#c0392b", "#2e8b57", "#e3b23c"];
export const DAY_DOT_CLASSES = [
  "bg-flag-blue",
  "bg-flag-white ring-1 ring-line",
  "bg-flag-red",
  "bg-flag-green",
  "bg-flag-yellow",
];

export function dayDot(day: number) {
  return DAY_DOT_CLASSES[(day - 1) % DAY_DOT_CLASSES.length];
}
