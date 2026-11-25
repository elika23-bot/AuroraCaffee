// Pure date/time helpers with no Node dependencies (no `fs`/`path`), so
// client components can safely import them without pulling the server-only
// data-access code in src/lib/events.ts into the browser bundle.

export type CafeEvent = {
  id: string;
  title: string;
  date: string; // "YYYY-MM-DD"
  startTime: string; // "HH:MM", 24h
  endTime: string; // "HH:MM", 24h
  category: string;
  description: string;
};

export type EventInput = Omit<CafeEvent, "id">;

/** Parses date + time as local wall-clock time (not UTC), so events don't
 *  shift a day/hour in timezones behind UTC. */
export function parseEventStart(dateStr: string, startTime: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  const [h, min] = startTime.split(":").map(Number);
  return new Date(y, (m || 1) - 1, d || 1, h || 0, min || 0);
}

function formatTime(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

export function formatTimeRange(startTime: string, endTime: string): string {
  return `${formatTime(startTime)} – ${formatTime(endTime)}`;
}
