import Link from "next/link";
import { getOrders, summarizeOrders } from "@/lib/orders";
import { getUpcomingEvents } from "@/lib/events";
import { parseEventStart, formatTimeRange } from "@/lib/eventTime";
import { formatPrice } from "@/lib/menuTypes";
import StatCard from "@/components/admin/StatCard";
import AutoRefresh from "@/components/admin/AutoRefresh";
import Countdown from "@/components/Countdown";

// Reads live orders/events data on every request — must never be served
// from a build-time static cache.
export const dynamic = "force-dynamic";

const HOUR_LABELS = Array.from({ length: 24 }, (_, h) => {
  if (h === 0) return "12a";
  if (h === 12) return "12p";
  return h < 12 ? `${h}a` : `${h - 12}p`;
});

export default async function AdminOverviewPage() {
  const orders = await getOrders();
  const summary = summarizeOrders(orders);
  const upcoming = (await getUpcomingEvents()).slice(0, 3);
  const recentOrders = orders.slice(0, 5);

  const maxHourCount = Math.max(1, ...summary.byHour.map((b) => b.count));
  const maxWeekdayCount = Math.max(1, ...summary.byWeekday.map((b) => b.count));

  return (
    <div className="space-y-10">
      <AutoRefresh />
      <div>
        <h1 className="font-display text-3xl text-ink">Overview</h1>
        <p className="mt-1 text-[14px] text-ink/62">
          A snapshot of sales and what&rsquo;s coming up. Refreshes automatically every 15s.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Total Revenue" value={`$${formatPrice(summary.totalCents)}`} />
        <StatCard label="Total Orders" value={String(summary.orderCount)} />
        <StatCard
          label="Average Order"
          value={`$${formatPrice(summary.averageOrderCents)}`}
        />
        <StatCard
          label="Today"
          value={`$${formatPrice(summary.todayCents)}`}
          sublabel={`${summary.todayCount} order${summary.todayCount === 1 ? "" : "s"}`}
        />
      </div>

      <section className="rounded-2xl bg-paper border border-ink/10 p-6">
        <h2 className="font-display text-xl text-ink">When orders come in</h2>
        <p className="mt-1 text-[13px] text-ink/62">By hour of day (all-time)</p>
        <div className="mt-5 flex items-end gap-[3px] h-28">
          {summary.byHour.map((bucket) => (
            <div key={bucket.hour} className="flex-1 flex flex-col items-center justify-end h-full">
              <div
                className="w-full rounded-t bg-rust/70"
                style={{ height: `${(bucket.count / maxHourCount) * 100}%`, minHeight: bucket.count > 0 ? 2 : 0 }}
                title={`${bucket.count} order${bucket.count === 1 ? "" : "s"} at ${HOUR_LABELS[bucket.hour]}`}
              />
            </div>
          ))}
        </div>
        <div className="mt-1.5 flex gap-[3px] text-[9px] text-ink/62">
          {HOUR_LABELS.map((label, i) => (
            <div key={i} className="flex-1 text-center">
              {i % 3 === 0 ? label : ""}
            </div>
          ))}
        </div>

        <p className="mt-8 text-[13px] text-ink/62">By day of week (all-time)</p>
        <div className="mt-5 flex items-end gap-3 h-24">
          {summary.byWeekday.map((bucket) => (
            <div key={bucket.weekday} className="flex-1 flex flex-col items-center justify-end h-full">
              <div
                className="w-full rounded-t bg-maroon/70"
                style={{ height: `${(bucket.count / maxWeekdayCount) * 100}%`, minHeight: bucket.count > 0 ? 2 : 0 }}
                title={`${bucket.count} order${bucket.count === 1 ? "" : "s"} on ${bucket.label}`}
              />
            </div>
          ))}
        </div>
        <div className="mt-1.5 flex gap-3 text-[10px] text-ink/62">
          {summary.byWeekday.map((bucket) => (
            <div key={bucket.weekday} className="flex-1 text-center">
              {bucket.label}
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-2xl bg-paper border border-ink/10 p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl text-ink">Recent orders</h2>
            <Link href="/admin/orders" className="text-[12px] uppercase tracking-[0.1em] text-rust hover:text-maroon">
              View all
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="mt-4 text-[14px] text-ink/62">No orders yet.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {recentOrders.map((order) => (
                <li key={order.id} className="flex items-center justify-between text-[14px]">
                  <div className="min-w-0">
                    <p className="truncate text-ink/80">{order.pickupName ?? "Guest"}</p>
                    <p className="text-[12px] text-ink/62">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <span className="shrink-0 font-display text-ink">
                    ${formatPrice(order.totalCents)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl bg-paper border border-ink/10 p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl text-ink">Upcoming events</h2>
            <Link href="/admin/events" className="text-[12px] uppercase tracking-[0.1em] text-rust hover:text-maroon">
              Manage
            </Link>
          </div>
          {upcoming.length === 0 ? (
            <p className="mt-4 text-[14px] text-ink/62">Nothing scheduled.</p>
          ) : (
            <ul className="mt-4 space-y-4">
              {upcoming.map((event) => (
                <li key={event.id}>
                  <p className="text-[14.5px] text-ink">{event.title}</p>
                  <p className="text-[12px] text-ink/62">
                    {event.date} · {formatTimeRange(event.startTime, event.endTime)}
                  </p>
                  <Countdown
                    target={parseEventStart(event.date, event.startTime).toISOString()}
                    size="sm"
                    className="mt-1.5"
                  />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
