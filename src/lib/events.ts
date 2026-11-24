import { promises as fs } from "fs";
import path from "path";

export type CafeEvent = {
  id: string;
  title: string;
  date: string; // "YYYY-MM-DD"
  time: string; // display string, e.g. "6:00 PM – 8:00 PM"
  category: string;
  description: string;
};

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "events.json");

/** Parses "YYYY-MM-DD" as a local calendar date (not UTC midnight), so
 *  events don't roll back a day in timezones behind UTC. */
export function parseEventDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

async function readAll(): Promise<CafeEvent[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw err;
  }
}

export async function getUpcomingEvents(): Promise<CafeEvent[]> {
  const all = await readAll();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return all
    .filter((e) => {
      const d = parseEventDate(e.date);
      return !Number.isNaN(d.getTime()) && d >= today;
    })
    .sort((a, b) => parseEventDate(a.date).getTime() - parseEventDate(b.date).getTime());
}
