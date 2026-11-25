import { describe, expect, it } from "vitest";
import { summarizeOrders, type Order } from "../orders";

function makeOrder(overrides: Partial<Order>): Order {
  return {
    id: "order-1",
    items: [{ name: "Latte", quantity: 1, amountTotalCents: 500 }],
    totalCents: 500,
    pickupName: "Jordan",
    customerEmail: null,
    status: "paid",
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

describe("summarizeOrders", () => {
  it("returns zeroed stats for an empty order list", () => {
    const summary = summarizeOrders([]);
    expect(summary.orderCount).toBe(0);
    expect(summary.totalCents).toBe(0);
    expect(summary.averageOrderCents).toBe(0);
    expect(summary.byHour).toHaveLength(24);
    expect(summary.byWeekday).toHaveLength(7);
  });

  it("sums revenue and computes average order value", () => {
    const orders = [
      makeOrder({ id: "1", totalCents: 500 }),
      makeOrder({ id: "2", totalCents: 1500 }),
    ];
    const summary = summarizeOrders(orders);
    expect(summary.orderCount).toBe(2);
    expect(summary.totalCents).toBe(2000);
    expect(summary.averageOrderCents).toBe(1000);
  });

  it("excludes refunded orders from revenue — that money isn't revenue anymore", () => {
    const orders = [
      makeOrder({ id: "1", totalCents: 500, status: "paid" }),
      makeOrder({ id: "2", totalCents: 1500, status: "refunded" }),
    ];
    const summary = summarizeOrders(orders);
    expect(summary.orderCount).toBe(1);
    expect(summary.totalCents).toBe(500);
  });

  it("buckets a known order into the correct hour and weekday", () => {
    // 2026-12-05 is a Saturday; 14:30 local time.
    const createdAt = new Date(2026, 11, 5, 14, 30).toISOString();
    const summary = summarizeOrders([makeOrder({ totalCents: 500, createdAt })]);

    const hourBucket = summary.byHour[14];
    expect(hourBucket.count).toBe(1);
    expect(hourBucket.totalCents).toBe(500);

    const saturdayBucket = summary.byWeekday.find((b) => b.label === "Sat")!;
    expect(saturdayBucket.count).toBe(1);
  });

  it("ignores orders with an unparseable createdAt instead of crashing", () => {
    const summary = summarizeOrders([makeOrder({ createdAt: "not-a-date" })]);
    expect(summary.byHour.every((b) => b.count === 0)).toBe(true);
  });
});
