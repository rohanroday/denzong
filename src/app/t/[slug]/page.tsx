import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { ItineraryView } from "@/components/itinerary/ItineraryView";
import { Wordmark } from "@/components/Wordmark";
import { getTrip } from "@/lib/trips";

export const metadata: Metadata = { title: "A Sikkim trip plan" };

async function Trip({ params }: { params: Promise<{ slug: string }> }) {
  await connection(); // saved trips change; always read the latest
  const { slug } = await params;
  const trip = await getTrip(slug);
  if (!trip) notFound();
  return <ItineraryView itinerary={trip.itinerary} slug={trip.slug} readOnly />;
}

export default function SharedTripPage({ params }: PageProps<"/t/[slug]">) {
  return (
    <div className="min-h-[100dvh] bg-mist">
      <header className="border-b border-line bg-paper px-4 py-3 sm:px-6">
        <Wordmark />
      </header>
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-8">
        <Suspense fallback={<p className="text-muted">Loading the plan…</p>}>
          <Trip params={params} />
        </Suspense>
      </main>
    </div>
  );
}
