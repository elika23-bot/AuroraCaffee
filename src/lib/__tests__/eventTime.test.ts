import { describe, expect, it } from "vitest";
import { formatTimeRange, parseEventStart } from "../eventTime";

describe("parseEventStart", () => {
  it("parses date + time as local wall-clock time, not UTC", () => {
    const d = parseEventStart("2026-12-05", "17:30");
    expect(d.getFullYear()).toBe(2026);
    expect(d.getMonth()).toBe(11); // December, 0-indexed
    expect(d.getDate()).toBe(5);
    expect(d.getHours()).toBe(17);
    expect(d.getMinutes()).toBe(30);
  });

  it("produces an invalid date for malformed input rather than throwing", () => {
    const d = parseEventStart("not-a-date", "99:99");
    expect(Number.isNaN(d.getTime())).toBe(true);
  });
});

describe("formatTimeRange", () => {
  it("formats 24h times as a 12h AM/PM range", () => {
    expect(formatTimeRange("09:00", "10:30")).toBe("9:00 AM – 10:30 AM");
    expect(formatTimeRange("18:00", "20:00")).toBe("6:00 PM – 8:00 PM");
  });

  it("handles midnight and noon correctly", () => {
    expect(formatTimeRange("00:00", "12:00")).toBe("12:00 AM – 12:00 PM");
  });
});
