"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { type CafeEvent, formatTimeRange, parseEventStart } from "@/lib/eventTime";
import Countdown from "@/components/Countdown";
import EventForm from "./EventForm";

export default function EventRow({ event }: { event: CafeEvent }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isPast, setIsPast] = useState(false);

  useEffect(() => {
    // Date.now() is impure, so this is computed after mount rather than
    // during render — a one-time clock read, not cascading app state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsPast(parseEventStart(event.date, event.startTime).getTime() < Date.now());
  }, [event.date, event.startTime]);

  async function handleDelete() {
    if (!confirm(`Delete "${event.title}"? This can't be undone.`)) return;
    setDeleting(true);
    try {
      await fetch(`/api/admin/events/${event.id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setDeleting(false);
    }
  }

  if (editing) {
    return (
      <div className="rounded-2xl border border-ink/10 bg-cream p-5">
        <EventForm event={event} onDone={() => setEditing(false)} />
      </div>
    );
  }

  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl border border-ink/10 bg-paper p-5">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <p className="font-display text-lg text-ink">{event.title}</p>
          <span className="rounded-full bg-maroon/10 px-2.5 py-0.5 text-[10px] uppercase tracking-[0.1em] text-maroon">
            {event.category}
          </span>
          {isPast && (
            <span className="rounded-full bg-ink/10 px-2.5 py-0.5 text-[10px] uppercase tracking-[0.1em] text-ink/62">
              Past
            </span>
          )}
        </div>
        <p className="mt-1 text-[13px] text-ink/62">
          {event.date} · {formatTimeRange(event.startTime, event.endTime)}
        </p>
        <p className="mt-2 text-[13.5px] text-ink/70">{event.description}</p>
        {!isPast && (
          <Countdown
            target={parseEventStart(event.date, event.startTime).toISOString()}
            size="sm"
            className="mt-3"
          />
        )}
      </div>
      <div className="flex shrink-0 flex-col items-end gap-2">
        <button
          onClick={() => setEditing(true)}
          className="text-[12px] uppercase tracking-[0.1em] text-ink/60 hover:text-ink"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="text-[12px] uppercase tracking-[0.1em] text-rust hover:text-maroon disabled:opacity-50"
        >
          {deleting ? "Deleting…" : "Delete"}
        </button>
      </div>
    </div>
  );
}
