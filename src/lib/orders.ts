import { promises as fs } from "fs";
import path from "path";

export type OrderItem = { name: string; quantity: number; amountTotalCents: number };

export type Order = {
  id: string;
  items: OrderItem[];
  totalCents: number;
  pickupName: string | null;
  customerEmail: string | null;
  status: "paid";
  createdAt: string;
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
  await fs.writeFile(DATA_FILE, JSON.stringify(all, null, 2), "utf-8");
}
