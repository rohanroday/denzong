import Link from "next/link";

const FLAGS = ["bg-flag-blue", "bg-flag-white", "bg-flag-red", "bg-flag-green", "bg-flag-yellow"];

export function PrayerFlagStrip({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden className={`flex h-[3px] overflow-hidden rounded-full ring-1 ring-line/70 ${className}`}>
      {FLAGS.map((c) => (
        <span key={c} className={`flex-1 ${c}`} />
      ))}
    </span>
  );
}

export function Wordmark({ size = "md" }: { size?: "md" | "lg" }) {
  return (
    <Link href="/" className="group inline-flex flex-col gap-1 no-underline" aria-label="Denzong home">
      <span
        className={`font-display font-semibold tracking-[-0.02em] text-maroon ${size === "lg" ? "text-3xl" : "text-xl"}`}
        style={{ fontVariationSettings: '"opsz" 72, "SOFT" 50' }}
      >
        Denzong
      </span>
      <PrayerFlagStrip className="w-full" />
    </Link>
  );
}
