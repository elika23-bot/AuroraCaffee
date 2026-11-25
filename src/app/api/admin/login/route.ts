import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  SESSION_DURATION_MS,
  createSessionToken,
  verifyPassword,
} from "@/lib/adminSession";

export async function POST(req: NextRequest) {
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
