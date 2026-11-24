import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { saveOrder } from "@/lib/orders";

export async function POST(req: NextRequest) {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
    console.error("[webhooks/stripe] Stripe or webhook secret not configured");
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ ok: false, message: "Missing signature." }, { status: 400 });
  }

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("[webhooks/stripe] signature verification failed", err);
    return NextResponse.json({ ok: false, message: "Invalid signature." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    if (session.payment_status === "paid") {
      try {
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
          limit: 100,
        });
        const pickupName =
          session.custom_fields?.find((f) => f.key === "pickup_name")?.text?.value ?? null;

        await saveOrder({
          id: session.id,
          items: lineItems.data.map((li) => ({
            name: li.description ?? "Item",
            quantity: li.quantity ?? 1,
            amountTotalCents: li.amount_total ?? 0,
          })),
          totalCents: session.amount_total ?? 0,
          pickupName,
          customerEmail: session.customer_details?.email ?? null,
          status: "paid",
          createdAt: new Date().toISOString(),
        });
      } catch (err) {
        console.error("[webhooks/stripe] failed to save order", err);
        // Still ack the webhook — Stripe already has the payment record,
        // and retrying won't fix a bug in our own save logic.
      }
    }
  }

  return NextResponse.json({ ok: true });
}
