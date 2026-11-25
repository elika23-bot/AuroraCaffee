import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — Aurora Cafe",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <p className="page-mark text-rust mb-4">Legal</p>
      <h1 className="font-display text-4xl text-ink">Privacy Policy</h1>
      <p className="mt-2 text-[13px] text-ink/62">Last updated November 2026</p>

      <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-ink/75">
        <p>
          Aurora Cafe (&ldquo;we,&rdquo; &ldquo;us&rdquo;) runs this website to share our menu, take
          pickup orders, and hear from customers. This page explains what information we collect
          and how it&rsquo;s used — in plain language, since we&rsquo;re a neighborhood coffee shop,
          not a data company.
        </p>

        <section>
          <h2 className="font-display text-xl text-ink mb-2">What we collect</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong className="text-ink">Orders:</strong> when you check out, Stripe (our payment
              processor) collects your name and, if provided, your email for a receipt. We receive
              the name you give for pickup and a summary of what you ordered — never your card
              number, which only Stripe ever sees.
            </li>
            <li>
              <strong className="text-ink">Reviews:</strong> if you leave a review, the name, role,
              rating, and text you submit are stored and shown publicly on this site.
            </li>
            <li>
              <strong className="text-ink">Your cart:</strong> items you add to your cart are saved
              only in your own browser (localStorage) so it&rsquo;s there if you come back — it
              never reaches our server until you check out.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink mb-2">Payment processing</h2>
          <p>
            All payments are handled by Stripe, a PCI-compliant payment processor. We never see,
            transmit, or store your card details. Stripe&rsquo;s own privacy practices are described
            at{" "}
            <a
              href="https://stripe.com/privacy"
              className="text-rust hover:text-maroon underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              stripe.com/privacy
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink mb-2">Cookies</h2>
          <p>
            We don&rsquo;t use advertising or tracking cookies. The only cookie this site sets is a
            short-lived login session for our own staff when managing the site&rsquo;s admin
            dashboard — it has nothing to do with customer browsing.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink mb-2">How we use your information</h2>
          <p>
            Strictly to prepare and hand over your order, display reviews you choose to post, and
            improve the shop. We don&rsquo;t sell or share your information with third parties for
            marketing.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-ink mb-2">Questions or requests</h2>
          <p>
            To ask what information we have about you, or to have it removed, email us at{" "}
            <a href="mailto:hello@auroracafe.com" className="text-rust hover:text-maroon underline">
              hello@auroracafe.com
            </a>
            .
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
