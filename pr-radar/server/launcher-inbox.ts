import { mkdir, rename, rm, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import type { GitHubInboxItem } from "../shared/viewer-scope";

/**
 * Publishes unacknowledged PR changes to the Plugin Launcher's shared inbox
 * (`~/.paseo/plugin-inbox/<pluginId>.json`, format version 1). The launcher only reads the
 * file; acknowledging in the radar rewrites it, which clears the launcher's badge.
 */
export const PLUGIN_ID = "pr-radar-private";
export const SIDEBAR_ITEM_ID = "radar";
const INBOX_DIR = join(homedir(), ".paseo", "plugin-inbox");
const MAX_NOTIFICATIONS = 200;

export interface LauncherInboxFile {
  version: 1;
  pluginId: string;
  itemId: string;
  title: string;
  updatedAt: string;
  notifications: Array<{
    id: string;
    title: string;
    detail: string;
    url: string;
    createdAt: string;
  }>;
}

export function buildLauncherInbox(items: GitHubInboxItem[], now = new Date()): LauncherInboxFile {
  const changed = items
    .filter((item) => item.changes.length > 0)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, MAX_NOTIFICATIONS);
  return {
    version: 1,
    pluginId: PLUGIN_ID,
    itemId: SIDEBAR_ITEM_ID,
    title: "PR Radar",
    updatedAt: now.toISOString(),
    notifications: changed.map((item) => ({
      // A further change on the same PR gets a new id, so the launcher announces it again.
      id: `${item.id}:${item.changes.join("|")}`.slice(0, 200),
      title: `${item.repository}#${item.number} ${item.title}`.slice(0, 300),
      detail: item.changes.join(" · ").slice(0, 500),
      url: item.url,
      createdAt: item.updatedAt,
    })),
  };
}

let writeSequence = 0;

export async function publishLauncherInbox(
  items: GitHubInboxItem[],
  dir = INBOX_DIR,
): Promise<void> {
  try {
    await mkdir(dir, { recursive: true });
    const target = join(dir, `${PLUGIN_ID}.json`);
    const temporary = `${target}.${process.pid}.${++writeSequence}.tmp`;
    await writeFile(temporary, `${JSON.stringify(buildLauncherInbox(items))}\n`, { mode: 0o600 });
    await rename(temporary, target);
  } catch (error) {
    // Notifications are best effort; never fail a refresh over them.
    console.error("PR Radar: could not publish launcher inbox", error);
  }
}

/** Called on plugin stop so a disabled radar does not leave stale notifications behind. */
export async function clearLauncherInbox(dir = INBOX_DIR): Promise<void> {
  await rm(join(dir, `${PLUGIN_ID}.json`), { force: true }).catch(() => undefined);
}
