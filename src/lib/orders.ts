import { promises as fs } from "fs";
import path from "path";
import { backupBeforeWrite } from "./dataBackup";

export type OrderItem = { name: string; quantity: number; amountTotalCents: number };

export type Order = {
  id: string;
  items: OrderItem[];
  totalCents: number;
  pickupName: string | null;
  customerEmail: string | null;
  status: "paid" | "refunded";
  createdAt: string;
  /** Stripe PaymentIntent id, needed to issue a refund. Optional because
   *  orders saved before this field existed won't have it. */
  paymentIntentId?: string | null;
};

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "orders.json");

async function readAll(): Promise<Order[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw err;
  }
}

export async function getOrders(): Promise<Order[]> {
  const all = await readAll();
  return all.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/** Idempotent on order.id, since Stripe may retry the same webhook event. */
export async function saveOrder(order: Order): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const all = await readAll();
  if (all.some((o) => o.id === order.id)) return;
  all.push(order);
  await backupBeforeWrite(DATA_FILE);
  await fs.writeFile(DATA_FILE, JSON.stringify(all, null, 2), "utf-8");
}

export async function getOrder(id: string): Promise<Order | null> {
  const all = await readAll();
  return all.find((o) => o.id === id) ?? null;
}

export async function markOrderRefunded(id: string): Promise<Order | null> {
  const all = await readAll();
  const index = all.findIndex((o) => o.id === id);
  if (index === -1) return null;
  all[index] = { ...all[index], status: "refunded" };
  await backupBeforeWrite(DATA_FILE);
  await fs.writeFile(DATA_FILE, JSON.stringify(all, null, 2), "utf-8");
  return all[index];
}

export type HourBucket = { hour: number; count: number; totalCents: number };
export type WeekdayBucket = { weekday: number; label: string; count: number; totalCents: number };

export type SalesSummary = {
  orderCount: number;
  totalCents: number;
  averageOrderCents: number;
  todayCount: number;
  todayCents: number;
  byHour: HourBucket[];
  byWeekday: WeekdayBucket[];
};

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Pure function (no I/O) so it's easy to reason about and test against
 *  whatever order list is passed in — timing breakdowns are in the
 *  server's local time, matching how the cafe actually operates. Refunded
 *  orders are excluded: that money isn't revenue anymore. */
export function summarizeOrders(allOrders: Order[]): SalesSummary {
  const orders = allOrders.filter((o) => o.status === "paid");
  const orderCount = orders.length;
  const totalCents = orders.reduce((sum, o) => sum + o.totalCents, 0);
  const averageOrderCents = orderCount > 0 ? Math.round(totalCents / orderCount) : 0;

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  let todayCount = 0;
  let todayCents = 0;

  const byHour: HourBucket[] = Array.from({ length: 24 }, (_, hour) => ({
    hour,
    count: 0,
    totalCents: 0,
  }));
  const byWeekday: WeekdayBucket[] = Array.from({ length: 7 }, (_, weekday) => ({
    weekday,
    label: WEEKDAY_LABELS[weekday],
    count: 0,
    totalCents: 0,
  }));

  for (const order of orders) {
    const created = new Date(order.createdAt);
    if (Number.isNaN(created.getTime())) continue;

    if (created >= startOfToday) {
      todayCount += 1;
      todayCents += order.totalCents;
    }

    byHour[created.getHours()].count += 1;
    byHour[created.getHours()].totalCents += order.totalCents;

    byWeekday[created.getDay()].count += 1;
    byWeekday[created.getDay()].totalCents += order.totalCents;
  }

  return { orderCount, totalCents, averageOrderCents, todayCount, todayCents, byHour, byWeekday };
}
