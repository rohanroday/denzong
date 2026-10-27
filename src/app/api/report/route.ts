import { z } from "zod";
import { getDb, schema } from "@/db";

const body = z.object({
  tripSlug: z.string().max(32).optional(),
  subject: z.string().min(1).max(200),
  message: z.string().trim().min(1).max(2000),
});

export async function POST(req: Request) {
  const parsed = body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Please describe the mistake." }, { status: 400 });
  const db = await getDb();
  await db.insert(schema.reports).values({
    tripSlug: parsed.data.tripSlug ?? null,
    subject: parsed.data.subject,
    message: parsed.data.message,
  });
  return Response.json({ ok: true });
}
