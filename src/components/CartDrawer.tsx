"use client";

import { useEffect, useRef, useState } from "react";
import { formatPrice } from "@/lib/menuTypes";
import { useCart } from "./CartContext";

export default function CartDrawer() {
  const { menu, lines, subtotalCents, isOpen, close, setQuantity, removeItem } = useCart();
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Move focus into the dialog, and let Escape close it — standard
    // keyboard-accessible dialog behavior (WAI-ARIA dialog pattern).
    closeButtonRef.current?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, close]);

  async function handleCheckout() {
    setError(null);
    setCheckingOut(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lines }),
      });
      const json = await res.json();
      if (!res.ok || !json.url) {
        setError(json.message ?? "Couldn't start checkout. Please try again.");
        setCheckingOut(false);
        return;
      }
      window.location.href = json.url;
    } catch {
      setError("Couldn't reach the server. Please try again.");
      setCheckingOut(false);
    }
  }

  return (
    <div
      className={`fixed inset-0 z-[60] transition-visibility ${isOpen ? "" : "pointer-events-none"}`}
      aria-hidden={!isOpen}
    >
      <div
        onClick={close}
        className={`absolute inset-0 bg-ink-950/50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-heading"
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-paper text-ink shadow-[-20px_0_60px_-30px_rgba(15,36,39,0.5)] transition-transform duration-300 flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
          <p id="cart-heading" className="font-display text-xl">
            Your Order
          </p>
          <button
            ref={closeButtonRef}
            onClick={close}
            aria-label="Close cart"
            className="rounded-full p-1.5 text-ink/62 hover:text-rust transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {lines.length === 0 ? (
            <p className="mt-10 text-center text-[14px] text-ink/62">
              Your cart is empty — add something from the menu.
            </p>
          ) : (
            <ul className="space-y-5">
              {lines.map((line) => {
                const item = menu.find((i) => i.id === line.id);
                if (!item) return null;
                return (
                  <li key={line.id} className="flex items-start gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-[16px]">{item.name}</p>
                      <p className="mt-0.5 text-[13px] text-ink/62">
                        ${formatPrice(item.priceCents)} each
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          onClick={() => setQuantity(line.id, line.quantity - 1)}
                          aria-label={`Decrease ${item.name} quantity`}
                          className="h-7 w-7 rounded-full border border-ink/15 text-ink/70 hover:border-rust hover:text-rust transition-colors"
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-[14px]">{line.quantity}</span>
                        <button
                          onClick={() => setQuantity(line.id, line.quantity + 1)}
                          aria-label={`Increase ${item.name} quantity`}
                          className="h-7 w-7 rounded-full border border-ink/15 text-ink/70 hover:border-rust hover:text-rust transition-colors"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeItem(line.id)}
                          className="ml-2 text-[12px] uppercase tracking-[0.08em] text-ink/62 hover:text-rust transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <span className="font-display text-[15px] text-maroon shrink-0">
                      ${formatPrice(item.priceCents * line.quantity)}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {lines.length > 0 && (
          <div className="border-t border-ink/10 px-6 py-5">
            <div className="flex items-center justify-between text-[15px]">
              <span className="text-ink/62">Subtotal</span>
              <span className="font-display text-xl">${formatPrice(subtotalCents)}</span>
            </div>
            <p className="mt-1 text-[12px] text-ink/62">
              Pay now, pick up in-store — no delivery.
            </p>

            {error && <p className="mt-3 text-[13px] text-rust">{error}</p>}

            <button
              onClick={handleCheckout}
              disabled={checkingOut}
              className="mt-4 w-full rounded-full bg-ink px-6 py-3.5 text-[13px] font-semibold uppercase tracking-[0.14em] text-cream hover:bg-maroon transition-colors disabled:opacity-60"
            >
              {checkingOut ? "Redirecting to payment…" : "Checkout — Card or PayPal"}
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
