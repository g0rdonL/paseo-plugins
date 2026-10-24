import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, test, vi } from "vitest";
import { mergeChanges } from "../server/changes";
import { resolveViewerScope } from "../server/viewer-scope";

const gh = vi.hoisted(() => ({
  checks: "SUCCESS",
  detail: {} as Record<string, unknown>,
  enrichmentFails: false,
}));
const url = "https://github.com/acme/app/pull/1";

vi.mock("node:child_process", () => ({
  execFile: (
    _file: string,
    args: string[],
    _options: unknown,
    callback: (error: Error | null, result?: { stdout: string }) => void,
  ) => {
    if (args[1] === "graphql" && gh.enrichmentFails) {
      callback(new Error("GitHub enrichment unavailable"));
      return;
    }
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
      ...gh.detail,
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
  gh.checks = "SUCCESS";
  gh.detail = {};
  gh.enrichmentFails = false;
  vi.unstubAllEnvs();
  await Promise.all(directories.splice(0).map((directory) => rm(directory, { recursive: true })));
});

describe("mergeChanges", () => {
  test("folds a flip-flopping field into its net change", () => {
    expect(
      mergeChanges(["New activity", "Checks: success → pending"], ["Checks: pending → failure"], {
        Checks: "failure",
      }),
    ).toEqual(["New activity", "Checks: success → failure"]);
  });

  test("drops a field that ended where it started", () => {
    expect(
      mergeChanges(
        ["Checks: success → pending", "Merge state: CLEAN → UNSTABLE"],
        ["Checks: pending → success", "Merge state: UNSTABLE → CLEAN", "New activity"],
        { Checks: "success", "Merge state": "CLEAN" },
      ),
    ).toEqual(["New activity"]);
  });

  test("keeps unrelated and duplicate plain changes once", () => {
    expect(
      mergeChanges(["New PR"], ["New PR", "Review: none → APPROVED"], { Review: "APPROVED" }),
    ).toEqual(["New PR", "Review: none → APPROVED"]);
  });

  test("keeps surviving changes in their original order", () => {
    const pending = ["Review: none → approved", "Checks: success → pending", "New activity"];
    expect(
      mergeChanges(pending, ["Checks: pending → success"], {
        Review: "approved",
        Checks: "success",
      }),
    ).toEqual(["Review: none → approved", "New activity"]);
    expect(
      mergeChanges(pending, ["Checks: pending → failure"], {
        Review: "approved",
        Checks: "failure",
      }),
    ).toEqual(["Review: none → approved", "Checks: success → failure", "New activity"]);
  });

  test("never merges different fields whose values mirror each other", () => {
    expect(
      mergeChanges(["Checks: none → failure"], ["Review: failure → none"], {
        Checks: "failure",
        Review: "none",
      }),
    ).toEqual(["Checks: none → failure", "Review: failure → none"]);
    expect(
      mergeChanges(["Merge state: CLEAN → DIRTY"], ["Mergeable: DIRTY → CLEAN"], {
        "Merge state": "DIRTY",
        Mergeable: "CLEAN",
      }),
    ).toEqual(["Merge state: CLEAN → DIRTY", "Mergeable: DIRTY → CLEAN"]);
  });

  test.each([
    ["Checks", "success", "pending"],
    ["Review", "approved", "pending"],
    ["Mergeable", "mergeable", "conflicting"],
    ["Merge state", "CLEAN", "DIRTY"],
  ])("reconciles the same legacy %s pair against its current value", (label, from, to) => {
    const pending = [`${label}: ${from} → ${to}`, `${label}: ${to} → ${from}`];
    expect(mergeChanges(pending, [], { [label]: from })).toEqual([]);
    expect(mergeChanges(pending, [], { [label]: to })).toEqual([pending[0]]);
    expect(mergeChanges(pending, [], {})).toEqual(pending);
  });
});

async function refreshLegacy(pending: string[], overrides: Record<string, unknown>) {
  const directory = await mkdtemp(join(tmpdir(), "pr-radar-"));
  directories.push(directory);
  vi.stubEnv("PASEO_HOME", directory);
  const stateDirectory = join(directory, "plugin-data", "pr-radar");
  await mkdir(stateDirectory, { recursive: true });
  const path = join(stateDirectory, "inbox-state.json");
  await writeFile(
    path,
    JSON.stringify({
      version: 2,
      windows: {
        "30": {
          items: {
            PR_1: {
              updatedAt: "2026-10-02T00:00:00Z",
              checksStatus: "success",
              reviewDecision: "approved",
              mergeable: "MERGEABLE",
              mergeStateStatus: "CLEAN",
              ...overrides,
            },
          },
          pendingChanges: { PR_1: pending },
          acknowledgedAt: "2026-10-01T00:00:00Z",
        },
      },
    }),
  );
  const result = await resolveViewerScope({ urls: [url], windowDays: 30 });
  expect(result.error).toBeNull();
  expect(result.acknowledgedAt).toBe("2026-10-01T00:00:00Z");
  expect(result.inboxItems[0].updatedAt).toBe("2026-10-02T00:00:00Z");
  const saved = JSON.parse(await readFile(path, "utf8")).windows["30"];
  expect(saved.pendingChanges.PR_1 ?? []).toEqual(result.inboxItems[0].changes);
  expect(result.updates).toBe(result.inboxItems[0].changes.length ? 1 : 0);
  return result.inboxItems[0].changes;
}

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

  test.each([
    {
      label: "Checks",
      from: "success",
      to: "pending",
      field: "checksStatus",
      values: ["success", "pending"],
      detailField: "statusCheckRollup",
      details: [{ state: "SUCCESS" }, { state: "PENDING" }],
    },
    {
      label: "Review",
      from: "approved",
      to: "pending",
      field: "reviewDecision",
      values: ["approved", "pending"],
      detailField: "reviewDecision",
      details: ["APPROVED", "REVIEW_REQUIRED"],
    },
    {
      label: "Mergeable",
      from: "mergeable",
      to: "conflicting",
      field: "mergeable",
      values: ["MERGEABLE", "CONFLICTING"],
      detailField: "mergeable",
      details: ["MERGEABLE", "CONFLICTING"],
    },
    {
      label: "Merge state",
      from: "CLEAN",
      to: "DIRTY",
      field: "mergeStateStatus",
      values: ["CLEAN", "DIRTY"],
      detailField: "mergeStateStatus",
      details: ["CLEAN", "DIRTY"],
    },
  ])(
    "reconciles persisted legacy $label changes with unchanged current state",
    async ({ label, from, to, field, values, detailField, details }) => {
      const pending = [`${label}: ${from} → ${to}`, `${label}: ${to} → ${from}`];
      for (const endpoint of [0, 1]) {
        gh.detail = { [detailField]: details[endpoint] };
        expect(await refreshLegacy(pending, { [field]: values[endpoint] })).toEqual(
          endpoint === 0 ? [] : [pending[0]],
        );
      }
    },
  );

  test("preserves ambiguous legacy history while enrichment is unavailable", async () => {
    gh.enrichmentFails = true;
    const pending = ["Checks: success → pending", "Checks: pending → success"];
    expect(await refreshLegacy(pending, { checksStatus: "pending" })).toEqual(pending);
    gh.enrichmentFails = false;
    gh.checks = "PENDING";
    const recovered = await resolveViewerScope({ urls: [url], windowDays: 30 });
    expect(recovered.inboxItems[0].changes).toEqual([pending[0]]);
    expect(recovered.updates).toBe(1);
  });

  test.each([
    {
      name: "missing checks",
      label: "Checks",
      from: "none",
      via: "success",
      stored: { checksStatus: "none" },
      detail: { statusCheckRollup: undefined },
      trusted: false,
    },
    {
      name: "unknown checks",
      label: "Checks",
      from: "none",
      via: "success",
      stored: { checksStatus: "none" },
      detail: { statusCheckRollup: { state: "UNKNOWN" } },
      trusted: false,
    },
    {
      name: "no checks",
      label: "Checks",
      from: "none",
      via: "success",
      stored: { checksStatus: "none" },
      detail: { statusCheckRollup: null },
      trusted: true,
    },
    {
      name: "missing review",
      label: "Review",
      from: "none",
      via: "approved",
      stored: { reviewDecision: null },
      detail: { reviewDecision: undefined },
      trusted: false,
    },
    {
      name: "unknown review",
      label: "Review",
      from: "none",
      via: "approved",
      stored: { reviewDecision: null },
      detail: { reviewDecision: "UNKNOWN" },
      trusted: false,
    },
    {
      name: "no review",
      label: "Review",
      from: "none",
      via: "approved",
      stored: { reviewDecision: null },
      detail: { reviewDecision: null },
      trusted: true,
    },
    {
      name: "unknown mergeability",
      label: "Mergeable",
      from: "unknown",
      via: "mergeable",
      stored: { mergeable: "UNKNOWN" },
      detail: { mergeable: "UNKNOWN" },
      trusted: false,
    },
    {
      name: "missing merge state",
      label: "Merge state",
      from: "unknown",
      via: "CLEAN",
      stored: { mergeStateStatus: null },
      detail: { mergeStateStatus: undefined },
      trusted: false,
    },
    {
      name: "null merge state",
      label: "Merge state",
      from: "unknown",
      via: "CLEAN",
      stored: { mergeStateStatus: null },
      detail: { mergeStateStatus: null },
      trusted: false,
    },
    {
      name: "unknown merge state",
      label: "Merge state",
      from: "UNKNOWN",
      via: "CLEAN",
      stored: { mergeStateStatus: "UNKNOWN" },
      detail: { mergeStateStatus: "UNKNOWN" },
      trusted: false,
    },
    {
      name: "lowercase unknown merge state",
      label: "Merge state",
      from: "unknown",
      via: "CLEAN",
      stored: { mergeStateStatus: "unknown" },
      detail: { mergeStateStatus: "unknown" },
      trusted: false,
    },
    {
      name: "empty merge state",
      label: "Merge state",
      from: "unknown",
      via: "CLEAN",
      stored: { mergeStateStatus: "" },
      detail: { mergeStateStatus: "" },
      trusted: false,
    },
  ])(
    "only cancels with a trustworthy value: $name",
    async ({ label, from, via, stored, detail, trusted }) => {
      gh.detail = detail;
      const pending = [`${label}: ${from} → ${via}`, `${label}: ${via} → ${from}`];
      expect(await refreshLegacy(pending, stored)).toEqual(trusted ? [] : pending);
    },
  );
});
