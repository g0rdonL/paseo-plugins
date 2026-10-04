import { execFile } from "node:child_process";
import type { Dirent } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { promisify } from "node:util";
import type { PluginSettings } from "@getpaseo/plugin/server";
import type { z } from "zod";
import type { launcherList, launcherSettings, SidebarItem } from "../shared/launcher";
import { scanSidebarItems } from "../shared/scanner";

const execFileAsync = promisify(execFile);
const COMMAND_TIMEOUT_MS = 15_000;
const MAX_BUFFER_BYTES = 16 * 1024 * 1024;
const FALLBACK_BINARY = "/Users/gordon/.local/bin/paseo";
const MAX_DEPTH = 12;
const PLUGIN_LAUNCHER_ID = "plugin-launcher";
const SOURCE_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".mjs"]);

interface PluginListItem {
  id: string;
  path: string;
  status: "running" | "disabled" | "failed";
  enabled: boolean;
}

async function runPaseo(args: string[]): Promise<string> {
  try {
    const { stdout } = await execFileAsync("paseo", args, {
      timeout: COMMAND_TIMEOUT_MS,
      maxBuffer: MAX_BUFFER_BYTES,
    });
    return stdout;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    const { stdout } = await execFileAsync(FALLBACK_BINARY, args, {
      timeout: COMMAND_TIMEOUT_MS,
      maxBuffer: MAX_BUFFER_BYTES,
    });
    return stdout;
  }
}

async function listPlugins(): Promise<PluginListItem[]> {
  let stdout: string;
  try {
    stdout = await runPaseo(["plugin", "ls", "--json"]);
  } catch (error) {
    throw new Error(
      `plugin-launcher could not run "paseo plugin ls --json": ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(stdout);
  } catch (error) {
    throw new Error(
      `plugin-launcher could not parse "paseo plugin ls --json" output: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }
  if (!Array.isArray(parsed)) {
    throw new Error('plugin-launcher expected "paseo plugin ls --json" to return a JSON array.');
  }
  return parsed as PluginListItem[];
}

async function scanPluginDirectory(
  pluginDir: string,
): Promise<Array<{ itemId: string; title: string; icon: string }>> {
  const files: string[] = [];
  await walk(pluginDir, 0, files);
  const texts: string[] = [];
  for (const file of files) {
    try {
      texts.push(await readFile(file, "utf8"));
    } catch {}
  }
  // Constants such as `id: SCREEN_ID` are often imported from a sibling file.
  const constantsText = texts.join("\n");
  return texts.flatMap((text) => scanSidebarItems(text, constantsText));
}

async function walk(dir: string, depth: number, files: string[]): Promise<void> {
  if (depth > MAX_DEPTH) return;
  let entries: Dirent[];
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      // The plugin root itself may sit inside node_modules (npm installs); its own
      // dependency directories never hold its sidebar items.
      if (entry.name === "node_modules" || entry.name === ".git") continue;
      await walk(full, depth + 1, files);
    } else if (entry.isFile() && SOURCE_EXTENSIONS.has(extname(entry.name))) {
      files.push(full);
    }
  }
}

async function discoverSidebarItems(): Promise<SidebarItem[]> {
  const plugins = await listPlugins();
  const items: SidebarItem[] = [];
  for (const plugin of plugins) {
    if (plugin.id === PLUGIN_LAUNCHER_ID) continue;
    if (plugin.status !== "running" || !plugin.path) continue;
    const scanned = await scanPluginDirectory(plugin.path);
    for (const partial of scanned) {
      items.push({ pluginId: plugin.id, ...partial });
    }
  }
  return items;
}

function itemKey(item: SidebarItem): string {
  return `${item.pluginId}\u0000${item.itemId}`;
}

/** Dedupes by pluginId+itemId, lets overrides win, and sorts by title. */
export function mergeSidebarItems(
  discovered: SidebarItem[],
  overrides: SidebarItem[],
): SidebarItem[] {
  const byKey = new Map<string, SidebarItem>();
  for (const item of discovered) byKey.set(itemKey(item), item);
  for (const item of overrides) byKey.set(itemKey(item), item);
  return [...byKey.values()].sort(
    (a, b) =>
      a.title.localeCompare(b.title) ||
      a.pluginId.localeCompare(b.pluginId) ||
      a.itemId.localeCompare(b.itemId),
  );
}

export async function resolveLauncherList(
  _input: z.output<typeof launcherList.input>,
  settings: PluginSettings<typeof launcherSettings.schema>,
): Promise<z.input<typeof launcherList.output>> {
  const [discovered, settingsState] = await Promise.all([discoverSidebarItems(), settings.read()]);
  const overrides = settingsState.status === "ready" ? settingsState.values.overrides : [];
  return { items: mergeSidebarItems(discovered, overrides) };
}
