import { describe, expect, it } from "vitest";
import { rateLimit } from "../rateLimit";

describe("rateLimit", () => {
  it("allows calls up to the limit, then blocks", () => {
    const key = `test-${Math.random()}`;
    expect(rateLimit(key, 3, 60_000).allowed).toBe(true);
    expect(rateLimit(key, 3, 60_000).allowed).toBe(true);
    expect(rateLimit(key, 3, 60_000).allowed).toBe(true);
    const fourth = rateLimit(key, 3, 60_000);
    expect(fourth.allowed).toBe(false);
    expect(fourth.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("tracks separate keys independently", () => {
    const a = `a-${Math.random()}`;
    const b = `b-${Math.random()}`;
    rateLimit(a, 1, 60_000);
    const aSecond = rateLimit(a, 1, 60_000);
    const bFirst = rateLimit(b, 1, 60_000);

    expect(aSecond.allowed).toBe(false);
    expect(bFirst.allowed).toBe(true);
  });

  it("resets after the window expires", async () => {
    const key = `window-${Math.random()}`;
    expect(rateLimit(key, 1, 50).allowed).toBe(true);
    expect(rateLimit(key, 1, 50).allowed).toBe(false);

    await new Promise((resolve) => setTimeout(resolve, 70));

    expect(rateLimit(key, 1, 50).allowed).toBe(true);
  });
});
