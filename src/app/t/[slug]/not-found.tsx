import Link from "next/link";

export default function TripNotFound() {
  return (
    <div className="space-y-3 py-16 text-center">
      <h1 className="font-display text-3xl font-medium text-ink">We couldn&apos;t find that plan</h1>
      <p className="text-slate">The link may be mistyped, or the plan was made on another copy of Denzong.</p>
      <Link href="/" className="inline-block font-semibold text-maroon underline">
        Plan a new trip
      </Link>
    </div>
  );
}
