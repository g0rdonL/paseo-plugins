import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, test, vi } from "vitest";
import { mergeChanges } from "../server/changes";
import { resolveViewerScope } from "../server/viewer-scope";

const gh = vi.hoisted(() => ({ checks: "SUCCESS" }));
const url = "https://github.com/acme/app/pull/1";

vi.mock("node:child_process", () => ({
  execFile: (
    _file: string,
    args: string[],
    _options: unknown,
    callback: (error: Error | null, result: { stdout: string }) => void,
  ) => {
    const authored = args.some((arg) => arg.startsWith("--author"));
    const row = {
      id: "PR_1",
      number: 1,
      title: "Fix",
      url: "https://github.com/acme/app/pull/1",
      isDraft: false,
      createdAt: "2026-10-01T00:00:00Z",
      updatedAt: "2026-10-02T00:00:00Z",
      author: { login: "alice", type: "User" },
      repository: { nameWithOwner: "acme/app" },
      commentsCount: 0,
      labels: [],
    };
    const detail = {
      id: "PR_1",
      baseRefName: "main",
      headRefName: "fix",
      reviewDecision: "APPROVED",
      mergeable: "MERGEABLE",
      mergeStateStatus: "CLEAN",
      statusCheckRollup: { state: gh.checks },
    };
    let stdout = JSON.stringify({ data: { nodes: [detail] } });
    if (args[0] === "api" && args[1] === "user") stdout = "octocat\n";
    else if (args[0] === "search") {
      stdout = JSON.stringify(
        authored ? [args.includes("--json=url") ? { url: row.url } : row] : [],
      );
    }
    callback(null, { stdout });
  },
}));

const directories: string[] = [];

afterEach(async () => {
  vi.unstubAllEnvs();
  await Promise.all(directories.splice(0).map((directory) => rm(directory, { recursive: true })));
});

describe("mergeChanges", () => {
  test("folds a flip-flopping field into its net change", () => {
    expect(
      mergeChanges(["New activity", "Checks: success → pending"], ["Checks: pending → failure"]),
    ).toEqual(["New activity", "Checks: success → failure"]);
  });

  test("drops a field that ended where it started", () => {
    expect(
      mergeChanges(
        ["Checks: success → pending", "Merge state: CLEAN → UNSTABLE"],
        ["Checks: pending → success", "Merge state: UNSTABLE → CLEAN", "New activity"],
      ),
    ).toEqual(["New activity"]);
  });

  test("keeps unrelated and duplicate plain changes once", () => {
    expect(mergeChanges(["New PR"], ["New PR", "Review: none → APPROVED"])).toEqual([
      "New PR",
      "Review: none → APPROVED",
    ]);
  });

  test("keeps surviving changes in their original order", () => {
    const pending = ["Review: none → approved", "Checks: success → pending", "New activity"];
    expect(mergeChanges(pending, ["Checks: pending → success"])).toEqual([
      "Review: none → approved",
      "New activity",
    ]);
    expect(mergeChanges(pending, ["Checks: pending → failure"])).toEqual([
      "Review: none → approved",
      "Checks: success → failure",
      "New activity",
    ]);
  });

  test("never merges different fields whose values mirror each other", () => {
    expect(mergeChanges(["Checks: none → failure"], ["Review: failure → none"])).toEqual([
      "Checks: none → failure",
      "Review: failure → none",
    ]);
  });

  test("collapses a round trip already stored as two entries", () => {
    expect(mergeChanges(["Checks: success → pending", "Checks: pending → success"], [])).toEqual(
      [],
    );
  });
});

describe("pending changes across refreshes", () => {
  test("a field that flips back leaves no update badge", async () => {
    const directory = await mkdtemp(join(tmpdir(), "pr-radar-"));
    directories.push(directory);
    vi.stubEnv("PASEO_HOME", directory);
    const refresh = async (checks: string) => {
      gh.checks = checks;
      return resolveViewerScope({ urls: [url], windowDays: 30 });
    };

    await refresh("SUCCESS");
    const pending = await refresh("PENDING");
    expect(pending.inboxItems[0].changes).toEqual(["Checks: success → pending"]);

    const restored = await refresh("SUCCESS");
    expect(restored.inboxItems[0].changes).toEqual([]);
    expect(restored.updates).toBe(0);
  });
});
