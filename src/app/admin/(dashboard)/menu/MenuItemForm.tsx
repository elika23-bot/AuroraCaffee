"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES, type MenuItem } from "@/lib/menuTypes";

type Values = {
  name: string;
  note: string;
  categoryId: string;
  price: string; // dollars, as typed — converted to cents on submit
};

const EMPTY: Values = { name: "", note: "", categoryId: CATEGORIES[0].id, price: "" };

function toValues(item: MenuItem): Values {
  return {
    name: item.name,
    note: item.note,
    categoryId: item.categoryId,
    price: (item.priceCents / 100).toFixed(2),
  };
}

export default function MenuItemForm({
  item,
  onDone,
}: {
  item?: MenuItem;
  onDone?: () => void;
}) {
  const router = useRouter();
  const [values, setValues] = useState<Values>(item ? toValues(item) : EMPTY);
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

    const url = item ? `/api/admin/menu/${item.id}` : "/api/admin/menu";
    const method = item ? "PUT" : "POST";
    const priceCents = Math.round(Number(values.price) * 100);

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          note: values.note,
          categoryId: values.categoryId,
          priceCents,
        }),
      });
      const json = await res.json();

      if (!res.ok || !json.ok) {
        setError(json.message ?? "Something went wrong.");
        setFieldErrors(json.fields ?? {});
        setSubmitting(false);
        return;
      }

      if (!item) setValues(EMPTY);
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
          <span className="mb-1.5 block text-[11px] uppercase tracking-[0.1em] text-ink/62">
            Name
          </span>
          <input
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
            className={fieldClass(!!fieldErrors.name)}
          />
          {fieldErrors.name && (
            <span className="mt-1 block text-[12px] text-rust">{fieldErrors.name}</span>
          )}
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[11px] uppercase tracking-[0.1em] text-ink/62">
            Category
          </span>
          <select
            value={values.categoryId}
            onChange={(e) => set("categoryId", e.target.value)}
            className={fieldClass(!!fieldErrors.categoryId)}
          >
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
          {fieldErrors.categoryId && (
            <span className="mt-1 block text-[12px] text-rust">{fieldErrors.categoryId}</span>
          )}
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
        <label className="block">
          <span className="mb-1.5 block text-[11px] uppercase tracking-[0.1em] text-ink/62">
            Description
          </span>
          <input
            value={values.note}
            onChange={(e) => set("note", e.target.value)}
            placeholder="Double shot, house blend"
            className={fieldClass(false)}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[11px] uppercase tracking-[0.1em] text-ink/62">
            Price ($)
          </span>
          <input
            type="number"
            step="0.01"
            min="0.01"
            value={values.price}
            onChange={(e) => set("price", e.target.value)}
            className={`${fieldClass(!!fieldErrors.priceCents)} w-28`}
          />
          {fieldErrors.priceCents && (
            <span className="mt-1 block text-[12px] text-rust">{fieldErrors.priceCents}</span>
          )}
        </label>
      </div>

      {error && Object.keys(fieldErrors).length === 0 && (
        <p className="text-[13px] text-rust">{error}</p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-ink px-6 py-3 text-[13px] font-semibold uppercase tracking-[0.12em] text-cream hover:bg-maroon transition-colors disabled:opacity-60"
        >
          {submitting ? "Saving…" : item ? "Save Changes" : "Add Item"}
        </button>
        {onDone && (
          <button
            type="button"
            onClick={onDone}
            className="text-[13px] uppercase tracking-[0.1em] text-ink/62 hover:text-ink"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
