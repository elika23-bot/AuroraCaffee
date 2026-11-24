import { NextResponse } from "next/server";
import { getUpcomingEvents } from "@/lib/events";

// Read-only for now. Once the admin page exists, a POST/PUT/DELETE here
// should sit behind real authentication before it accepts writes —
// there's no auth in this project yet, so no write path is exposed.
export async function GET() {
  const events = await getUpcomingEvents();
  return NextResponse.json({ ok: true, events });
}
