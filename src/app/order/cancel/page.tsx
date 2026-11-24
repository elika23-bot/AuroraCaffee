import Link from "next/link";

export default function OrderCancelPage() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-6 py-24">
      <div className="w-full max-w-md rounded-[28px] bg-paper border border-ink/10 p-8 sm:p-10 text-center shadow-[0_30px_60px_-30px_rgba(28,19,15,0.25)]">
        <p className="font-display text-2xl">Checkout canceled</p>
        <p className="mt-3 text-[14.5px] text-ink/60">
          No charge was made. Your cart is still waiting for you whenever you&rsquo;re ready.
        </p>
        <Link
          href="/#menu"
          className="mt-6 inline-flex items-center rounded-full bg-ink px-6 py-3 text-[13px] font-semibold uppercase tracking-[0.12em] text-cream hover:bg-maroon transition-colors"
        >
          Back to the menu
        </Link>
      </div>
    </main>
  );
}
