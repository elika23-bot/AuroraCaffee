import { promises as fs } from "fs";
import path from "path";
import { type CafeEvent, type EventInput, parseEventStart } from "./eventTime";
import { backupBeforeWrite } from "./dataBackup";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "events.json");

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^([01]\d|2[0-3]):([0-5]\d)$/;

export class ValidationError extends Error {
  fields: Record<string, string>;
  constructor(fields: Record<string, string>) {
    super("Validation failed");
    this.fields = fields;
  }
}

export function validateEvent(input: unknown): EventInput {
  const errors: Record<string, string> = {};
  const body = (input ?? {}) as Record<string, unknown>;

  const title = typeof body.title === "string" ? body.title.trim().slice(0, 100) : "";
  const date = typeof body.date === "string" ? body.date.trim() : "";
  const startTime = typeof body.startTime === "string" ? body.startTime.trim() : "";
  const endTime = typeof body.endTime === "string" ? body.endTime.trim() : "";
  const category = typeof body.category === "string" ? body.category.trim().slice(0, 40) : "";
  const description =
    typeof body.description === "string" ? body.description.trim().slice(0, 400) : "";

  if (title.length < 2) errors.title = "Enter a title.";
  if (!DATE_RE.test(date) || Number.isNaN(parseEventStart(date, "00:00").getTime())) {
    errors.date = "Enter a valid date.";
  }
  if (!TIME_RE.test(startTime)) errors.startTime = "Enter a start time.";
  if (!TIME_RE.test(endTime)) errors.endTime = "Enter an end time.";
  if (TIME_RE.test(startTime) && TIME_RE.test(endTime) && endTime <= startTime) {
    errors.endTime = "End time must be after the start time.";
  }
  if (category.length < 2) errors.category = "Enter a category.";
  if (description.length < 5) errors.description = "Enter a short description.";

  if (Object.keys(errors).length > 0) throw new ValidationError(errors);

  return { title, date, startTime, endTime, category, description };
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

async function writeAll(events: CafeEvent[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await backupBeforeWrite(DATA_FILE);
  await fs.writeFile(DATA_FILE, JSON.stringify(events, null, 2), "utf-8");
}

function sortByStart(events: CafeEvent[]): CafeEvent[] {
  return [...events].sort(
    (a, b) =>
      parseEventStart(a.date, a.startTime).getTime() -
      parseEventStart(b.date, b.startTime).getTime()
  );
}

/** All events, past and future, oldest first — for the admin list. */
export async function getAllEvents(): Promise<CafeEvent[]> {
  return sortByStart(await readAll());
}

export async function getUpcomingEvents(): Promise<CafeEvent[]> {
  const all = await readAll();
  const now = new Date();
  return sortByStart(
    all.filter((e) => {
      const start = parseEventStart(e.date, e.startTime);
      return !Number.isNaN(start.getTime()) && start >= now;
    })
  );
}

export async function getEvent(id: string): Promise<CafeEvent | null> {
  const all = await readAll();
  return all.find((e) => e.id === id) ?? null;
}

export async function createEvent(input: EventInput): Promise<CafeEvent> {
  const all = await readAll();
  const event: CafeEvent = {
    ...input,
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
  };
  all.push(event);
  await writeAll(all);
  return event;
}

export async function updateEvent(id: string, input: EventInput): Promise<CafeEvent | null> {
  const all = await readAll();
  const index = all.findIndex((e) => e.id === id);
  if (index === -1) return null;
  const updated: CafeEvent = { ...input, id };
  all[index] = updated;
  await writeAll(all);
  return updated;
}

export async function deleteEvent(id: string): Promise<boolean> {
  const all = await readAll();
  const next = all.filter((e) => e.id !== id);
  if (next.length === all.length) return false;
  await writeAll(next);
  return true;
}
