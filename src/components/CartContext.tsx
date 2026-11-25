"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { MenuItem } from "@/lib/menuTypes";

export type CartLine = { id: string; quantity: number };

type CartContextValue = {
  menu: MenuItem[];
  lines: CartLine[];
  itemCount: number;
  subtotalCents: number;
  addItem: (id: string) => void;
  removeItem: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  clear: () => void;
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "aurora-cafe-cart";

function readStoredLines(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (l): l is CartLine =>
        l && typeof l.id === "string" && typeof l.quantity === "number" && l.quantity > 0
    );
  } catch {
    return [];
  }
}

export function CartProvider({
  menu,
  children,
}: {
  menu: MenuItem[];
  children: React.ReactNode;
}) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // localStorage isn't available during SSR, so the first client render
    // must match the server (empty cart) — this syncs in the real cart
    // right after mount, a one-time external-state read, not cascading state.
    const stored = readStoredLines();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLines(stored);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, hydrated]);

  const addItem = useCallback(
    (id: string) => {
      if (!menu.some((item) => item.id === id)) return;
      setLines((prev) => {
        const existing = prev.find((l) => l.id === id);
        if (existing) {
          return prev.map((l) => (l.id === id ? { ...l, quantity: l.quantity + 1 } : l));
        }
        return [...prev, { id, quantity: 1 }];
      });
      setIsOpen(true);
    },
    [menu]
  );

  const removeItem = useCallback((id: string) => {
    setLines((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const setQuantity = useCallback((id: string, quantity: number) => {
    setLines((prev) => {
      if (quantity <= 0) return prev.filter((l) => l.id !== id);
      return prev.map((l) => (l.id === id ? { ...l, quantity } : l));
    });
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const { itemCount, subtotalCents } = useMemo(() => {
    let count = 0;
    let subtotal = 0;
    for (const line of lines) {
      const item = menu.find((i) => i.id === line.id);
      if (!item) continue;
      count += line.quantity;
      subtotal += item.priceCents * line.quantity;
    }
    return { itemCount: count, subtotalCents: subtotal };
  }, [lines, menu]);

  const value = useMemo<CartContextValue>(
    () => ({
      menu,
      lines,
      itemCount,
      subtotalCents,
      addItem,
      removeItem,
      setQuantity,
      clear,
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
    }),
    [menu, lines, itemCount, subtotalCents, addItem, removeItem, setQuantity, clear, isOpen]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
