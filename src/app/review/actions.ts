"use server";

import { eq } from "drizzle-orm";
import { refresh } from "next/cache";
import { getDb, schema } from "@/db";
import { reviewEnabled } from "./access";

export async function setReportStatus(formData: FormData) {
  if (!reviewEnabled()) return;
  const id = Number(formData.get("id"));
  const status = String(formData.get("status"));
  if (!Number.isInteger(id) || !["open", "fixed", "dismissed"].includes(status)) return;
  const db = await getDb();
  await db.update(schema.reports).set({ status }).where(eq(schema.reports.id, id));
  refresh();
}
