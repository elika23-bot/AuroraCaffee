import { describe, expect, it } from "vitest";
import { formatPrice, groupByCategory, type MenuItem } from "../menuTypes";

describe("formatPrice", () => {
  it("formats whole-cent amounts as dollars with two decimals", () => {
    expect(formatPrice(350)).toBe("3.50");
    expect(formatPrice(100)).toBe("1.00");
    expect(formatPrice(0)).toBe("0.00");
  });

  it("rounds to two decimal places", () => {
    expect(formatPrice(99)).toBe("0.99");
    expect(formatPrice(1)).toBe("0.01");
  });
});

describe("groupByCategory", () => {
  const items: MenuItem[] = [
    { id: "a", categoryId: "espresso", name: "A", note: "", priceCents: 100 },
    { id: "b", categoryId: "pastries", name: "B", note: "", priceCents: 200 },
    { id: "c", categoryId: "espresso", name: "C", note: "", priceCents: 300 },
  ];

  it("groups items under their category, preserving category order", () => {
    const grouped = groupByCategory(items);
    const espresso = grouped.find((c) => c.id === "espresso");
    const pastries = grouped.find((c) => c.id === "pastries");

    expect(espresso?.items.map((i) => i.id)).toEqual(["a", "c"]);
    expect(pastries?.items.map((i) => i.id)).toEqual(["b"]);
  });

  it("includes every known category even if it has no items", () => {
    const grouped = groupByCategory([]);
    expect(grouped.every((c) => c.items.length === 0)).toBe(true);
    expect(grouped.length).toBeGreaterThan(0);
  });
});
