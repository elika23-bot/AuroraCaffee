import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  SESSION_DURATION_MS,
  createSessionToken,
  verifyPassword,
} from "@/lib/adminSession";
import { getClientIp, rateLimit } from "@/lib/rateLimit";

// 5 attempts per 15 minutes per IP — slows a brute-force password guesser
// to uselessness without getting in a real admin's way.
const LOGIN_LIMIT = 5;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;

export async function POST(req: NextRequest) {
  const { allowed, retryAfterSeconds } = rateLimit(
    `login:${getClientIp(req)}`,
    LOGIN_LIMIT,
    LOGIN_WINDOW_MS
  );
  if (!allowed) {
    return NextResponse.json(
      { ok: false, message: "Too many attempts. Please try again later." },
      { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } }
    );
  }

  const adminPassword = process.env.ADMIN_PASSWORD;
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;

  if (!adminPassword || !sessionSecret) {
    console.error("[api/admin/login] ADMIN_PASSWORD or ADMIN_SESSION_SECRET not set");
    return NextResponse.json(
      { ok: false, message: "Admin login isn't configured yet." },
      { status: 500 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }

  const password = typeof (body as { password?: unknown })?.password === "string"
    ? (body as { password: string }).password
    : "";

  if (!password || !(await verifyPassword(password, adminPassword))) {
    return NextResponse.json({ ok: false, message: "Incorrect password." }, { status: 401 });
  }

  const token = await createSessionToken(sessionSecret);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_MS / 1000,
  });
  return res;
}
