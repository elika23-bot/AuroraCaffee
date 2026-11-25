"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RefundButton({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRefund() {
    if (!confirm("Refund this order in full? This sends the money back via Stripe and can't be undone.")) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/refund`, { method: "POST" });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setError(json.message ?? "Refund failed.");
        setLoading(false);
        return;
      }
      router.refresh();
    } catch {
      setError("Couldn't reach the server.");
      setLoading(false);
    }
  }

  return (
    <div className="text-right">
      <button
        onClick={handleRefund}
        disabled={loading}
        className="text-[12px] uppercase tracking-[0.08em] text-rust hover:text-maroon transition-colors disabled:opacity-50"
      >
        {loading ? "Refunding…" : "Refund"}
      </button>
      {error && <p className="mt-1 text-[11px] text-rust">{error}</p>}
    </div>
  );
}
