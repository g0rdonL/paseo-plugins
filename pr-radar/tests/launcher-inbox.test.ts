import { mkdtempSync } from "node:fs";
import { readFile, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, test } from "vitest";
import {
  buildLauncherInbox,
  clearLauncherInbox,
  publishLauncherInbox,
} from "../server/launcher-inbox";
import type { GitHubInboxItem } from "../shared/viewer-scope";

function item(id: string, changes: string[], updatedAt = "2026-10-04T00:00:00Z"): GitHubInboxItem {
  return {
    id,
    number: Number(id),
    url: `https://github.com/g0rdonL/repo/pull/${id}`,
    title: `Change ${id}`,
    repository: "g0rdonL/repo",
    author: "g0rdonL",
    authorKind: "human",
    createdAt: "2026-10-01T00:00:00Z",
    updatedAt,
    baseRefName: "main",
    headRefName: `branch-${id}`,
    isDraft: false,
    isSecurity: false,
    comments: 0,
    labels: [],
    mergeable: "MERGEABLE",
    mergeStateStatus: "CLEAN",
    checksStatus: "success",
    reviewDecision: null,
    role: "author",
    changes,
  };
}

const dirs: string[] = [];
afterEach(async () => {
  await Promise.all(dirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true })));
});

describe("buildLauncherInbox", () => {
  test("lists only changed PRs, newest first, keyed by PR and change set", () => {
    const file = buildLauncherInbox(
      [
        item("1", []),
        item("2", ["New PR"], "2026-10-02T00:00:00Z"),
        item("3", ["Checks: pending → success", "New activity"], "2026-10-03T00:00:00Z"),
      ],
      new Date("2026-10-04T12:00:00Z"),
    );
    expect(file).toMatchObject({
      version: 1,
      pluginId: "pr-radar-private",
      itemId: "radar",
      updatedAt: "2026-10-04T12:00:00.000Z",
    });
    expect(file.notifications).toEqual([
      {
        id: "3:Checks: pending → success|New activity",
        title: "g0rdonL/repo#3 Change 3",
        detail: "Checks: pending → success · New activity",
        url: "https://github.com/g0rdonL/repo/pull/3",
        createdAt: "2026-10-03T00:00:00Z",
      },
      expect.objectContaining({ id: "2:New PR", title: "g0rdonL/repo#2 Change 2" }),
    ]);
  });
});

describe("publishLauncherInbox", () => {
  test("writes the inbox file atomically and clearLauncherInbox removes it", async () => {
    const dir = mkdtempSync(join(tmpdir(), "launcher-inbox-"));
    dirs.push(dir);
    await publishLauncherInbox([item("7", ["New PR"])], dir);
    const path = join(dir, "pr-radar-private.json");
    const written = JSON.parse(await readFile(path, "utf8"));
    expect(written.notifications).toHaveLength(1);
    expect((await stat(path)).mode & 0o777).toBe(0o600);

    await clearLauncherInbox(dir);
    await expect(stat(path)).rejects.toThrow();
  });
});
