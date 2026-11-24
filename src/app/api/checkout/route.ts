import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { findMenuItem } from "@/lib/menu";

type CartLineInput = { id: string; quantity: number };

export async function POST(req: NextRequest) {
  if (!stripe) {
    console.error("[api/checkout] STRIPE_SECRET_KEY is not set");
    return NextResponse.json(
      { ok: false, message: "Online payments aren't set up yet. Please check back soon." },
      { status: 500 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request body." }, { status: 400 });
  }

  const rawLines = (body as { lines?: unknown })?.lines;
  if (!Array.isArray(rawLines) || rawLines.length === 0) {
    return NextResponse.json({ ok: false, message: "Your cart is empty." }, { status: 400 });
  }

  const lines: CartLineInput[] = [];
  for (const raw of rawLines) {
    const r = raw as Record<string, unknown>;
    const id = typeof r.id === "string" ? r.id : "";
    const quantity = typeof r.quantity === "number" ? Math.floor(r.quantity) : NaN;
    if (!id || !Number.isFinite(quantity) || quantity < 1 || quantity > 20) {
      return NextResponse.json({ ok: false, message: "Invalid cart item." }, { status: 400 });
    }
    lines.push({ id, quantity });
  }

  // Look up every price server-side — never trust a price sent by the client.
  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  for (const line of lines) {
    const item = findMenuItem(line.id);
    if (!item) {
      return NextResponse.json(
        { ok: false, message: "One of the items in your cart is no longer available." },
        { status: 400 }
      );
    }
    line_items.push({
      quantity: line.quantity,
      price_data: {
        currency: "usd",
        unit_amount: item.priceCents,
        product_data: { name: item.name },
      },
    });
  }

  const origin = new URL(req.url).origin;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      allowed_payment_method_types: ["card", "paypal"],
      line_items,
      success_url: `${origin}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/order/cancel`,
      custom_fields: [
        {
          key: "pickup_name",
          label: { type: "custom", custom: "Name for pickup" },
          type: "text",
          text: { minimum_length: 1, maximum_length: 60 },
        },
      ],
      submit_type: "pay",
    });

    if (!session.url) {
      throw new Error("Stripe did not return a checkout URL");
    }

    return NextResponse.json({ ok: true, url: session.url });
  } catch (err) {
    console.error("[api/checkout] stripe error", err);
    return NextResponse.json(
      { ok: false, message: "Couldn't start checkout. Please try again." },
      { status: 500 }
    );
  }
}
