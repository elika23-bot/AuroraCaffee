// Pure types/helpers with no Node dependencies (no `fs`/`path`), so client
// components can safely import them without pulling the server-only
// data-access code in src/lib/menu.ts into the browser bundle.

export type MenuItem = {
  id: string;
  categoryId: string;
  name: string;
  note: string;
  /** Price in whole cents — avoids floating point errors and matches Stripe's unit_amount. */
  priceCents: number;
};

export type MenuCategoryMeta = { id: string; label: string };

export const CATEGORIES: MenuCategoryMeta[] = [
  { id: "espresso", label: "Espresso" },
  { id: "pour-over", label: "Pour Over" },
  { id: "spring", label: "Spring Specials" },
  { id: "summer", label: "Summer Specials" },
  { id: "pastries", label: "Pastries" },
];

export function formatPrice(cents: number): string {
  return (cents / 100).toFixed(2);
}

export function groupByCategory(items: MenuItem[]) {
  return CATEGORIES.map((category) => ({
    ...category,
    items: items.filter((item) => item.categoryId === category.id),
  }));
}
