import Link from "next/link";

export const metadata = {
  title: "Refund Policy — Aurora Cafe",
};

export default function RefundPolicyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <p className="page-mark text-rust mb-4">Legal</p>
      <h1 className="font-display text-4xl text-ink">Refund &amp; Cancellation Policy</h1>
      <p className="mt-2 text-[13px] text-ink/62">Last updated November 2026</p>

      <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-ink/75">
        <p>
          Every order placed through this site is prepared fresh, in-house, for pickup at our
          counter — there&rsquo;s no shipping or delivery involved. Here&rsquo;s how we handle
          cancellations and refunds.
        </p>

        <section>
          <h2 className="font-display text-xl text-ink mb-2">Before we&rsquo;ve started your order</h2>
          <p>
            If you need to cancel shortly after ordering, contact us right away at{" "}
            <a href="mailto:hello@auroracafe.com" className="text-rust hover:text-maroon underline">
              hello@auroracafe.com
            </a>{" "}
            or by calling the shop. If we haven&rsquo;t started preparing it yet, we&rsquo;ll cancel
            and refund it in full.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink mb-2">Once we&rsquo;ve started preparing it</h2>
          <p>
            Because drinks and food are made to order, we generally can&rsquo;t offer a refund once
            preparation has begun. If something about your order isn&rsquo;t right when you pick it
            up — wrong item, made incorrectly, or you&rsquo;re simply not happy with it — tell a
            team member at the counter, or reach out within 24 hours, and we&rsquo;ll remake it or
            refund it. We want you to be happy with your cup.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink mb-2">Orders never picked up</h2>
          <p>
            We hold orders for a reasonable time after the pickup window, but we aren&rsquo;t able
            to refund orders that go unclaimed with no notice. If your plans change, let us know and
            we&rsquo;ll do what we can.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink mb-2">How refunds are issued</h2>
          <p>
            Approved refunds are returned to the original payment method (card or PayPal) through
            Stripe, our payment processor. Depending on your bank, it can take a few business days
            to appear on your statement.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink mb-2">Questions</h2>
          <p>
            Reach us anytime at{" "}
            <a href="mailto:hello@auroracafe.com" className="text-rust hover:text-maroon underline">
              hello@auroracafe.com
            </a>{" "}
            — we&rsquo;d rather make it right than leave you unhappy.
          </p>
        </section>
      </div>

      <Link
        href="/"
        className="mt-12 inline-flex items-center rounded-full bg-ink px-6 py-3 text-[13px] font-semibold uppercase tracking-[0.12em] text-cream hover:bg-maroon transition-colors"
      >
        Back to Aurora Cafe
      </Link>
    </main>
  );
}
