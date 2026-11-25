import { promises as fs } from "fs";
import path from "path";
import { backupBeforeWrite } from "./dataBackup";

export type Review = {
  id: string;
  name: string;
  role: string;
  rating: number;
  text: string;
  createdAt: string;
};

export type ReviewInput = Omit<Review, "id" | "createdAt">;

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "reviews.json");

export class ValidationError extends Error {
  fields: Record<string, string>;
  constructor(fields: Record<string, string>) {
    super("Validation failed");
    this.fields = fields;
  }
}

export function validateReview(input: unknown): ReviewInput {
  const errors: Record<string, string> = {};
  const body = (input ?? {}) as Record<string, unknown>;

  const name = typeof body.name === "string" ? body.name.trim().slice(0, 80) : "";
  const role = typeof body.role === "string" ? body.role.trim().slice(0, 80) : "";
  const text = typeof body.text === "string" ? body.text.trim().slice(0, 600) : "";
  const ratingRaw = body.rating;
  const rating =
    typeof ratingRaw === "number"
      ? ratingRaw
      : typeof ratingRaw === "string"
      ? Number(ratingRaw)
      : NaN;

  if (name.length < 2) errors.name = "Enter your name.";
  if (text.length < 15) errors.text = "Tell us a bit more (at least 15 characters).";
  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    errors.rating = "Choose a rating from 1 to 5.";
  }

  if (Object.keys(errors).length > 0) {
    throw new ValidationError(errors);
  }

  return { name, role, text, rating: Math.round(rating) };
}

async function readAll(): Promise<Review[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw err;
  }
}

export async function getReviews(): Promise<Review[]> {
  const all = await readAll();
  return all.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function saveReview(input: ReviewInput): Promise<Review> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const all = await readAll();

  const review: Review = {
    ...input,
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
  };

  all.push(review);
  await backupBeforeWrite(DATA_FILE);
  await fs.writeFile(DATA_FILE, JSON.stringify(all, null, 2), "utf-8");
  return review;
}
