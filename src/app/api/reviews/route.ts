import { NextRequest, NextResponse } from "next/server";
import {
  ValidationError,
  getReviews,
  saveReview,
  validateReview,
} from "@/lib/reviews";
import { getClientIp, rateLimit } from "@/lib/rateLimit";

// 5 reviews per hour per IP — real customers don't post more than that;
// bots/spam scripts do.
const REVIEW_LIMIT = 5;
const REVIEW_WINDOW_MS = 60 * 60 * 1000;

export async function GET() {
  const reviews = await getReviews();
  return NextResponse.json({ ok: true, reviews });
}

export async function POST(req: NextRequest) {
  const { allowed, retryAfterSeconds } = rateLimit(
    `review:${getClientIp(req)}`,
    REVIEW_LIMIT,
    REVIEW_WINDOW_MS
  );
  if (!allowed) {
    return NextResponse.json(
      { ok: false, message: "Too many reviews submitted. Please try again later." },
      { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid request body." },
      { status: 400 }
    );
  }

  const record = (body ?? {}) as Record<string, unknown>;

  // Honeypot: a real visitor never fills this hidden field. Bots that
  // blindly fill every input do — pretend success so they move on,
  // but never persist the submission.
  if (typeof record.company === "string" && record.company.trim() !== "") {
    return NextResponse.json(
      { ok: true, message: "Thanks for your review!" },
      { status: 201 }
    );
  }

  try {
    const input = validateReview(body);
    const review = await saveReview(input);
    return NextResponse.json(
      { ok: true, message: "Thanks for your review!", review },
      { status: 201 }
    );
  } catch (err) {
    if (err instanceof ValidationError) {
      return NextResponse.json(
        { ok: false, message: "Please fix the highlighted fields.", fields: err.fields },
        { status: 422 }
      );
    }
    console.error("[api/reviews] unexpected error", err);
    return NextResponse.json(
      { ok: false, message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
