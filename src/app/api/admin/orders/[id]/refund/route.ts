import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getOrder, markOrderRefunded } from "@/lib/orders";

type Params = { params: Promise<{ id: string }> };

export async function POST(_req: NextRequest, { params }: Params) {
  if (!stripe) {
    return NextResponse.json(
      { ok: false, message: "Stripe isn't configured yet." },
      { status: 500 }
    );
  }

  const { id } = await params;
  const order = await getOrder(id);
  if (!order) {
    return NextResponse.json({ ok: false, message: "Order not found." }, { status: 404 });
  }
  if (order.status === "refunded") {
    return NextResponse.json({ ok: false, message: "This order is already refunded." }, { status: 400 });
  }
  if (!order.paymentIntentId) {
    return NextResponse.json(
      { ok: false, message: "No payment on record for this order — it may predate refund tracking." },
      { status: 400 }
    );
  }

  try {
    await stripe.refunds.create({ payment_intent: order.paymentIntentId });
  } catch (err) {
    console.error("[api/admin/orders/refund] stripe error", err);
    return NextResponse.json(
      { ok: false, message: "Stripe couldn't process the refund. Please try again." },
      { status: 500 }
    );
  }

  const updated = await markOrderRefunded(id);
  return NextResponse.json({ ok: true, order: updated });
}
