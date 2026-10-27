import { Suspense } from "react";
import type { Metadata } from "next";
import { PlanApp } from "@/components/plan/PlanApp";

export const metadata: Metadata = { title: "Plan your trip" };

export default function PlanPage() {
  return (
    <Suspense fallback={<div className="h-[100dvh] bg-mist" />}>
      <PlanApp />
    </Suspense>
  );
}
