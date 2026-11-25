import { describe, expect, it } from "vitest";
import { createSessionToken, verifyPassword, verifySessionToken } from "../adminSession";

describe("verifyPassword", () => {
  it("accepts the correct password", async () => {
    expect(await verifyPassword("hunter2", "hunter2")).toBe(true);
  });

  it("rejects an incorrect password", async () => {
    expect(await verifyPassword("wrong", "hunter2")).toBe(false);
  });

  it("rejects a password that's a prefix of the real one (no partial match)", async () => {
    expect(await verifyPassword("hunter", "hunter2")).toBe(false);
  });

  it("is case-sensitive", async () => {
    expect(await verifyPassword("Hunter2", "hunter2")).toBe(false);
  });
});

describe("session tokens", () => {
  const secret = "test-secret-do-not-use-in-prod";

  it("verifies a token it just created", async () => {
    const token = await createSessionToken(secret);
    expect(await verifySessionToken(token, secret)).toBe(true);
  });

  it("rejects a token signed with a different secret", async () => {
    const token = await createSessionToken(secret);
    expect(await verifySessionToken(token, "a-different-secret")).toBe(false);
  });

  it("rejects a tampered token", async () => {
    const token = await createSessionToken(secret);
    const [expiresAt] = token.split(".");
    const tampered = `${Number(expiresAt) + 1_000_000}.forged-signature`;
    expect(await verifySessionToken(tampered, secret)).toBe(false);
  });

  it("rejects an expired token", async () => {
    // Build a token whose expiry is already in the past, signed correctly
    // for that expiry, to isolate the expiry check from signature checking.
    const past = Date.now() - 1000;
    const { subtle } = crypto;
    const key = await subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const sig = await subtle.sign("HMAC", key, new TextEncoder().encode(String(past)));
    const hex = Array.from(new Uint8Array(sig))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    const expiredToken = `${past}.${hex}`;

    expect(await verifySessionToken(expiredToken, secret)).toBe(false);
  });

  it("rejects a missing or malformed token", async () => {
    expect(await verifySessionToken(undefined, secret)).toBe(false);
    expect(await verifySessionToken("garbage", secret)).toBe(false);
    expect(await verifySessionToken("", secret)).toBe(false);
  });
});
