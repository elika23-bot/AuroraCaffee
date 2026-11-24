import Link from "next/link";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import ClearCartOnMount from "@/components/ClearCartOnMount";

type PageProps = {
  searchParams: Promise<{ session_id?: string }>;
};

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-6 py-24">
      <div className="w-full max-w-md rounded-[28px] bg-paper border border-ink/10 p-8 sm:p-10 text-center shadow-[0_30px_60px_-30px_rgba(28,19,15,0.25)]">
        {children}
      </div>
    </main>
  );
}

function BackHomeLink() {
  return (
    <Link
      href="/"
      className="mt-6 inline-flex items-center rounded-full bg-ink px-6 py-3 text-[13px] font-semibold uppercase tracking-[0.12em] text-cream hover:bg-maroon transition-colors"
    >
      Back to Aurora Cafe
    </Link>
  );
}

export default async function OrderSuccessPage({ searchParams }: PageProps) {
  const { session_id } = await searchParams;

  if (!session_id || !stripe) {
    return (
      <Shell>
        <p className="font-display text-2xl">We couldn&rsquo;t find that order.</p>
        <p className="mt-3 text-[14.5px] text-ink/60">
          If you just paid, check your email for a receipt — otherwise, head back and try again.
        </p>
        <BackHomeLink />
      </Shell>
    );
  }

  let session: Stripe.Checkout.Session | null = null;
  try {
    session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["line_items"],
    });
  } catch (err) {
    console.error("[order/success] failed to retrieve session", err);
  }

  if (!session) {
    return (
      <Shell>
        <p className="font-display text-2xl">Something went wrong.</p>
        <p className="mt-3 text-[14.5px] text-ink/60">
          We couldn&rsquo;t load your order details. If you were charged, please contact us.
        </p>
        <BackHomeLink />
      </Shell>
    );
  }

  const paid = session.payment_status === "paid";
  const pickupName =
    session.custom_fields?.find((f) => f.key === "pickup_name")?.text?.value ?? null;
  const items = session.line_items?.data ?? [];
  const total = session.amount_total != null ? (session.amount_total / 100).toFixed(2) : null;

  return (
    <Shell>
      <ClearCartOnMount />
      {paid ? (
        <>
          <p className="page-mark text-rust mb-3">Order Confirmed</p>
          <p className="font-display text-3xl">Thank you{pickupName ? `, ${pickupName}` : ""}!</p>
          <p className="mt-3 text-[14.5px] text-ink/65">
            Your order is paid and ready to prepare — swing by the counter to pick it up.
          </p>
        </>
      ) : (
        <>
          <p className="font-display text-2xl">Payment not completed</p>
          <p className="mt-3 text-[14.5px] text-ink/60">
            It looks like this payment didn&rsquo;t go through. No charge was made.
          </p>
        </>
      )}

      {items.length > 0 && (
        <ul className="mt-6 space-y-2 text-left border-t border-ink/10 pt-5">
          {items.map((li) => (
            <li key={li.id} className="flex items-center justify-between text-[14px]">
              <span className="text-ink/75">
                {li.quantity}× {li.description}
              </span>
              <span className="text-ink/60">
                ${((li.amount_total ?? 0) / 100).toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
      )}

      {total && (
        <div className="mt-4 flex items-center justify-between border-t border-ink/10 pt-4 text-[15px]">
          <span className="text-ink/60">Total</span>
          <span className="font-display text-lg">${total}</span>
        </div>
      )}

      <BackHomeLink />
    </Shell>
  );
}
