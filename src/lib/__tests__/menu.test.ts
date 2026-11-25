import { describe, expect, it } from "vitest";
import { ValidationError, validateMenuItem } from "../menu";

describe("validateMenuItem", () => {
  it("accepts a valid item and normalizes the price to a rounded integer", () => {
    const result = validateMenuItem({
      name: "Cortado",
      note: "Equal parts espresso & steamed milk",
      categoryId: "espresso",
      priceCents: 400.4,
    });
    expect(result).toEqual({
      name: "Cortado",
      note: "Equal parts espresso & steamed milk",
      categoryId: "espresso",
      priceCents: 400,
    });
  });

  it("rejects a name that's too short", () => {
    expect(() => validateMenuItem({ name: "A", categoryId: "espresso", priceCents: 100 })).toThrow(
      ValidationError
    );
  });

  it("rejects an unknown category", () => {
    let caught: unknown;
    try {
      validateMenuItem({ name: "Mystery Drink", categoryId: "not-a-real-category", priceCents: 100 });
    } catch (err) {
      caught = err;
    }
    expect(caught).toBeInstanceOf(ValidationError);
    expect((caught as ValidationError).fields.categoryId).toBeDefined();
  });

  it("rejects a non-positive or absurdly large price", () => {
    expect(() => validateMenuItem({ name: "Free Coffee", categoryId: "espresso", priceCents: 0 })).toThrow(
      ValidationError
    );
    expect(() =>
      validateMenuItem({ name: "Gold-Plated Latte", categoryId: "espresso", priceCents: 999999 })
    ).toThrow(ValidationError);
  });

  it("rejects a price that can't be parsed as a number", () => {
    expect(() =>
      validateMenuItem({ name: "Latte", categoryId: "espresso", priceCents: "free" })
    ).toThrow(ValidationError);
  });
});
