import { getAllEvents } from "@/lib/events";
import EventForm from "./EventForm";
import EventRow from "./EventRow";

// Reads/writes live event data — must never be served from a build-time
// static cache, or edits here wouldn't show up without a redeploy.
export const dynamic = "force-dynamic";

export default async function AdminEventsPage() {
  const events = await getAllEvents();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-ink">Events</h1>
        <p className="mt-1 text-[14px] text-ink/62">
          Add, edit, or remove events shown on the site — each gets a live countdown.
        </p>
      </div>

      <section className="rounded-2xl bg-paper border border-ink/10 p-6">
        <h2 className="font-display text-xl text-ink mb-5">Add a new event</h2>
        <EventForm />
      </section>

      <section className="space-y-4">
        {events.length === 0 ? (
          <p className="text-[14px] text-ink/62">No events yet.</p>
        ) : (
          events.map((event) => <EventRow key={event.id} event={event} />)
        )}
      </section>
    </div>
  );
}
