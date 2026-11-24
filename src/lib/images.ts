import { existsSync } from "fs";
import path from "path";

/**
 * Checks whether a file under /public actually exists, so components can
 * render a real photo or a styled fallback server-side — no client-side
 * onError needed. (A client onError race is unreliable here: local 404s
 * resolve before React finishes attaching the listener.)
 */
export function imageExists(publicPath: string): boolean {
  const relative = publicPath.replace(/^\/+/, "");
  return existsSync(path.join(process.cwd(), "public", relative));
}
