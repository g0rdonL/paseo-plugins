import { describe, expect, test, vi } from "vitest";
import { observeDirectoryInvalidation } from "../client/directory-observation";
import {
  type AgentEntry,
  agentActionFor,
  applyViewerScope,
  buildAgentPrompt,
  buildRadarSnapshot,
  checkSummary,
  classifyRow,
  cycleWindowDays,
  formatAge,
  hasActiveAgent,
  isMergeable,
  matchesRow,
  mergeInboxRows,
  openPullRequestUrl,
  type PaseoApi,
  type PaseoWorkspace,
  type RadarAgent,
  type RadarRow,
  sortRows,
} from "../client/radar";
import {
  needsYouSummary,
  parseRadarParams,
  radarWarnings,
  supportsRadarScreen,
} from "../client/screen-state";
import {
  gatesSatisfied,
  type PullRequestView,
  parsePullRequestUrl,
  resolveMergeMethod,
  rollupState,
} from "../server/merge";
import { type GitHubInboxItem, GitHubInboxItemSchema } from "../shared/viewer-scope";

function agent(overrides: Partial<RadarAgent> = {}): RadarAgent {
  return {
    id: "agent-1",
    title: "Fix checkout",
    status: "idle",
    requiresAttention: false,
    attentionReason: null,
    pendingPermissions: 0,
    updatedAt: "2026-08-30T09:00:00.000Z",
    ...overrides,
  };
}

function row(overrides: Partial<RadarRow> = {}): RadarRow {
  return {
    id: "getpaseo/paseo#42",
    number: 42,
    url: "https://github.com/getpaseo/paseo/pull/42",
    title: "Fix checkout",
    repository: "getpaseo/paseo",
    baseRefName: "main",
    headRefName: "fix/checkout",
    isDraft: false,
    author: "omercnet",
    authorKind: "human",
    isSecurity: false,
    comments: 0,
    labels: [],
    changes: [],
    mergeable: "MERGEABLE",
    mergeStateStatus: "CLEAN",
    checksStatus: "success",
    reviewDecision: "approved",
    checks: [{ name: "test", status: "success", url: null }],
    workspaceIds: ["workspace-1"],
    localProjectRoot: "/work/paseo",
    workspaceNames: ["Fix checkout"],
    agents: [agent()],
    ownership: "mine",
    reviewRequestedFromMe: false,
    bucket: "waiting",
    reason: "",
    activityAt: "2026-08-30T09:00:00.000Z",
    refreshedAt: "2026-08-30T09:01:00.000Z",
    ...overrides,
  };
}

describe("sorting", () => {
  const rows = [
    row({ id: "red-new", bucket: "needs-you", activityAt: "2026-08-30T12:00:00.000Z", repository: "z/one" }),
    row({ id: "ready-old", bucket: "ready", activityAt: "2026-08-01T00:00:00.000Z", repository: "a/two" }),
    row({ id: "ready-new", bucket: "ready", activityAt: "2026-08-29T00:00:00.000Z", repository: "m/three" }),
    row({
      id: "ready-theirs",
      bucket: "ready",
      ownership: "external",
      activityAt: "2026-08-30T13:00:00.000Z",
      repository: "b/four",
    }),
    row({ id: "waiting", bucket: "waiting", activityAt: "2026-08-15T00:00:00.000Z", repository: "a/two", number: 7 }),
  ];
  const ids = (sorted: RadarRow[]) => sorted.map((r) => r.id);

  test("mergeable first: rows with a Merge button lead, newest first, then by bucket", () => {
    expect(ids(sortRows(rows, "mergeable"))).toEqual([
      "ready-new",
      "ready-old",
      "red-new",
      "ready-theirs",
      "waiting",
    ]);
  });

  test("mergeable means mine, ready, not a draft", () => {
    expect(isMergeable(row({ bucket: "ready" }))).toBe(true);
    expect(isMergeable(row({ bucket: "ready", ownership: "external" }))).toBe(false);
    expect(isMergeable(row({ bucket: "ready", isDraft: true }))).toBe(false);
    expect(isMergeable(row({ bucket: "needs-you" }))).toBe(false);
  });

  test("needs attention first keeps bucket order, newest first within", () => {
    expect(ids(sortRows(rows, "attention"))).toEqual([
      "red-new",
      "ready-theirs",
      "ready-new",
      "ready-old",
      "waiting",
    ]);
  });

  test("recent, oldest, and repository orders", () => {
    expect(ids(sortRows(rows, "recent"))[0]).toBe("ready-theirs");
    expect(ids(sortRows(rows, "oldest"))[0]).toBe("ready-old");
    expect(ids(sortRows(rows, "repository"))).toEqual([
      "waiting",
      "ready-old",
      "ready-theirs",
      "ready-new",
      "red-new",
    ]);
  });

  test("does not mutate its input", () => {
    const copy = [...rows];
    sortRows(rows, "recent");
    expect(rows).toEqual(copy);
  });
});

describe("sidebar queue and screen state", () => {
  test("counts classified needs-you rows, without including ready PRs", () => {
    const rows = [row({ bucket: "needs-you" }), row({ id: "other", bucket: "ready" })];
    expect(needsYouSummary(rows, false, [])).toEqual({ items: [rows[0]], label: "1" });
    expect(needsYouSummary(rows, false, ["Viewer unavailable"]).label).toBe("1+");
    expect(needsYouSummary([], false, ["Inbox truncated"]).label).toBe("0+");
    expect(needsYouSummary([], true, []).label).toBe("…");
  });
  test("preserves PR identity and accepts only supported filters", () => {
    expect(parseRadarParams({ pr: "getpaseo/paseo#42", filter: "needs-you" })).toEqual({
      pr: "getpaseo/paseo#42",
      filter: "needs-you",
    });
    expect(parseRadarParams({ filter: "active", pr: "Getpaseo/Paseo#42" })).toEqual({
      filter: "active",
      pr: "getpaseo/paseo#42",
    });
    expect(parseRadarParams({ filter: "bogus", pr: "" })).toEqual({ pr: null, filter: null });
    expect(parseRadarParams({})).toEqual({ pr: null, filter: null });
  });
  test("every partial-result cause yields a warning, and a clean queue none", () => {
    const clean = {
      directoryError: false,
      directoryTruncated: false,
      workspaceWarnings: 0,
      viewerKnown: true,
      viewerTruncated: false,
      urlCount: 200,
    };
    expect(radarWarnings(clean)).toEqual([]);
    for (const partial of [
      { directoryError: true },
      { directoryTruncated: true },
      { workspaceWarnings: 1 },
      { viewerKnown: false },
      { viewerTruncated: true },
      { urlCount: 201 },
    ]) {
      expect(radarWarnings({ ...clean, ...partial })).toHaveLength(1);
    }
  });
  test("older and partially upgraded hosts use the static path", () => {
    const modern = { addScreen() {}, addSidebarHeaderItem() {}, openScreen() {} };
    expect(supportsRadarScreen(modern, () => null)).toBe(true);
    expect(supportsRadarScreen({}, undefined)).toBe(false);
    for (const capability of Object.keys(modern))
      expect(supportsRadarScreen({ ...modern, [capability]: undefined }, () => null)).toBe(false);
    expect(supportsRadarScreen(modern, undefined)).toBe(false);
  });
});

function workspace(
  id: string,
  overrides: Partial<PaseoWorkspace["githubRuntime"]> = {},
): PaseoWorkspace {
  return {
    id,
    projectId: "project-1",
    projectDisplayName: "Paseo",
    projectRootPath: "/work/paseo",
    projectKind: "git",
    workspaceKind: "worktree",
    name: `Workspace ${id}`,
    archivingAt: null,
    status: "done",
    statusEnteredAt: "2026-08-30T09:00:00.000Z",
    activityAt: "2026-08-30T09:00:00.000Z",
    scripts: [],
    githubRuntime: {
      featuresEnabled: true,
      pullRequest: {
        number: 42,
        url: "https://github.com/getpaseo/paseo/pull/42",
        title: "Fix checkout",
        state: "open",
        baseRefName: "main",
        headRefName: "fix/checkout",
        isMerged: false,
        isDraft: false,
        mergeable: "MERGEABLE",
        checksStatus: "success",
        reviewDecision: "approved",
        github: { mergeStateStatus: "CLEAN", isInMergeQueue: false },
      },
      refreshedAt: "2026-08-30T09:01:00.000Z",
      ...overrides,
    },
  } as unknown as PaseoWorkspace;
}

function entry(workspaceId: string, overrides: Record<string, unknown> = {}): AgentEntry {
  return {
    agent: {
      id: `agent-${workspaceId}`,
      provider: "codex",
      cwd: `/work/${workspaceId}`,
      workspaceId,
      title: `Agent ${workspaceId}`,
      status: "idle",
      createdAt: "2026-08-30T08:00:00.000Z",
      updatedAt: "2026-08-30T09:00:00.000Z",
      lastActivityAt: "2026-08-30T09:00:00.000Z",
      pendingPermissions: [],
      requiresAttention: false,
      attentionReason: null,
      labels: {},
      ...overrides,
    },
    project: {
      projectKey: "project-1",
      projectName: "Paseo",
      workspaceName: workspaceId,
      checkout: {
        cwd: `/work/${workspaceId}`,
        isGit: true,
        currentBranch: "fix/checkout",
        remoteUrl: "https://github.com/getpaseo/paseo",
        worktreeRoot: `/work/${workspaceId}`,
        isPaseoOwnedWorktree: true,
        mainRepoRoot: "/work/paseo",
      },
    },
  } as unknown as AgentEntry;
}

interface DirectoryObserver {
  snapshot(): void;
  update(message: unknown): void;
}

interface OwnedDirectorySubscription {
  subscribe(next: DirectoryObserver): () => void;
  release(): Promise<void>;
}

interface OwnedDirectoryObservation {
  subscription: OwnedDirectorySubscription;
  calls: { subscribes: number; unsubscribes: number; releases: number };
  snapshot(): void;
  update(): void;
}

function ownedDirectoryObservation(): OwnedDirectoryObservation {
  let observer: DirectoryObserver | undefined;
  const calls = { subscribes: 0, unsubscribes: 0, releases: 0 };
  return {
    subscription: {
      subscribe(next) {
        calls.subscribes += 1;
        observer = next;
        return () => {
          calls.unsubscribes += 1;
          observer = undefined;
        };
      },
      async release() {
        calls.releases += 1;
      },
    },
    calls,
    snapshot() {
      observer?.snapshot();
    },
    update() {
      observer?.update({});
    },
  };
}

function paseoWithOwnedDirectoryObservations(
  agents: OwnedDirectoryObservation,
  workspaces: OwnedDirectoryObservation,
): PaseoApi {
  return {
    agents: { list: vi.fn().mockResolvedValue({ subscription: agents.subscription }) },
    workspaces: { list: vi.fn().mockResolvedValue({ subscription: workspaces.subscription }) },
  } as unknown as PaseoApi;
}

const directoryEvents: ReadonlyArray<
  [string, (agents: OwnedDirectoryObservation, workspaces: OwnedDirectoryObservation) => void]
> = [
  ["agent snapshot", (agents) => agents.snapshot()],
  ["agent update", (agents) => agents.update()],
  ["workspace snapshot", (_agents, workspaces) => workspaces.snapshot()],
  ["workspace update", (_agents, workspaces) => workspaces.update()],
];

describe("directory invalidation observations", () => {
  test.each(directoryEvents)(
    "invalidates directory state after an owned %s",
    async (_event, emit) => {
      vi.useFakeTimers();
      const agents = ownedDirectoryObservation();
      const workspaces = ownedDirectoryObservation();
      const paseo = paseoWithOwnedDirectoryObservations(agents, workspaces);
      const invalidateDirectoryState = vi.fn();
      const cleanup = observeDirectoryInvalidation(paseo, invalidateDirectoryState, 500);

      try {
        await Promise.resolve();
        emit(agents, workspaces);
        vi.advanceTimersByTime(500);

        expect(invalidateDirectoryState).toHaveBeenCalledOnce();
      } finally {
        cleanup();
        vi.useRealTimers();
      }
    },
  );
  test("cancels pending invalidation and releases owned observations on cleanup", async () => {
    vi.useFakeTimers();
    const agents = ownedDirectoryObservation();
    const workspaces = ownedDirectoryObservation();
    const paseo = paseoWithOwnedDirectoryObservations(agents, workspaces);
    const invalidateDirectoryState = vi.fn();
    const cleanup = observeDirectoryInvalidation(paseo, invalidateDirectoryState, 500);

    try {
      await Promise.resolve();
      agents.snapshot();
      cleanup();
      agents.update();
      workspaces.update();
      vi.advanceTimersByTime(500);

      expect(invalidateDirectoryState).not.toHaveBeenCalled();
      expect(agents.calls.unsubscribes).toBe(1);
      expect(workspaces.calls.unsubscribes).toBe(1);
      expect(agents.calls.releases).toBe(1);
      expect(workspaces.calls.releases).toBe(1);
    } finally {
      vi.useRealTimers();
    }
  });

  test("releases owned observations that resolve after cleanup", async () => {
    const agentResult = Promise.withResolvers<{ subscription: OwnedDirectorySubscription }>();
    const workspaceResult = Promise.withResolvers<{ subscription: OwnedDirectorySubscription }>();
    const agents = ownedDirectoryObservation();
    const workspaces = ownedDirectoryObservation();
    const paseo = {
      agents: { list: vi.fn().mockReturnValue(agentResult.promise) },
      workspaces: { list: vi.fn().mockReturnValue(workspaceResult.promise) },
    } as unknown as PaseoApi;
    const invalidateDirectoryState = vi.fn();
    const cleanup = observeDirectoryInvalidation(paseo, invalidateDirectoryState, 500);

    cleanup();
    agentResult.resolve({ subscription: agents.subscription });
    workspaceResult.resolve({ subscription: workspaces.subscription });
    await Promise.all([agentResult.promise, workspaceResult.promise]);
    await Promise.resolve();

    expect(invalidateDirectoryState).not.toHaveBeenCalled();
    expect(agents.calls.subscribes).toBe(0);
    expect(workspaces.calls.subscribes).toBe(0);
    expect(agents.calls.releases).toBe(1);
    expect(workspaces.calls.releases).toBe(1);
  });
});

describe("PR triage", () => {
  test("identifies only running and initializing agents as active", () => {
    expect(hasActiveAgent([agent({ status: "running" })])).toBe(true);
    expect(hasActiveAgent([agent({ status: "initializing" })])).toBe(true);
    expect(hasActiveAgent([agent({ status: "idle" })])).toBe(false);
    expect(hasActiveAgent([agent({ status: "error" })])).toBe(false);
  });

  test("does not interrupt a running agent for a failing PR", () => {
    expect(
      classifyRow(
        row({
          checksStatus: "failure",
          agents: [agent({ status: "running" })],
        }),
      ),
    ).toEqual({ bucket: "being-handled", reason: "Checks failing; agent working" });
  });

  test("surfaces an unattended failing PR", () => {
    expect(classifyRow(row({ checksStatus: "failure" }))).toEqual({
      bucket: "needs-you",
      reason: "Checks failing",
    });
  });

  test("agent permission requests outrank delivery state", () => {
    expect(
      classifyRow(row({ agents: [agent({ status: "idle", pendingPermissions: 2 })] })),
    ).toEqual({ bucket: "needs-you", reason: "Agent needs 2 permissions" });
  });

  test("a healthy active agent absorbs a failed sibling", () => {
    const failed = agent({ id: "failed", status: "error", attentionReason: "error" });
    const running = agent({ id: "running", status: "running" });
    expect(classifyRow(row({ agents: [failed, running] }))).toEqual({
      bucket: "being-handled",
      reason: "Agent working",
    });
    expect(classifyRow(row({ agents: [failed] }))).toEqual({
      bucket: "needs-you",
      reason: "Agent failed",
    });
  });

  test("finished agents do not override pending CI", () => {
    expect(
      classifyRow(
        row({
          checksStatus: "pending",
          mergeable: "UNKNOWN",
          reviewDecision: null,
          agents: [
            agent({
              status: "idle",
              requiresAttention: true,
              attentionReason: "finished",
            }),
          ],
        }),
      ),
    ).toEqual({ bucket: "waiting", reason: "Checks running" });
  });

  test("generic GitHub blocking without an actionable signal stays waiting", () => {
    expect(
      classifyRow(
        row({
          agents: [],
          checks: [],
          checksStatus: "none",
          mergeStateStatus: "BLOCKED",
          reviewDecision: null,
        }),
      ),
    ).toEqual({ bucket: "waiting", reason: "Waiting on repository requirements" });
  });

  test("requested changes are actionable only for the author", () => {
    expect(
      classifyRow(
        row({
          agents: [],
          ownership: "external",
          reviewDecision: "changes_requested",
        }),
      ),
    ).toEqual({ bucket: "waiting", reason: "Waiting on author changes" });

    expect(
      classifyRow(
        row({
          agents: [],
          ownership: "mine",
          reviewDecision: "changes_requested",
        }),
      ),
    ).toEqual({ bucket: "needs-you", reason: "Changes requested" });
  });

  test("marks only settled mergeable pull requests ready", () => {
    expect(classifyRow(row())).toEqual({
      bucket: "ready",
      reason: "Checks passed; mergeable",
    });
    expect(classifyRow(row({ mergeable: "UNKNOWN" }))).toEqual({
      bucket: "waiting",
      reason: "Mergeability pending",
    });
  });

  test("keeps drafts with active agents in progress", () => {
    expect(classifyRow(row({ isDraft: true, agents: [agent({ status: "running" })] }))).toEqual({
      bucket: "being-handled",
      reason: "Draft; agent working",
    });
  });

  test("external review requests wait for CI before asking for review", () => {
    const external = row({
      agents: [],
      ownership: "external",
      reviewDecision: "pending",
      reviewRequestedFromMe: true,
    });
    expect(classifyRow({ ...external, checksStatus: "pending" })).toEqual({
      bucket: "waiting",
      reason: "Checks running",
    });
    expect(classifyRow({ ...external, checksStatus: "success" })).toEqual({
      bucket: "needs-you",
      reason: "Review requested",
    });
  });

  const auditedRows: Array<{
    id: string;
    overrides: Partial<RadarRow>;
    expected: Pick<RadarRow, "bucket" | "reason">;
  }> = [
    {
      id: "descope/shuni#1184",
      overrides: { mergeable: "CONFLICTING", mergeStateStatus: "DIRTY", reviewDecision: "pending" },
      expected: { bucket: "needs-you", reason: "Merge conflict" },
    },
    {
      id: "getpaseo/paseo#1829",
      overrides: {
        agents: [agent({ status: "running" })],
        checksStatus: "none",
        mergeable: "MERGEABLE",
        mergeStateStatus: "CLEAN",
        reviewDecision: null,
      },
      expected: { bucket: "being-handled", reason: "Agent working" },
    },
    {
      id: "descope-dev/deconnect#73",
      overrides: { agents: [agent({ status: "running" })], reviewDecision: null },
      expected: { bucket: "being-handled", reason: "Agent working" },
    },
    {
      id: "getpaseo/paseo#1824",
      overrides: { checksStatus: "none", mergeStateStatus: "BLOCKED", reviewDecision: null },
      expected: { bucket: "waiting", reason: "Waiting on repository requirements" },
    },
    {
      id: "project-copacetic/copacetic#1686",
      overrides: {
        ownership: "external",
        reviewRequestedFromMe: true,
        checksStatus: "success",
        mergeStateStatus: "BLOCKED",
        reviewDecision: "pending",
      },
      expected: { bucket: "needs-you", reason: "Review requested" },
    },
    {
      id: "descope/shuni#1336",
      overrides: {
        mergeStateStatus: "BLOCKED",
        reviewDecision: "pending",
      },
      expected: { bucket: "waiting", reason: "Waiting on reviewers" },
    },
    {
      id: "descope/shuni#1337",
      overrides: {
        agents: [agent({ status: "running" })],
        checksStatus: "pending",
        mergeStateStatus: "BLOCKED",
        reviewDecision: "pending",
      },
      expected: { bucket: "waiting", reason: "Checks running" },
    },
    {
      id: "descope/shuni#1335",
      overrides: { mergeStateStatus: "BEHIND", reviewDecision: "pending" },
      expected: { bucket: "waiting", reason: "Waiting on reviewers" },
    },
    {
      id: "descope/backend#2432",
      overrides: {
        checksStatus: "pending",
        mergeStateStatus: "BLOCKED",
        reviewDecision: "pending",
      },
      expected: { bucket: "waiting", reason: "Checks running" },
    },
    {
      id: "project-copacetic/copacetic#1684",
      overrides: {
        mergeStateStatus: "BLOCKED",
        reviewDecision: "pending",
      },
      expected: { bucket: "waiting", reason: "Waiting on reviewers" },
    },
    {
      id: "descope/shuni#1334",
      overrides: { checksStatus: "pending", mergeStateStatus: "BEHIND", reviewDecision: "pending" },
      expected: { bucket: "waiting", reason: "Checks running" },
    },
    {
      id: "descope/backend#2392",
      overrides: { ownership: "external", reviewDecision: "changes_requested" },
      expected: { bucket: "waiting", reason: "Waiting on author changes" },
    },
    {
      id: "project-copacetic/copacetic#1594",
      overrides: {
        checksStatus: "pending",
        mergeStateStatus: "BLOCKED",
        reviewDecision: "pending",
      },
      expected: { bucket: "waiting", reason: "Checks running" },
    },
    {
      id: "tektum/verity-images#416",
      overrides: {
        agents: [agent({ status: "running" })],
        reviewDecision: "changes_requested",
      },
      expected: { bucket: "being-handled", reason: "Changes requested; agent working" },
    },
  ];

  for (const audited of auditedRows) {
    test(`classifies audited row ${audited.id}`, () => {
      expect(classifyRow(row({ agents: [], ...audited.overrides }))).toEqual(audited.expected);
    });
  }
});

describe("agent actions", () => {
  test("asks an existing idle agent for an actionable blocker", () => {
    const value = row({ bucket: "needs-you", reason: "Merge conflict" });
    expect(agentActionFor(value)).toEqual({ kind: "ask", agentId: "agent-1" });
    expect(buildAgentPrompt(value)).toContain("resolve the actionable blocker");
  });

  test("starts an agent when a requested review has no active agent", () => {
    const value = row({
      agents: [],
      bucket: "needs-you",
      ownership: "external",
      reviewRequestedFromMe: true,
      workspaceIds: ["review-workspace"],
    });
    expect(agentActionFor(value)).toEqual({ kind: "start", workspaceId: "review-workspace" });
    expect(buildAgentPrompt(value)).toContain("requesting your review");
  });

  test("creates a PR checkout action for an untracked inbox PR", () => {
    const value = row({
      agents: [],
      bucket: "needs-you",
      workspaceIds: [],
      localProjectRoot: "/work/paseo",
    });
    expect(agentActionFor(value)).toEqual({
      kind: "checkout",
      cwd: "/work/paseo",
      number: 42,
      repository: "getpaseo/paseo",
    });
  });

  test("does not automate non-actionable or permission-wait rows", () => {
    expect(agentActionFor(row({ bucket: "waiting" }))).toBeNull();
    expect(
      agentActionFor(
        row({
          bucket: "needs-you",
          agents: [agent({ pendingPermissions: 1, requiresAttention: true })],
        }),
      ),
    ).toBeNull();
  });
});

describe("PR URL opening", () => {
  const url = "https://github.com/getpaseo/paseo/pull/42";

  test("uses Paseo's external opener for HTTPS pull requests", async () => {
    const open = vi.fn(async () => {});

    await openPullRequestUrl(url, open);

    expect(open).toHaveBeenCalledWith(url);
  });

  test("rejects non-HTTPS URLs before opening", async () => {
    const open = vi.fn(async () => {});

    await expect(
      openPullRequestUrl("http://github.com/getpaseo/paseo/pull/42", open),
    ).rejects.toThrow("Only HTTPS pull request URLs are supported.");
    expect(open).not.toHaveBeenCalled();
  });
});

describe("GitHub inbox", () => {
  const item: GitHubInboxItem = {
    id: "PR_9",
    number: 9,
    url: "https://github.com/example/project/pull/9",
    title: "Fix production rollout",
    repository: "example/project",
    author: "omercnet",
    authorKind: "human",
    createdAt: "2026-09-01T08:00:00.000Z",
    updatedAt: "2026-09-02T08:00:00.000Z",
    baseRefName: "main",
    headRefName: "fix/rollout",
    isDraft: false,
    isSecurity: false,
    comments: 2,
    labels: [],
    mergeable: "MERGEABLE",
    mergeStateStatus: "BLOCKED",
    checksStatus: "failure",
    reviewDecision: "changes_requested",
    role: "author",
    changes: ["Checks: success → failure"],
  };

  test("adds an authored inbox PR without a linked workspace", () => {
    const snapshot = buildRadarSnapshot([], []);
    snapshot.repositoryRoots["example/project"] = "/work/project";

    const [merged] = mergeInboxRows(snapshot, [item]);
    expect(merged).toMatchObject({
      id: "example/project#9",
      ownership: "mine",
      bucket: "needs-you",
      reason: "Checks failing",
      localProjectRoot: "/work/project",
      changes: ["Checks: success → failure"],
    });
  });

  test("rejects non-HTTPS inbox URLs at the RPC boundary", () => {
    const result = GitHubInboxItemSchema.safeParse({
      ...item,
      url: "http://github.com/example/project/pull/9",
    });

    expect(result.success).toBe(false);
  });

  test("preserves active agents when GitHub refreshes a linked PR", () => {
    const snapshot = buildRadarSnapshot(
      [workspace("workspace-1")],
      [entry("workspace-1", { status: "running" })],
    );
    const source = snapshot.rows[0];
    if (!source) throw new Error("Expected a workspace-linked PR row");
    const inbox: GitHubInboxItem = {
      id: "PR_42",
      number: 42,
      url: source.url,
      title: source.title,
      repository: source.repository,
      author: "omercnet",
      authorKind: "human",
      createdAt: "2026-08-30T08:00:00.000Z",
      updatedAt: "2026-08-30T10:00:00.000Z",
      baseRefName: "main",
      headRefName: "fix/checkout",
      isDraft: false,
      isSecurity: false,
      comments: 1,
      labels: [],
      mergeable: "MERGEABLE",
      mergeStateStatus: "CLEAN",
      checksStatus: "success",
      reviewDecision: "approved",
      role: "author",
      changes: [],
    };

    const [merged] = mergeInboxRows(snapshot, [inbox]);
    expect(merged?.agents).toHaveLength(1);
    expect(merged?.bucket).toBe("being-handled");
  });
});
describe("viewer scope", () => {
  test("marks authored and requested-review rows from GitHub scope", () => {
    const mine = row();
    const review = row({
      id: "external#9",
      url: "https://github.com/example/project/pull/9",
      ownership: "unknown",
      reviewDecision: "pending",
    });
    const scoped = applyViewerScope([mine, review], {
      authoredUrls: [mine.url],
      reviewRequestedUrls: [review.url],
      assigneeUrls: [],
      mentionedUrls: [],
      ownedUrls: [],
      error: null,
      inboxItems: [],
    });

    expect(scoped.find((item) => item.id === mine.id)?.ownership).toBe("mine");
    expect(scoped.find((item) => item.id === review.id)).toMatchObject({
      ownership: "external",
      reviewRequestedFromMe: true,
      bucket: "needs-you",
      reason: "Review requested",
    });
  });

  test("treats assignee URLs as mine and mention URLs as external", () => {
    const assigned = row({
      id: "team/thing#11",
      url: "https://github.com/team/thing/pull/11",
      ownership: "unknown",
      reviewDecision: null,
    });
    const mentioned = row({
      id: "team/other#12",
      url: "https://github.com/team/other/pull/12",
      ownership: "unknown",
      reviewDecision: null,
    });
    const scoped = applyViewerScope([assigned, mentioned], {
      authoredUrls: [],
      reviewRequestedUrls: [],
      assigneeUrls: [assigned.url],
      mentionedUrls: [mentioned.url],
      ownedUrls: [],
      error: null,
      inboxItems: [],
    });

    expect(scoped.find((item) => item.id === assigned.id)?.ownership).toBe("mine");
    expect(scoped.find((item) => item.id === mentioned.id)).toMatchObject({
      ownership: "external",
      reviewRequestedFromMe: false,
    });
  });

  test("author wins over assignee when both URL lists overlap", () => {
    const shared = row({
      id: "shared#13",
      url: "https://github.com/shared/thing/pull/13",
      ownership: "unknown",
    });
    const scoped = applyViewerScope([shared], {
      authoredUrls: [shared.url],
      reviewRequestedUrls: [],
      assigneeUrls: [shared.url],
      mentionedUrls: [shared.url],
      ownedUrls: [shared.url],
      error: null,
      inboxItems: [],
    });

    expect(scoped[0]?.ownership).toBe("mine");
    expect(scoped[0]?.reviewRequestedFromMe).toBe(false);
  });

  test("treats owner URLs as external and yields no review request", () => {
    const onlyOwned = row({
      id: "private/owned#21",
      url: "https://github.com/private/owned/pull/21",
      ownership: "unknown",
      reviewDecision: null,
    });
    const scoped = applyViewerScope([onlyOwned], {
      authoredUrls: [],
      reviewRequestedUrls: [],
      assigneeUrls: [],
      mentionedUrls: [],
      ownedUrls: [onlyOwned.url],
      error: null,
      inboxItems: [],
    });

    expect(scoped[0]).toMatchObject({
      ownership: "external",
      reviewRequestedFromMe: false,
    });
  });

  test("owner scope does not override an authored or requested review", () => {
    const authored = row({
      id: "private/mine#1",
      url: "https://github.com/private/mine/pull/1",
      ownership: "unknown",
    });
    const reviewed = row({
      id: "private/review#2",
      url: "https://github.com/private/review/pull/2",
      ownership: "unknown",
      reviewDecision: "pending",
    });
    const scoped = applyViewerScope([authored, reviewed], {
      authoredUrls: [authored.url],
      reviewRequestedUrls: [reviewed.url],
      assigneeUrls: [],
      mentionedUrls: [],
      ownedUrls: [authored.url, reviewed.url],
      error: null,
      inboxItems: [],
    });

    expect(scoped.find((item) => item.id === authored.id)?.ownership).toBe("mine");
    expect(scoped.find((item) => item.id === reviewed.id)).toMatchObject({
      ownership: "external",
      reviewRequestedFromMe: true,
    });
  });
});

describe("GitHub inbox owner role", () => {
  test("mergeInboxRows treats owner-role items as external, no review request", () => {
    const inboxItem: GitHubInboxItem = {
      id: "PR_OWN",
      number: 21,
      url: "https://github.com/private/owned/pull/21",
      title: "Private repo PR",
      repository: "private/owned",
      author: "someone",
      authorKind: "human",
      createdAt: "2026-09-01T08:00:00.000Z",
      updatedAt: "2026-09-02T08:00:00.000Z",
      baseRefName: "main",
      headRefName: "fix/owned",
      isDraft: false,
      isSecurity: false,
      comments: 0,
      labels: [],
      mergeable: "MERGEABLE",
      mergeStateStatus: "CLEAN",
      checksStatus: "success",
      reviewDecision: null,
      role: "owner",
      changes: ["New PR"],
    };
    const snapshot = buildRadarSnapshot([], []);
    const [merged] = mergeInboxRows(snapshot, [inboxItem]);

    expect(merged).toMatchObject({
      id: "private/owned#21",
      ownership: "external",
      reviewRequestedFromMe: false,
      changes: ["New PR"],
    });
  });
});

describe("radar snapshot", () => {
  test("deduplicates one PR across workspaces and retains every agent", () => {
    const snapshot = buildRadarSnapshot(
      [workspace("workspace-1"), workspace("workspace-2")],
      [entry("workspace-1"), entry("workspace-2", { status: "running" })],
      new Date("2026-08-30T10:00:00.000Z"),
    );

    expect(snapshot.rows).toHaveLength(1);
    expect(snapshot.rows[0]?.workspaceIds).toEqual(["workspace-1", "workspace-2"]);
    expect(snapshot.rows[0]?.agents).toHaveLength(2);
    expect(snapshot.rows[0]?.bucket).toBe("being-handled");
  });

  test("ignores closed and merged pull requests", () => {
    const closed = workspace("closed", {
      pullRequest: {
        ...workspace("template").githubRuntime?.pullRequest,
        state: "closed",
      } as NonNullable<PaseoWorkspace["githubRuntime"]>["pullRequest"],
    });
    const merged = workspace("merged", {
      pullRequest: {
        ...workspace("template").githubRuntime?.pullRequest,
        isMerged: true,
      } as NonNullable<PaseoWorkspace["githubRuntime"]>["pullRequest"],
    });

    expect(buildRadarSnapshot([closed, merged], []).rows).toEqual([]);
  });

  test("does not expose pull requests with non-HTTPS URLs", () => {
    const template = workspace("template").githubRuntime?.pullRequest;
    if (!template) throw new Error("expected pull request fixture");
    const insecure = workspace("insecure", {
      pullRequest: { ...template, url: "http://github.com/getpaseo/paseo/pull/42" },
    });
    const executable = workspace("executable", {
      pullRequest: { ...template, url: "javascript:alert(1)" },
    });

    expect(buildRadarSnapshot([insecure, executable], []).rows).toEqual([]);
  });

  test("preserves per-workspace forge errors", () => {
    const snapshot = buildRadarSnapshot(
      [workspace("broken", { pullRequest: null, error: { message: "gh timed out" } })],
      [],
    );

    expect(snapshot.warnings).toEqual([
      { workspaceId: "broken", workspaceName: "Workspace broken", message: "gh timed out" },
    ]);
  });
  test("sorts snapshots by bucket, activity, and title", () => {
    const template = workspace("template").githubRuntime?.pullRequest;
    if (!template) throw new Error("expected pull request fixture");
    const candidate = (
      id: string,
      number: number,
      title: string,
      activityAt: string,
      checksStatus: "pending" | "success" = "pending",
    ): PaseoWorkspace => ({
      ...workspace(id, {
        pullRequest: {
          ...template,
          number,
          url: `https://github.com/getpaseo/paseo/pull/${number}`,
          title,
          checksStatus,
          reviewDecision: checksStatus === "success" ? "approved" : null,
        },
      }),
      activityAt,
    });

    const snapshot = buildRadarSnapshot(
      [
        candidate("later", 1, "Later", "2026-08-30T11:00:00.000Z"),
        candidate("zulu", 2, "Zulu", "2026-08-30T10:00:00.000Z"),
        candidate("alpha", 3, "Alpha", "2026-08-30T10:00:00.000Z"),
        candidate("ready", 4, "Ready", "2026-08-30T09:00:00.000Z", "success"),
      ],
      [],
    );

    expect(snapshot.rows.map((item) => item.title)).toEqual(["Ready", "Alpha", "Zulu", "Later"]);
  });
});

describe("display helpers", () => {
  test("cycleWindowDays steps 7 → 30 → 90 and wraps", () => {
    expect(cycleWindowDays(7)).toBe(30);
    expect(cycleWindowDays(30)).toBe(90);
    expect(cycleWindowDays(90)).toBe(7);
  });

  test("cycleWindowDays recovers from an unknown value", () => {
    expect(cycleWindowDays(14)).toBe(30);
  });

  test("searches delivery and ownership fields", () => {
    const value = row();
    expect(matchesRow(value, "checkout")).toBe(true);
    expect(matchesRow(value, "agent")).toBe(false);
    expect(matchesRow(value, "getpaseo")).toBe(true);
  });

  test("summarizes check progress", () => {
    expect(
      checkSummary(
        row({
          checksStatus: "pending",
          checks: [
            { name: "lint", status: "success", url: null },
            { name: "test", status: "pending", url: null },
          ],
        }),
      ),
    ).toBe("1 of 2 checks passed");
  });

  test("summarizes empty, failing, and completed checks", () => {
    expect(checkSummary(row({ checks: [], checksStatus: "none" }))).toBe("No checks");
    expect(checkSummary(row({ checks: [], checksStatus: "success" }))).toBe("Checks passed");
    expect(checkSummary(row({ checks: [], checksStatus: "failure" }))).toBe("Checks failing");
    expect(checkSummary(row({ checks: [], checksStatus: "pending" }))).toBe("Checks running");
    expect(checkSummary(row({ checks: [{ name: "test", status: "failure", url: null }] }))).toBe(
      "1 of 1 checks failing",
    );
    expect(checkSummary(row())).toBe("1 check passed");
  });

  test("formats every activity age boundary", () => {
    const now = Date.parse("2026-08-30T10:30:00.000Z");
    expect(formatAge(null, now)).toBe("");
    expect(formatAge("invalid", now)).toBe("");
    expect(formatAge(new Date(now - 30_000).toISOString(), now)).toBe("now");
    expect(formatAge(new Date(now - 30 * 60_000).toISOString(), now)).toBe("30m");
    expect(formatAge(new Date(now - 90 * 60_000).toISOString(), now)).toBe("1h");
    expect(formatAge(new Date(now - 48 * 60 * 60_000).toISOString(), now)).toBe("2d");
  });
});

describe("merge gates", () => {
  function pr(overrides: Partial<PullRequestView> = {}): PullRequestView {
    return {
      state: "OPEN",
      isDraft: false,
      mergeable: "MERGEABLE",
      mergeStateStatus: "CLEAN",
      reviewDecision: "APPROVED",
      statusCheckRollup: [{ __typename: "CheckRun", status: "COMPLETED", conclusion: "SUCCESS" }],
      mergeCommitAllowed: true,
      squashCommitAllowed: true,
      rebaseCommitAllowed: false,
      mergeCommit: { oid: "abc123" },
      author: { login: "g0rdonL" },
      assignees: [],
      number: 1,
      url: "https://github.com/g0rdonL/private/pull/1",
      ...overrides,
    };
  }

  test("parses GitHub pull request URLs into owner/repo/number", () => {
    expect(parsePullRequestUrl("https://github.com/g0rdonL/private/pull/42")).toEqual({
      owner: "g0rdonL",
      repo: "private",
      number: 42,
    });
    expect(parsePullRequestUrl("http://github.com/g0rdonL/private/pull/42")).toBeNull();
    expect(parsePullRequestUrl("https://github.com/g0rdonL/private/issues/42")).toBeNull();
    expect(parsePullRequestUrl("https://github.com/g0rdonL/private/pull/abc")).toBeNull();
    expect(parsePullRequestUrl("https://example.com/g0rdonL/private/pull/1")).toBeNull();
  });

  test("passes gates for an open, approved, mergeable PR authored by viewer", () => {
    const result = gatesSatisfied(pr(), "g0rdonL");
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.allowedMethod).toBe("squash");
  });

  test("passes gates for an open, approved, mergeable PR assigned to viewer", () => {
    const result = gatesSatisfied(
      pr({ author: { login: "tom" }, assignees: [{ login: "g0rdonL" }] }),
      "g0rdonL",
    );
    expect(result.ok).toBe(true);
  });

  test("rejects merged or closed pull requests", () => {
    expect(gatesSatisfied(pr({ state: "MERGED" }), "g0rdonL").ok).toBe(false);
    expect(gatesSatisfied(pr({ state: "CLOSED" }), "g0rdonL").ok).toBe(false);
  });

  test("rejects drafts", () => {
    const result = gatesSatisfied(pr({ isDraft: true }), "g0rdonL");
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toMatch(/draft/i);
  });

  test("rejects unmergeable pull requests", () => {
    expect(gatesSatisfied(pr({ mergeable: "CONFLICTING" }), "g0rdonL").ok).toBe(false);
    expect(gatesSatisfied(pr({ mergeable: "UNKNOWN" }), "g0rdonL").ok).toBe(false);
  });

  test("rejects requested changes and missing required reviews", () => {
    expect(gatesSatisfied(pr({ reviewDecision: "CHANGES_REQUESTED" }), "g0rdonL").ok).toBe(false);
    expect(gatesSatisfied(pr({ reviewDecision: "REVIEW_REQUIRED" }), "g0rdonL").ok).toBe(false);
  });

  test("accepts repositories that require no review (empty or null decision)", () => {
    expect(gatesSatisfied(pr({ reviewDecision: "" }), "g0rdonL").ok).toBe(true);
    expect(gatesSatisfied(pr({ reviewDecision: null }), "g0rdonL").ok).toBe(true);
  });

  test("rejects failing checks", () => {
    const result = gatesSatisfied(
      pr({
        statusCheckRollup: [
          { __typename: "CheckRun", status: "COMPLETED", conclusion: "SUCCESS" },
          { __typename: "CheckRun", status: "COMPLETED", conclusion: "FAILURE" },
        ],
      }),
      "g0rdonL",
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toMatch(/checks are failure/i);
  });

  test("rejects running checks and failed commit statuses", () => {
    const running = pr({
      statusCheckRollup: [{ __typename: "CheckRun", status: "IN_PROGRESS", conclusion: null }],
    });
    expect(gatesSatisfied(running, "g0rdonL")).toMatchObject({
      ok: false,
      reason: expect.stringMatching(/pending/),
    });
    const status = pr({ statusCheckRollup: [{ __typename: "StatusContext", state: "ERROR" }] });
    expect(gatesSatisfied(status, "g0rdonL").ok).toBe(false);
  });

  test("treats skipped and neutral checks as passing", () => {
    const rollup = [
      { __typename: "CheckRun", status: "COMPLETED", conclusion: "SKIPPED" },
      { __typename: "CheckRun", status: "COMPLETED", conclusion: "NEUTRAL" },
      { __typename: "StatusContext", state: "SUCCESS" },
    ];
    expect(rollupState(rollup)).toBe("SUCCESS");
    expect(rollupState([])).toBeNull();
  });

  test("respects branch protection", () => {
    const result = gatesSatisfied(pr({ mergeStateStatus: "BLOCKED" }), "g0rdonL");
    expect(result).toMatchObject({
      ok: false,
      reason: expect.stringMatching(/branch protection/i),
    });
  });

  test("accepts no required checks (empty rollup)", () => {
    expect(gatesSatisfied(pr({ statusCheckRollup: null }), "g0rdonL").ok).toBe(true);
  });

  test("rejects viewers who are neither author nor assignee", () => {
    const result = gatesSatisfied(pr({ author: { login: "someone" }, assignees: [] }), "g0rdonL");
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toMatch(/author|assignee/i);
  });

  test("falls back to merge method when squash is not allowed", () => {
    const noSquash = pr({ squashCommitAllowed: false });
    expect(gatesSatisfied(noSquash, "g0rdonL")).toMatchObject({ ok: true, allowedMethod: "merge" });
    const noSquashOrMerge = pr({
      squashCommitAllowed: false,
      mergeCommitAllowed: false,
      rebaseCommitAllowed: true,
    });
    expect(gatesSatisfied(noSquashOrMerge, "g0rdonL")).toMatchObject({
      ok: true,
      allowedMethod: "rebase",
    });
    const nothing = pr({
      squashCommitAllowed: false,
      mergeCommitAllowed: false,
      rebaseCommitAllowed: false,
    });
    expect(gatesSatisfied(nothing, "g0rdonL").ok).toBe(false);
  });

  test("resolveMergeMethod honours explicit request when allowed", () => {
    expect(resolveMergeMethod(pr(), undefined)).toBe("squash");
    expect(resolveMergeMethod(pr(), "squash")).toBe("squash");
    expect(resolveMergeMethod(pr(), "merge")).toBe("merge");
    expect(resolveMergeMethod(pr({ rebaseCommitAllowed: true }), "rebase")).toBe("rebase");
  });

  test("resolveMergeMethod throws when an explicit method is not allowed", () => {
    expect(() => resolveMergeMethod(pr({ rebaseCommitAllowed: false }), "rebase")).toThrow(
      /rebase/,
    );
  });
});
