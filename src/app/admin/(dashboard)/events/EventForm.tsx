"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { CafeEvent } from "@/lib/eventTime";

type Values = {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  category: string;
  description: string;
};

const EMPTY: Values = {
  title: "",
  date: "",
  startTime: "",
  endTime: "",
  category: "",
  description: "",
};

function toValues(event: CafeEvent): Values {
  return {
    title: event.title,
    date: event.date,
    startTime: event.startTime,
    endTime: event.endTime,
    category: event.category,
    description: event.description,
  };
}

export default function EventForm({
  event,
  onDone,
}: {
  event?: CafeEvent;
  onDone?: () => void;
}) {
  const router = useRouter();
  const [values, setValues] = useState<Values>(event ? toValues(event) : EMPTY);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function set<K extends keyof Values>(key: K, value: string) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setFieldErrors({});

    const url = event ? `/api/admin/events/${event.id}` : "/api/admin/events";
    const method = event ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await res.json();

      if (!res.ok || !json.ok) {
        setError(json.message ?? "Something went wrong.");
        setFieldErrors(json.fields ?? {});
        setSubmitting(false);
        return;
      }

      if (!event) setValues(EMPTY);
      setSubmitting(false);
      router.refresh();
      onDone?.();
    } catch {
      setError("Couldn't reach the server. Please try again.");
      setSubmitting(false);
    }
  }

  function fieldClass(hasError: boolean) {
    return `w-full rounded-lg border bg-cream px-3.5 py-2.5 text-[14px] text-ink outline-none transition-colors focus:border-maroon ${
      hasError ? "border-rust" : "border-ink/15"
    }`;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-[11px] uppercase tracking-[0.1em] text-ink/50">
            Title
          </span>
          <input
            value={values.title}
            onChange={(e) => set("title", e.target.value)}
            className={fieldClass(!!fieldErrors.title)}
          />
          {fieldErrors.title && (
            <span className="mt-1 block text-[12px] text-rust">{fieldErrors.title}</span>
          )}
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[11px] uppercase tracking-[0.1em] text-ink/50">
            Category
          </span>
          <input
            value={values.category}
            onChange={(e) => set("category", e.target.value)}
            placeholder="Tasting, Workshop, Live Music…"
            className={fieldClass(!!fieldErrors.category)}
          />
          {fieldErrors.category && (
            <span className="mt-1 block text-[12px] text-rust">{fieldErrors.category}</span>
          )}
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block">
          <span className="mb-1.5 block text-[11px] uppercase tracking-[0.1em] text-ink/50">
            Date
          </span>
          <input
            type="date"
            value={values.date}
            onChange={(e) => set("date", e.target.value)}
            className={fieldClass(!!fieldErrors.date)}
          />
          {fieldErrors.date && (
            <span className="mt-1 block text-[12px] text-rust">{fieldErrors.date}</span>
          )}
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[11px] uppercase tracking-[0.1em] text-ink/50">
            Start Time
          </span>
          <input
            type="time"
            value={values.startTime}
            onChange={(e) => set("startTime", e.target.value)}
            className={fieldClass(!!fieldErrors.startTime)}
          />
          {fieldErrors.startTime && (
            <span className="mt-1 block text-[12px] text-rust">{fieldErrors.startTime}</span>
          )}
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[11px] uppercase tracking-[0.1em] text-ink/50">
            End Time
          </span>
          <input
            type="time"
            value={values.endTime}
            onChange={(e) => set("endTime", e.target.value)}
            className={fieldClass(!!fieldErrors.endTime)}
          />
          {fieldErrors.endTime && (
            <span className="mt-1 block text-[12px] text-rust">{fieldErrors.endTime}</span>
          )}
        </label>
      </div>

      <label className="block">
        <span className="mb-1.5 block text-[11px] uppercase tracking-[0.1em] text-ink/50">
          Description
        </span>
        <textarea
          value={values.description}
          onChange={(e) => set("description", e.target.value)}
          rows={3}
          className={fieldClass(!!fieldErrors.description)}
        />
        {fieldErrors.description && (
          <span className="mt-1 block text-[12px] text-rust">{fieldErrors.description}</span>
        )}
      </label>

      {error && Object.keys(fieldErrors).length === 0 && (
        <p className="text-[13px] text-rust">{error}</p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-ink px-6 py-3 text-[13px] font-semibold uppercase tracking-[0.12em] text-cream hover:bg-maroon transition-colors disabled:opacity-60"
        >
          {submitting ? "Saving…" : event ? "Save Changes" : "Add Event"}
        </button>
        {onDone && (
          <button
            type="button"
            onClick={onDone}
            className="text-[13px] uppercase tracking-[0.1em] text-ink/50 hover:text-ink"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
