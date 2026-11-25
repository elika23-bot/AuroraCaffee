import { promises as fs } from "fs";
import path from "path";
import { type MenuItem, CATEGORIES } from "./menuTypes";
import { backupBeforeWrite } from "./dataBackup";

export type { MenuItem };
export type MenuItemInput = Omit<MenuItem, "id">;

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "menu.json");

const CATEGORY_IDS = new Set(CATEGORIES.map((c) => c.id));

export class ValidationError extends Error {
  fields: Record<string, string>;
  constructor(fields: Record<string, string>) {
    super("Validation failed");
    this.fields = fields;
  }
}

export function validateMenuItem(input: unknown): MenuItemInput {
  const errors: Record<string, string> = {};
  const body = (input ?? {}) as Record<string, unknown>;

  const name = typeof body.name === "string" ? body.name.trim().slice(0, 80) : "";
  const note = typeof body.note === "string" ? body.note.trim().slice(0, 200) : "";
  const categoryId = typeof body.categoryId === "string" ? body.categoryId.trim() : "";
  const priceRaw = body.priceCents;
  const priceCents =
    typeof priceRaw === "number" ? priceRaw : typeof priceRaw === "string" ? Number(priceRaw) : NaN;

  if (name.length < 2) errors.name = "Enter a name.";
  if (!CATEGORY_IDS.has(categoryId)) errors.categoryId = "Choose a category.";
  if (!Number.isFinite(priceCents) || priceCents <= 0 || priceCents > 100000) {
    errors.priceCents = "Enter a price between $0.01 and $1000.";
  }

  if (Object.keys(errors).length > 0) throw new ValidationError(errors);

  return {
    name,
    note,
    categoryId,
    priceCents: Math.round(priceCents),
  };
}

async function readAll(): Promise<MenuItem[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw err;
  }
}

async function writeAll(items: MenuItem[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await backupBeforeWrite(DATA_FILE);
  await fs.writeFile(DATA_FILE, JSON.stringify(items, null, 2), "utf-8");
}

export async function getMenu(): Promise<MenuItem[]> {
  return readAll();
}

export async function findMenuItem(id: string): Promise<MenuItem | undefined> {
  const all = await readAll();
  return all.find((item) => item.id === id);
}

export async function createMenuItem(input: MenuItemInput): Promise<MenuItem> {
  const all = await readAll();
  const item: MenuItem = {
    ...input,
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
  };
  all.push(item);
  await writeAll(all);
  return item;
}

export async function updateMenuItem(id: string, input: MenuItemInput): Promise<MenuItem | null> {
  const all = await readAll();
  const index = all.findIndex((item) => item.id === id);
  if (index === -1) return null;
  const updated: MenuItem = { ...input, id };
  all[index] = updated;
  await writeAll(all);
  return updated;
}

export async function deleteMenuItem(id: string): Promise<boolean> {
  const all = await readAll();
  const next = all.filter((item) => item.id !== id);
  if (next.length === all.length) return false;
  await writeAll(next);
  return true;
}
