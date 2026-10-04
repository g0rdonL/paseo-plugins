import type { z } from "zod";
import type {
  markPullRequestReady,
  mergePullRequest,
} from "../shared/viewer-scope";
import { HttpsUrlSchema } from "../shared/viewer-scope";
import {
  invalidateInboxState,
  runGhPublic,
  viewerLoginPublic,
} from "./viewer-scope";

const FETCH_TIMEOUT_MS = 15_000;
const MERGE_TIMEOUT_MS = 30_000;

export interface PullRequestIdentity {
  owner: string;
  repo: string;
  number: number;
}

/** One entry of `gh pr view --json statusCheckRollup`: a CheckRun or a commit StatusContext. */
export interface RollupEntry {
  __typename?: string;
  status?: string | null;
  conclusion?: string | null;
  state?: string | null;
}

export interface PullRequestView {
  state: "OPEN" | "CLOSED" | "MERGED";
  isDraft: boolean;
  mergeable: "MERGEABLE" | "CONFLICTING" | "UNKNOWN";
  mergeStateStatus: string;
  /** Empty or null when the repository requires no review. */
  reviewDecision: "APPROVED" | "CHANGES_REQUESTED" | "REVIEW_REQUIRED" | "" | null;
  statusCheckRollup: RollupEntry[] | null;
  /** Repository merge settings (`gh api repos/{owner}/{repo}`); not pull request fields. */
  mergeCommitAllowed: boolean;
  squashCommitAllowed: boolean;
  rebaseCommitAllowed: boolean;
  mergeCommit: { oid: string } | null;
  author: { login: string } | null;
  assignees: Array<{ login: string }>;
  number: number;
  url: string;
}

export function parsePullRequestUrl(raw: string): PullRequestIdentity | null {
  const parsed = HttpsUrlSchema.safeParse(raw);
  if (!parsed.success) return null;
  const url = new URL(parsed.data);
  if (url.hostname !== "github.com") return null;
  const segments = url.pathname.split("/").filter(Boolean);
  if (segments.length < 4 || segments[2] !== "pull") return null;
  const number = Number(segments[3]);
  if (!Number.isInteger(number) || number <= 0) return null;
  return { owner: segments[0], repo: segments[1], number };
}

const FAILED_CONCLUSIONS = new Set([
  "FAILURE",
  "TIMED_OUT",
  "CANCELLED",
  "ACTION_REQUIRED",
  "STARTUP_FAILURE",
  "STALE",
]);

/** Summarises the check list: any failure wins, then anything still running, else success. */
export function rollupState(checks: RollupEntry[] | null): "SUCCESS" | "PENDING" | "FAILURE" | null {
  if (!checks || checks.length === 0) return null;
  let pending = false;
  for (const check of checks) {
    if (check.__typename === "StatusContext" || (check.state && !check.status)) {
      const state = (check.state ?? "").toUpperCase();
      if (state === "FAILURE" || state === "ERROR") return "FAILURE";
      if (state !== "SUCCESS") pending = true;
      continue;
    }
    if ((check.status ?? "").toUpperCase() !== "COMPLETED") {
      pending = true;
      continue;
    }
    if (FAILED_CONCLUSIONS.has((check.conclusion ?? "").toUpperCase())) return "FAILURE";
  }
  return pending ? "PENDING" : "SUCCESS";
}

async function fetchMergeSettings(
  identity: PullRequestIdentity,
): Promise<Pick<PullRequestView, "mergeCommitAllowed" | "squashCommitAllowed" | "rebaseCommitAllowed">> {
  const output = await runGhPublic(
    [
      "api",
      `repos/${identity.owner}/${identity.repo}`,
      "--jq",
      "{mergeCommitAllowed: .allow_merge_commit, squashCommitAllowed: .allow_squash_merge, rebaseCommitAllowed: .allow_rebase_merge}",
    ],
    FETCH_TIMEOUT_MS,
  );
  const settings = JSON.parse(output) as Record<string, boolean | null>;
  // Without push access GitHub omits these; assume GitHub's defaults rather than refusing.
  return {
    mergeCommitAllowed: settings.mergeCommitAllowed ?? true,
    squashCommitAllowed: settings.squashCommitAllowed ?? true,
    rebaseCommitAllowed: settings.rebaseCommitAllowed ?? true,
  };
}

async function fetchPullRequest(url: string): Promise<PullRequestView> {
  const identity = parsePullRequestUrl(url);
  if (!identity) throw new Error("Invalid pull request URL.");
  const output = await runGhPublic(
    [
      "pr",
      "view",
      url,
      "--json",
      [
        "state",
        "isDraft",
        "mergeable",
        "mergeStateStatus",
        "reviewDecision",
        "statusCheckRollup",
        "mergeCommit",
        "author",
        "assignees",
        "number",
        "url",
      ].join(","),
    ],
    FETCH_TIMEOUT_MS,
  );
  const pr = JSON.parse(output) as Omit<
    PullRequestView,
    "mergeCommitAllowed" | "squashCommitAllowed" | "rebaseCommitAllowed"
  >;
  return { ...pr, ...(await fetchMergeSettings(identity)) };
}

export function gatesSatisfied(
  pr: PullRequestView,
  viewer: string,
): { ok: true; allowedMethod: "merge" | "squash" | "rebase" | null } | { ok: false; reason: string } {
  if (pr.state !== "OPEN") return { ok: false, reason: `Pull request is ${pr.state.toLowerCase()}, not open.` };
  if (pr.isDraft) return { ok: false, reason: "Draft pull requests must be marked ready before merging." };
  const isAuthor = pr.author?.login === viewer;
  const isAssignee = pr.assignees.some(({ login }) => login === viewer);
  if (!isAuthor && !isAssignee) {
    return { ok: false, reason: "Only the author or an assignee can merge this pull request." };
  }
  if (pr.mergeable !== "MERGEABLE") {
    return { ok: false, reason: `Pull request is ${pr.mergeable.toLowerCase()}, not mergeable.` };
  }
  // GitHub reports an empty decision when the repository requires no review.
  if (pr.reviewDecision === "CHANGES_REQUESTED") {
    return { ok: false, reason: "Changes were requested in review." };
  }
  if (pr.reviewDecision === "REVIEW_REQUIRED") {
    return { ok: false, reason: "Required reviews are not approved." };
  }
  const rollup = rollupState(pr.statusCheckRollup);
  if (rollup && rollup !== "SUCCESS") {
    return { ok: false, reason: `Checks are ${rollup.toLowerCase()}, not success.` };
  }
  if (pr.mergeStateStatus === "BLOCKED") {
    return { ok: false, reason: "Branch protection rules are not satisfied yet." };
  }
  const allowedMethod = pr.squashCommitAllowed
    ? "squash"
    : pr.mergeCommitAllowed
      ? "merge"
      : pr.rebaseCommitAllowed
        ? "rebase"
        : null;
  if (!allowedMethod) return { ok: false, reason: "Repository does not allow any merge method." };
  return { ok: true, allowedMethod };
}

export function resolveMergeMethod(
  pr: PullRequestView,
  requested: "merge" | "squash" | "rebase" | undefined,
): "merge" | "squash" | "rebase" {
  const allowed = {
    merge: pr.mergeCommitAllowed,
    squash: pr.squashCommitAllowed,
    rebase: pr.rebaseCommitAllowed,
  };
  if (requested) {
    if (!allowed[requested]) {
      throw new Error(`Repository does not allow the ${requested} merge method.`);
    }
    return requested;
  }
  if (allowed.squash) return "squash";
  if (allowed.merge) return "merge";
  if (allowed.rebase) return "rebase";
  throw new Error("Repository does not allow any merge method.");
}

export async function performMerge({
  url,
  method,
  deleteBranch,
}: z.output<typeof mergePullRequest.input>): Promise<z.input<typeof mergePullRequest.output>> {
  if (!parsePullRequestUrl(url)) {
    return { mergedAt: null, method: null, sha: null, error: "Invalid pull request URL." };
  }
  let viewer: string;
  try {
    viewer = await viewerLoginPublic();
  } catch (error) {
    return {
      mergedAt: null,
      method: null,
      sha: null,
      error: error instanceof Error ? error.message : "GitHub CLI is not authenticated.",
    };
  }

  let pr: PullRequestView;
  try {
    pr = await fetchPullRequest(url);
  } catch (error) {
    return {
      mergedAt: null,
      method: null,
      sha: null,
      error: error instanceof Error ? error.message : "Could not read pull request.",
    };
  }

  const gates = gatesSatisfied(pr, viewer);
  if (!gates.ok) {
    return { mergedAt: null, method: null, sha: null, error: gates.reason };
  }

  let chosen: "merge" | "squash" | "rebase";
  try {
    chosen = resolveMergeMethod(pr, method);
  } catch (error) {
    return {
      mergedAt: null,
      method: null,
      sha: null,
      error: error instanceof Error ? error.message : "Merge method unavailable.",
    };
  }

  const args = ["pr", "merge", url, `--${chosen}`];
  if (deleteBranch) args.push("--delete-branch");

  try {
    await runGhPublic(args, MERGE_TIMEOUT_MS);
  } catch (error) {
    return {
      mergedAt: null,
      method: null,
      sha: null,
      error: error instanceof Error ? error.message : "GitHub rejected the merge.",
    };
  }

  let sha: string | null = pr.mergeCommit?.oid ?? null;
  if (!sha) {
    try {
      const after = await fetchPullRequest(url);
      sha = after.mergeCommit?.oid ?? null;
    } catch {
      sha = null;
    }
  }

  try {
    await invalidateInboxState();
  } catch (error) {
    console.error("PR Radar: invalidate inbox state after merge failed", error);
  }

  return {
    mergedAt: new Date().toISOString(),
    method: chosen,
    sha,
    error: null,
  };
}

export async function performMarkReady({
  url,
}: z.output<typeof markPullRequestReady.input>): Promise<z.input<typeof markPullRequestReady.output>> {
  if (!parsePullRequestUrl(url)) {
    return { readyAt: null, error: "Invalid pull request URL." };
  }
  let viewer: string;
  try {
    viewer = await viewerLoginPublic();
  } catch (error) {
    return {
      readyAt: null,
      error: error instanceof Error ? error.message : "GitHub CLI is not authenticated.",
    };
  }

  let pr: PullRequestView;
  try {
    pr = await fetchPullRequest(url);
  } catch (error) {
    return {
      readyAt: null,
      error: error instanceof Error ? error.message : "Could not read pull request.",
    };
  }

  const isAuthor = pr.author?.login === viewer;
  const isAssignee = pr.assignees.some(({ login }) => login === viewer);
  if (!isAuthor && !isAssignee) {
    return { readyAt: null, error: "Only the author or an assignee can mark this pull request ready." };
  }
  if (pr.state !== "OPEN") {
    return { readyAt: null, error: `Pull request is ${pr.state.toLowerCase()}, not open.` };
  }
  if (!pr.isDraft) {
    return { readyAt: null, error: "Pull request is already ready for review." };
  }

  try {
    await runGhPublic(["pr", "ready", url], FETCH_TIMEOUT_MS);
  } catch (error) {
    return {
      readyAt: null,
      error: error instanceof Error ? error.message : "GitHub rejected marking the pull request ready.",
    };
  }

  try {
    await invalidateInboxState();
  } catch (error) {
    console.error("PR Radar: invalidate inbox state after mark-ready failed", error);
  }

  return { readyAt: new Date().toISOString(), error: null };
}