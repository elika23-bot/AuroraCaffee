"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatPrice, type MenuItem } from "@/lib/menuTypes";
import MenuItemForm from "./MenuItemForm";

export default function MenuItemRow({ item }: { item: MenuItem }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm(`Remove "${item.name}" from the menu?`)) return;
    setDeleting(true);
    try {
      await fetch(`/api/admin/menu/${item.id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setDeleting(false);
    }
  }

  if (editing) {
    return (
      <div className="rounded-xl border border-ink/10 bg-cream p-4">
        <MenuItemForm item={item} onDone={() => setEditing(false)} />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-ink/10 bg-paper px-4 py-3">
      <div className="min-w-0">
        <p className="text-[14.5px] text-ink">{item.name}</p>
        <p className="truncate text-[12.5px] text-ink/62">{item.note}</p>
      </div>
      <div className="flex shrink-0 items-center gap-4">
        <span className="font-display text-[15px] text-maroon">${formatPrice(item.priceCents)}</span>
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
          {deleting ? "Removing…" : "Remove"}
        </button>
      </div>
    </div>
  );
}
