import { promises as fs } from "fs";
import path from "path";

const BACKUP_DIR = path.join(process.cwd(), "data", "backups");
const MAX_BACKUPS_PER_FILE = 20;

/** Copies the current contents of `filePath` into data/backups/ before it
 *  gets overwritten, keeping only the most recent snapshots per file.
 *  Best-effort: a backup failure is logged but never blocks the actual
 *  write — losing a backup is far better than losing a real order. */
export async function backupBeforeWrite(filePath: string): Promise<void> {
  try {
    await fs.access(filePath);
  } catch {
    return; // nothing to back up yet — file doesn't exist
  }

  try {
    await fs.mkdir(BACKUP_DIR, { recursive: true });
    const base = path.basename(filePath, ".json");
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backupPath = path.join(BACKUP_DIR, `${base}.${timestamp}.json`);
    await fs.copyFile(filePath, backupPath);

    const entries = await fs.readdir(BACKUP_DIR);
    const matching = entries.filter((f) => f.startsWith(`${base}.`) && f.endsWith(".json")).sort();
    const excess = matching.length - MAX_BACKUPS_PER_FILE;
    if (excess > 0) {
      await Promise.all(matching.slice(0, excess).map((f) => fs.unlink(path.join(BACKUP_DIR, f))));
    }
  } catch (err) {
    console.error("[dataBackup] failed to back up", filePath, err);
  }
}
