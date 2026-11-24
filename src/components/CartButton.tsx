"use client";

import { useCart } from "./CartContext";

export default function CartButton({ className }: { className?: string }) {
  const { itemCount, open } = useCart();

  return (
    <button
      onClick={open}
      aria-label={`Open cart${itemCount > 0 ? `, ${itemCount} items` : ""}`}
      className={`relative p-2 -mr-2 ${className ?? ""}`}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h2l2.4 11.4a2 2 0 0 0 2 1.6h7.2a2 2 0 0 0 2-1.6L21 8H6" />
        <circle cx="10" cy="21" r="1.2" fill="currentColor" stroke="none" />
        <circle cx="17" cy="21" r="1.2" fill="currentColor" stroke="none" />
      </svg>
      {itemCount > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rust px-1 text-[10px] font-semibold leading-none text-cream">
          {itemCount}
        </span>
      )}
    </button>
  );
}
