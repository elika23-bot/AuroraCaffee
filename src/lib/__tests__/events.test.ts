import { describe, expect, it } from "vitest";
import { ValidationError, validateEvent } from "../events";

const VALID_EVENT = {
  title: "Latte Art Throwdown",
  date: "2026-12-05",
  startTime: "18:00",
  endTime: "20:00",
  category: "Workshop",
  description: "Baristas and regulars compete for bragging rights.",
};

describe("validateEvent", () => {
  it("accepts a fully valid event", () => {
    expect(validateEvent(VALID_EVENT)).toEqual(VALID_EVENT);
  });

  it("rejects an invalid date format", () => {
    expect(() => validateEvent({ ...VALID_EVENT, date: "12/05/2026" })).toThrow(ValidationError);
  });

  it("rejects a malformed time", () => {
    expect(() => validateEvent({ ...VALID_EVENT, startTime: "6pm" })).toThrow(ValidationError);
  });

  it("rejects an end time that isn't after the start time", () => {
    let caught: unknown;
    try {
      validateEvent({ ...VALID_EVENT, startTime: "20:00", endTime: "18:00" });
    } catch (err) {
      caught = err;
    }
    expect(caught).toBeInstanceOf(ValidationError);
    expect((caught as ValidationError).fields.endTime).toBeDefined();
  });

  it("rejects an equal start and end time", () => {
    expect(() => validateEvent({ ...VALID_EVENT, startTime: "18:00", endTime: "18:00" })).toThrow(
      ValidationError
    );
  });

  it("rejects a missing title", () => {
    expect(() => validateEvent({ ...VALID_EVENT, title: "" })).toThrow(ValidationError);
  });

  it("truncates an overly long description rather than rejecting it", () => {
    const longDescription = "x".repeat(500);
    const result = validateEvent({ ...VALID_EVENT, description: longDescription });
    expect(result.description.length).toBe(400);
  });
});
