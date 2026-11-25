import { getUpcomingEvents } from "@/lib/events";
import { parseEventStart, formatTimeRange } from "@/lib/eventTime";
import Countdown from "./Countdown";

const MONTHS = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatDate(dateStr: string, startTime: string) {
  const d = parseEventStart(dateStr, startTime);
  return {
    day: String(d.getDate()).padStart(2, "0"),
    month: MONTHS[d.getMonth()],
    weekday: WEEKDAYS[d.getDay()],
  };
}

export default async function Events() {
  const events = await getUpcomingEvents();

  return (
    <section id="events" className="relative overflow-hidden grain py-24 md:py-28">
      <div className="relative z-10 mx-auto max-w-4xl px-6">
        <div className="flex flex-col items-center text-center">
          <div className="inline-block rounded-[28px] bg-paper/90 px-8 py-6">
            <p className="page-mark text-rust mb-5">Events — Fig. 05</p>
            <h2 className="font-display text-4xl sm:text-5xl text-balance">
              <span className="grain-text">Upcoming</span>
              <br />
              <span className="grain-text [--grain-color:var(--maroon)] italic font-normal">
                at Aurora.
              </span>
            </h2>
          </div>
        </div>

        {events.length === 0 ? (
          <div className="mt-14 flex justify-center">
            <p className="max-w-sm rounded-2xl bg-paper/90 px-6 py-4 text-center text-[14.5px] text-ink/62">
              Nothing on the calendar right now — check back soon.
            </p>
          </div>
        ) : (
          <ul className="mt-14 space-y-5">
            {events.map((event) => {
              const { day, month, weekday } = formatDate(event.date, event.startTime);
              return (
                <li
                  key={event.id}
                  className="flex gap-5 rounded-2xl bg-paper/90 p-5 sm:gap-7 sm:p-6"
                >
                  <div className="flex shrink-0 flex-col items-center justify-center rounded-xl bg-ink-950 px-4 py-3 text-cream">
                    <span className="text-[10px] uppercase tracking-[0.14em] text-cream/60">
                      {weekday}
                    </span>
                    <span className="font-display text-2xl leading-none">{day}</span>
                    <span className="text-[10px] uppercase tracking-[0.14em] text-rust">
                      {month}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <p className="font-display text-xl text-ink">{event.title}</p>
                      <span className="rounded-full bg-maroon/10 px-2.5 py-0.5 text-[10px] uppercase tracking-[0.12em] text-maroon">
                        {event.category}
                      </span>
                    </div>
                    <p className="mt-1 text-[12px] uppercase tracking-[0.1em] text-ink/62">
                      {formatTimeRange(event.startTime, event.endTime)}
                    </p>
                    <p className="mt-2 text-[14.5px] leading-relaxed text-ink/70">
                      {event.description}
                    </p>
                    <Countdown
                      target={parseEventStart(event.date, event.startTime).toISOString()}
                      completedLabel="Happening now"
                      className="mt-3"
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
