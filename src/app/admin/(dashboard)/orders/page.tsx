import { getOrders } from "@/lib/orders";
import { formatPrice } from "@/lib/menu";
import AutoRefresh from "@/components/admin/AutoRefresh";

// Reads live order data on every request — must never be served from a
// build-time static cache.
export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <div className="space-y-6">
      <AutoRefresh />
      <div>
        <h1 className="font-display text-3xl text-ink">Orders</h1>
        <p className="mt-1 text-[14px] text-ink/55">
          {orders.length} paid order{orders.length === 1 ? "" : "s"}, newest first. Refreshes
          automatically every 15s.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl bg-paper border border-ink/10 p-8 text-center text-[14px] text-ink/50">
          No orders yet — they&rsquo;ll show up here as soon as a customer checks out.
        </div>
      ) : (
        <div className="rounded-2xl bg-paper border border-ink/10 overflow-hidden">
          <table className="w-full text-left text-[13.5px]">
            <thead>
              <tr className="border-b border-ink/10 text-[11px] uppercase tracking-[0.08em] text-ink/45">
                <th className="px-5 py-3 font-medium">Placed</th>
                <th className="px-5 py-3 font-medium">Pickup Name</th>
                <th className="px-5 py-3 font-medium">Items</th>
                <th className="px-5 py-3 font-medium text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-ink/5 last:border-0 align-top">
                  <td className="px-5 py-4 whitespace-nowrap text-ink/70">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                  <td className="px-5 py-4 text-ink">{order.pickupName ?? "Guest"}</td>
                  <td className="px-5 py-4 text-ink/70">
                    {order.items.map((item, i) => (
                      <div key={i}>
                        {item.quantity}× {item.name}
                      </div>
                    ))}
                  </td>
                  <td className="px-5 py-4 text-right font-display text-ink">
                    ${formatPrice(order.totalCents)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
