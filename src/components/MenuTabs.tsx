"use client";

import { useState } from "react";
import { formatPrice, type MenuItem } from "@/lib/menuTypes";
import { useCart } from "./CartContext";

type Category = { id: string; label: string; items: MenuItem[] };

export default function MenuTabs({ categories }: { categories: Category[] }) {
  const [active, setActive] = useState(categories[0]?.id);
  const category = categories.find((c) => c.id === active) ?? categories[0];
  const { addItem } = useCart();

  if (!category) {
    return (
      <p className="mt-14 text-center text-[14px] text-cream/55">
        The menu is being updated — check back soon.
      </p>
    );
  }

  return (
    <>
      <div className="mt-12 flex flex-wrap justify-center gap-2">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setActive(c.id)}
            className={`rounded-full px-5 py-2.5 text-[12.5px] uppercase tracking-[0.12em] transition-colors ${
              active === c.id
                ? "bg-rust text-cream font-semibold"
                : "border border-cream/25 text-cream/70 hover:border-rust hover:text-rust"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <ul className="mt-14 space-y-7">
        {category.items.map((item) => (
          <li key={item.id} className="flex items-baseline gap-3">
            <div className="min-w-0">
              <p className="font-display text-xl sm:text-[1.35rem]">{item.name}</p>
              <p className="text-[13px] text-cream/55 mt-0.5">{item.note}</p>
            </div>
            <span
              aria-hidden
              className="flex-1 border-b border-dotted border-cream/25 translate-y-[-6px]"
            />
            <span className="font-display text-lg text-maroon-light shrink-0">
              ${formatPrice(item.priceCents)}
            </span>
            <button
              onClick={() => addItem(item.id)}
              aria-label={`Add ${item.name} to cart`}
              className="shrink-0 rounded-full border border-cream/25 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-cream/80 transition-colors hover:border-rust hover:bg-rust hover:text-cream"
            >
              Add
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
