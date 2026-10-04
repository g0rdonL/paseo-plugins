import { execFile } from "node:child_process";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { promisify } from "node:util";
import type { z } from "zod";
import type { acknowledgeViewerScope, GitHubInboxItem, viewerScope } from "../shared/viewer-scope";
import { publishLauncherInbox } from "./launcher-inbox";

const execFileAsync = promisify(execFile);
const SEARCH_LIMIT = 100;
const ENRICHMENT_BATCH_SIZE = 20;
const COMMAND_TIMEOUT_MS = 15_000;
const MAX_BUFFER_BYTES = 16 * 1024 * 1024;
const statePath = join(homedir(), ".paseo", "plugin-data", "pr-radar", "inbox-state.json");
const SCOPE_SEARCH_LIMIT = 1000;

interface SearchRecord {
  id: string;
  number: number;
  title: string;
  url: string;
  isDraft: boolean;
  createdAt: string;
  updatedAt: string;
  author: { login: string; is_bot?: boolean; type?: string } | null;
  repository: { nameWithOwner: string };
  commentsCount: number;
  labels: Array<{ name: string }>;
}

interface Enrichment {
  id: string;
  baseRefName: string;
  headRefName: string;
  reviewDecision: "APPROVED" | "CHANGES_REQUESTED" | "REVIEW_REQUIRED" | null;
  mergeable: "UNKNOWN" | "MERGEABLE" | "CONFLICTING";
  mergeStateStatus: string;
  statusCheckRollup: { state: "SUCCESS" | "FAILURE" | "ERROR" | "PENDING" | "EXPECTED" } | null;
}

interface StoredItem {
  updatedAt: string;
  checksStatus: GitHubInboxItem["checksStatus"];
  reviewDecision: GitHubInboxItem["reviewDecision"];
  mergeable: GitHubInboxItem["mergeable"];
  mergeStateStatus: string | null;
}

interface StoredWindow {
  items: Record<string, StoredItem>;
  pendingChanges: Record<string, string[]>;
  acknowledgedAt: string | null;
}

interface StoredState {
  version: 3;
  windows: Record<string, StoredWindow>;
}

async function runGh(args: string[], timeout = COMMAND_TIMEOUT_MS): Promise<string> {
  const { stdout } = await execFileAsync("gh", args, {
    timeout,
    maxBuffer: MAX_BUFFER_BYTES,
    env: { ...process.env, GIT_TERMINAL_PROMPT: "0" },
  });
  return stdout.trim();
}

function delay(milliseconds: number): Promise<void> {
  const { promise, resolve } = Promise.withResolvers<void>();
  setTimeout(resolve, milliseconds);
  return promise;
}

async function viewerLogin(): Promise<string> {
  let lastError: unknown;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const login = await runGh(["api", "user", "--jq", ".login"]);
      if (login) return login;
    } catch (error) {
      lastError = error;
      if (attempt === 0) await delay(250);
    }
  }
  throw lastError instanceof Error
    ? lastError
    : new Error("GitHub CLI is not authenticated on this Paseo host.");
}

async function searchPullRequests(
  filter: "author" | "review-requested" | "assignee" | "mentions",
  viewer: string,
  since: string,
): Promise<SearchRecord[]> {
  const fields = [
    "id",
    "number",
    "title",
    "url",
    "isDraft",
    "createdAt",
    "updatedAt",
    "author",
    "repository",
    "commentsCount",
    "labels",
  ].join(",");
  const output = await runGh([
    "search",
    "prs",
    `--${filter}=${viewer}`,
    "--state=open",
    "--archived=false",
    `--updated=>=${since}`,
    `--limit=${SEARCH_LIMIT}`,
    "--sort=updated",
    "--order=desc",
    `--json=${fields}`,
  ]);
  return JSON.parse(output) as SearchRecord[];
}

async function searchScopeUrls(
  filter: "author" | "review-requested" | "assignee" | "mentions",
): Promise<string[]> {
  const output = await runGh([
    "search",
    "prs",
    `--${filter}=@me`,
    "--state=open",
    "--archived=false",
    `--limit=${SCOPE_SEARCH_LIMIT}`,
    "--json=url",
  ]);
  return (JSON.parse(output) as Array<{ url: string }>).map(({ url }) => url);
}

const REPO_SWEEP_BATCH_SIZE = 10;
const REPO_SWEEP_TIMEOUT_MS = 10_000;

interface PrListRecord {
  id: string;
  number: number;
  title: string;
  url: string;
  isDraft: boolean;
  createdAt: string;
  updatedAt: string;
  author: { login: string; is_bot?: boolean; type?: string } | null;
  comments: unknown[] | number;
  labels: Array<{ name: string }>;
}

function commentsCount(raw: PrListRecord["comments"]): number {
  if (Array.isArray(raw)) return raw.length;
  if (typeof raw === "number") return raw;
  return 0;
}

async function listOwnedRepos(viewer: string): Promise<string[]> {
  const output = await runGh([
    "repo",
    "list",
    viewer,
    "--visibility=private",
    "--json=name",
    `--limit=${SCOPE_SEARCH_LIMIT}`,
  ]);
  return (JSON.parse(output) as Array<{ name: string }>).map(({ name }) => name);
}

async function searchOwnedReposPullRequests(viewer: string): Promise<SearchRecord[]> {
  let repos: string[];
  try {
    repos = await listOwnedRepos(viewer);
  } catch (error) {
    console.error("PR Radar failed to enumerate owned repositories", error);
    return [];
  }
  if (repos.length === 0) return [];
  const batches: string[][] = [];
  for (let i = 0; i < repos.length; i += REPO_SWEEP_BATCH_SIZE) {
    batches.push(repos.slice(i, i + REPO_SWEEP_BATCH_SIZE));
  }
  const settled = await Promise.allSettled(
    batches.map(async (batch): Promise<SearchRecord[]> => {
      const perRepo = await Promise.all(
        batch.map(async (repo): Promise<SearchRecord[]> => {
          const output = await runGh(
            [
              "pr",
              "list",
              "--repo",
              `${viewer}/${repo}`,
              "--state=open",
              "--json",
              "id,number,title,url,isDraft,createdAt,updatedAt,author,comments,labels",
            ],
            REPO_SWEEP_TIMEOUT_MS,
          );
          const prs = JSON.parse(output) as PrListRecord[];
          const nameWithOwner = `${viewer}/${repo}`;
          return prs.map((pr) => ({
            id: pr.id,
            number: pr.number,
            title: pr.title,
            url: pr.url,
            isDraft: pr.isDraft,
            createdAt: pr.createdAt,
            updatedAt: pr.updatedAt,
            author: pr.author
              ? {
                  login: pr.author.login,
                  is_bot: pr.author.is_bot,
                  type: pr.author.type,
                }
              : null,
            repository: { nameWithOwner },
            commentsCount: commentsCount(pr.comments),
            labels: pr.labels ?? [],
          }));
        }),
      );
      return perRepo.flat();
    }),
  );
  const records: SearchRecord[] = [];
  for (const result of settled) {
    if (result.status === "fulfilled") records.push(...result.value);
  }
  return records;
}

const enrichmentQuery = `
  query($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on PullRequest {
        id
        baseRefName
        headRefName
        reviewDecision
        mergeable
        mergeStateStatus
        statusCheckRollup { state }
      }
    }
  }
`;

function chunks<T>(items: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    result.push(items.slice(index, index + size));
  }
  return result;
}

async function enrich(
  ids: string[],
): Promise<{ states: Map<string, Enrichment>; failures: number }> {
  const results = await Promise.allSettled(
    chunks(ids, ENRICHMENT_BATCH_SIZE).map(async (batch) => {
      const args = ["api", "graphql", "-f", `query=${enrichmentQuery}`];
      for (const id of batch) args.push("-F", `ids[]=${id}`);
      const payload = JSON.parse(await runGh(args, 10_000)) as {
        data?: { nodes?: Array<Enrichment | null> };
        errors?: Array<{ message: string }>;
      };
      if (!payload.data?.nodes) {
        throw new Error(payload.errors?.map(({ message }) => message).join("; ") || "No data");
      }
      return payload.data.nodes.filter((item): item is Enrichment => item !== null);
    }),
  );
  const states = new Map<string, Enrichment>();
  let failures = 0;
  for (const result of results) {
    if (result.status === "rejected") {
      failures += 1;
      continue;
    }
    for (const item of result.value) states.set(item.id, item);
  }
  return { states, failures };
}

function checksStatus(state: Enrichment | undefined): GitHubInboxItem["checksStatus"] {
  switch (state?.statusCheckRollup?.state) {
    case "SUCCESS":
      return "success";
    case "FAILURE":
    case "ERROR":
      return "failure";
    case "PENDING":
    case "EXPECTED":
      return "pending";
    default:
      return "none";
  }
}

function reviewDecision(state: Enrichment | undefined): GitHubInboxItem["reviewDecision"] {
  switch (state?.reviewDecision) {
    case "APPROVED":
      return "approved";
    case "CHANGES_REQUESTED":
      return "changes_requested";
    case "REVIEW_REQUIRED":
      return "pending";
    default:
      return null;
  }
}

function toInboxItem(
  record: SearchRecord,
  role: "author" | "reviewer" | "assignee" | "mention" | "owner",
  state: Enrichment | undefined,
): GitHubInboxItem {
  const labels = record.labels.map(({ name }) => name);
  const authorKind =
    record.author?.is_bot || record.author?.type === "Bot" || record.author?.login.endsWith("[bot]")
      ? "bot"
      : "human";
  return {
    id: record.id,
    number: record.number,
    url: record.url,
    title: record.title,
    repository: record.repository.nameWithOwner,
    author: record.author?.login ?? null,
    authorKind,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    baseRefName: state?.baseRefName ?? "",
    headRefName: state?.headRefName ?? "",
    isDraft: record.isDraft,
    isSecurity:
      labels.some((label) => /security|vulnerability|cve/i.test(label)) ||
      /security|vulnerabilit|\bcve\b/i.test(record.title),
    comments: record.commentsCount,
    labels,
    mergeable: state?.mergeable ?? "UNKNOWN",
    mergeStateStatus: state?.mergeStateStatus ?? null,
    checksStatus: checksStatus(state),
    reviewDecision: reviewDecision(state),
    role,
    changes: [],
  };
}

async function readState(): Promise<StoredState> {
  try {
    const state = JSON.parse(await readFile(statePath, "utf8")) as StoredState;
    if (state.version === 3 && state.windows && typeof state.windows === "object") return state;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      console.error("PR Radar ignored unreadable inbox state", error);
    }
  }
  return { version: 3, windows: {} };
}

let writeSequence = 0;

async function writeState(state: StoredState): Promise<void> {
  await mkdir(dirname(statePath), { recursive: true });
  // Unique per write: overlapping writes must not rename each other's temp file away.
  const temporaryPath = `${statePath}.${process.pid}.${++writeSequence}.tmp`;
  await writeFile(temporaryPath, `${JSON.stringify(state)}\n`, { mode: 0o600 });
  await rename(temporaryPath, statePath);
}

let stateQueue: Promise<unknown> = Promise.resolve();

/**
 * Serialised read-modify-write of the state file. A refresh takes seconds; without this an
 * acknowledgement made meanwhile would be overwritten by the refresh's stale copy.
 */
function updateState<T>(change: (state: StoredState) => T): Promise<T> {
  const run = stateQueue.then(async () => {
    const state = await readState();
    const result = change(state);
    await writeState(state);
    return result;
  });
  stateQueue = run.catch(() => undefined);
  return run;
}

function storedItem(item: GitHubInboxItem): StoredItem {
  return {
    updatedAt: item.updatedAt,
    checksStatus: item.checksStatus,
    reviewDecision: item.reviewDecision,
    mergeable: item.mergeable,
    mergeStateStatus: item.mergeStateStatus,
  };
}

function detectChanges(previous: StoredItem | undefined, item: GitHubInboxItem): string[] {
  if (!previous) return ["New PR"];
  const changes = new Set<string>();
  if (previous.updatedAt !== item.updatedAt) changes.add("New activity");
  if (previous.checksStatus !== item.checksStatus) {
    changes.add(`Checks: ${previous.checksStatus} → ${item.checksStatus}`);
  }
  if (previous.reviewDecision !== item.reviewDecision) {
    changes.add(`Review: ${previous.reviewDecision ?? "none"} → ${item.reviewDecision ?? "none"}`);
  }
  if (previous.mergeable !== item.mergeable) {
    changes.add(`Mergeable: ${previous.mergeable.toLowerCase()} → ${item.mergeable.toLowerCase()}`);
  }
  if (previous.mergeStateStatus !== item.mergeStateStatus) {
    changes.add(
      `Merge state: ${previous.mergeStateStatus ?? "unknown"} → ${item.mergeStateStatus ?? "unknown"}`,
    );
  }
  return [...changes];
}

type ViewerScopeOutput = z.input<typeof viewerScope.output>;

/** Everything one GitHub refresh learns for a window; independent of the URLs a client asks about. */
interface Snapshot {
  viewer: string;
  authored: SearchRecord[];
  reviewRequested: SearchRecord[];
  assigned: SearchRecord[];
  mentioned: SearchRecord[];
  authoredScope: string[];
  reviewRequestedScope: string[];
  assignedScope: string[];
  mentionedScope: string[];
  ownedRepos: SearchRecord[];
  inboxItems: GitHubInboxItem[];
  enrichmentFailures: number;
  acknowledgedAt: string | null;
}

/** The expensive part: ~5 s of gh searches, a per-repo sweep, and GraphQL enrichment. */
async function fetchSnapshot(windowDays: number): Promise<Snapshot> {
  const viewer = await viewerLogin();
  const since = new Date(Date.now() - windowDays * 24 * 60 * 60 * 1_000).toISOString().slice(0, 10);
  const [
    authored,
    reviewRequested,
    assigned,
    mentioned,
    authoredScope,
    reviewRequestedScope,
    assignedScope,
    mentionedScope,
    ownedRepos,
  ] = await Promise.all([
    searchPullRequests("author", viewer, since),
    searchPullRequests("review-requested", viewer, since),
    searchPullRequests("assignee", viewer, since),
    searchPullRequests("mentions", viewer, since),
    searchScopeUrls("author"),
    searchScopeUrls("review-requested"),
    searchScopeUrls("assignee"),
    searchScopeUrls("mentions"),
    searchOwnedReposPullRequests(viewer),
  ]);
  // Merge priority: author > assignee > reviewer > mention > owner (most "owning" role wins on overlap).
  const records = new Map<string, { record: SearchRecord; role: GitHubInboxItem["role"] }>();
  for (const record of ownedRepos) records.set(record.id, { record, role: "owner" });
  for (const record of mentioned) records.set(record.id, { record, role: "mention" });
  for (const record of reviewRequested) records.set(record.id, { record, role: "reviewer" });
  for (const record of assigned) records.set(record.id, { record, role: "assignee" });
  for (const record of authored) records.set(record.id, { record, role: "author" });
  const enrichment = await enrich([...records.keys()]);
  const inboxItems = [...records.values()].map(({ record, role }) =>
    toInboxItem(record, role, enrichment.states.get(record.id)),
  );

  // Change tracking reads the state only now, after the slow GitHub work, inside the queue.
  const key = String(windowDays);
  const acknowledgedAt = await updateState((stored) => {
    const previous = stored.windows[key] ?? { items: {}, pendingChanges: {}, acknowledgedAt: null };
    const initialized = Object.keys(previous.items).length > 0;
    const nextItems: Record<string, StoredItem> = {};
    const nextPending: Record<string, string[]> = {};
    for (const item of inboxItems) {
      const prior = previous.items[item.id];
      const detected =
        initialized && (!prior || enrichment.states.has(item.id)) ? detectChanges(prior, item) : [];
      item.changes = [...new Set([...(previous.pendingChanges[item.id] ?? []), ...detected])];
      nextItems[item.id] = prior && !enrichment.states.has(item.id) ? prior : storedItem(item);
      if (item.changes.length > 0) nextPending[item.id] = item.changes;
    }
    stored.windows[key] = {
      items: nextItems,
      pendingChanges: nextPending,
      acknowledgedAt: previous.acknowledgedAt,
    };
    return previous.acknowledgedAt;
  });

  return {
    viewer,
    authored,
    reviewRequested,
    assigned,
    mentioned,
    authoredScope,
    reviewRequestedScope,
    assignedScope,
    mentionedScope,
    ownedRepos,
    inboxItems,
    enrichmentFailures: enrichment.failures,
    acknowledgedAt,
  };
}

/** The cheap part: shape a snapshot for the URLs this client knows about. */
export function projectSnapshot(snapshot: Snapshot, urls: string[]): ViewerScopeOutput {
  const requestedUrls = new Set(urls.map((url) => url.toLowerCase()));
  const withScope = (direct: SearchRecord[], scope: string[]) => [
    ...new Set([
      ...direct.map(({ url }) => url),
      ...scope.filter((url) => requestedUrls.has(url.toLowerCase())),
    ]),
  ];
  const coverageNote =
    snapshot.enrichmentFailures > 0
      ? `${snapshot.enrichmentFailures} GitHub detail request${snapshot.enrichmentFailures === 1 ? "" : "s"} failed; affected PRs use conservative states.`
      : `Open PRs where you are author, assignee, reviewer, mentioned, or in a repository you own. Organization SSO restrictions may omit results.`;
  return {
    viewer: snapshot.viewer,
    authoredUrls: withScope(snapshot.authored, snapshot.authoredScope),
    reviewRequestedUrls: withScope(snapshot.reviewRequested, snapshot.reviewRequestedScope),
    assigneeUrls: withScope(snapshot.assigned, snapshot.assignedScope),
    mentionedUrls: withScope(snapshot.mentioned, snapshot.mentionedScope),
    ownedUrls: [...new Set([...snapshot.ownedRepos.map(({ url }) => url), ...requestedUrls])],
    inboxItems: snapshot.inboxItems,
    truncated:
      snapshot.authored.length === SEARCH_LIMIT ||
      snapshot.reviewRequested.length === SEARCH_LIMIT ||
      snapshot.assigned.length === SEARCH_LIMIT ||
      snapshot.mentioned.length === SEARCH_LIMIT,
    coverageNote,
    updates: snapshot.inboxItems.filter(({ changes }) => changes.length > 0).length,
    acknowledgedAt: snapshot.acknowledgedAt,
    error: null,
  };
}

function errorOutput(error: unknown): ViewerScopeOutput {
  return {
    viewer: null,
    authoredUrls: [],
    reviewRequestedUrls: [],
    assigneeUrls: [],
    mentionedUrls: [],
    ownedUrls: [],
    inboxItems: [],
    truncated: false,
    coverageNote: "GitHub inbox data is unavailable.",
    updates: 0,
    acknowledgedAt: null,
    error: error instanceof Error ? error.message : "GitHub viewer scope is unavailable.",
  };
}

// ---------------------------------------------------------------------------
// Background cache. The plugin's server process is long-lived, so it keeps the last snapshot per
// window and refreshes it on a timer; client requests are answered from memory.
// ---------------------------------------------------------------------------

export const BACKGROUND_INTERVAL_MS = 2 * 60_000;
/** A request older than this triggers a refresh in the background (still answered from cache). */
export const STALE_AFTER_MS = 60_000;
/** Windows nobody has asked about for this long stop being refreshed. */
const WINDOW_IDLE_MS = 30 * 60_000;
const DEFAULT_WINDOW_DAYS = 30;

const snapshots = new Map<number, { snapshot: Snapshot; at: number }>();
const inflight = new Map<number, Promise<Snapshot>>();
const lastRequested = new Map<number, number>([[DEFAULT_WINDOW_DAYS, Date.now()]]);

/** Single-flight refresh: concurrent callers share one GitHub sweep. */
function refreshWindow(windowDays: number): Promise<Snapshot> {
  const running = inflight.get(windowDays);
  if (running) return running;
  const started = Date.now();
  const promise = fetchSnapshot(windowDays)
    .then((snapshot) => {
      snapshots.set(windowDays, { snapshot, at: Date.now() });
      if (windowDays === DEFAULT_WINDOW_DAYS) void publishLauncherInbox(snapshot.inboxItems);
      console.log(
        `PR Radar: refreshed ${windowDays}d window in ${((Date.now() - started) / 1000).toFixed(1)}s (${snapshot.inboxItems.length} PRs)`,
      );
      return snapshot;
    })
    .finally(() => inflight.delete(windowDays));
  inflight.set(windowDays, promise);
  return promise;
}

function refreshInBackground(windowDays: number): void {
  refreshWindow(windowDays).catch((error) => {
    // Keep serving the last good snapshot.
    console.error(`PR Radar: background refresh of ${windowDays}d window failed`, error);
  });
}

/** Starts the refresh timer; returns a stop function for the plugin's cleanup. */
export function startBackgroundRefresh(intervalMs = BACKGROUND_INTERVAL_MS): () => void {
  const tick = () => {
    const now = Date.now();
    for (const [windowDays, requestedAt] of lastRequested) {
      if (windowDays !== DEFAULT_WINDOW_DAYS && now - requestedAt > WINDOW_IDLE_MS) {
        lastRequested.delete(windowDays);
        continue;
      }
      refreshInBackground(windowDays);
    }
  };
  tick();
  const timer = setInterval(tick, intervalMs);
  timer.unref?.();
  return () => clearInterval(timer);
}

export async function resolveViewerScope({
  urls,
  windowDays,
}: z.output<typeof viewerScope.input>): Promise<ViewerScopeOutput> {
  lastRequested.set(windowDays, Date.now());
  const cached = snapshots.get(windowDays);
  if (cached) {
    if (Date.now() - cached.at > STALE_AFTER_MS) refreshInBackground(windowDays);
    return projectSnapshot(cached.snapshot, urls);
  }
  // First request for this window (or the startup refresh is still running): wait once.
  try {
    return projectSnapshot(await refreshWindow(windowDays), urls);
  } catch (error) {
    console.error("PR Radar GitHub inbox refresh failed", error);
    return errorOutput(error);
  }
}

/** Test seam: waits for running refreshes so tests do not bleed into each other. */
export async function resetViewerScopeCache(): Promise<void> {
  await Promise.allSettled([...inflight.values()]);
  await stateQueue;
  snapshots.clear();
  inflight.clear();
  lastRequested.clear();
  lastRequested.set(DEFAULT_WINDOW_DAYS, Date.now());
}

export async function acknowledgeViewerUpdates({
  windowDays,
}: z.output<typeof acknowledgeViewerScope.input>): Promise<
  z.input<typeof acknowledgeViewerScope.output>
> {
  const key = String(windowDays);
  const acknowledgedAt = new Date().toISOString();
  await updateState((state) => {
    const current = state.windows[key] ?? { items: {}, pendingChanges: {}, acknowledgedAt: null };
    state.windows[key] = { ...current, pendingChanges: {}, acknowledgedAt };
  });
  // Keep the cached snapshot in step so the badge clears without waiting for a refresh.
  const cached = snapshots.get(windowDays);
  if (cached) {
    cached.snapshot = {
      ...cached.snapshot,
      acknowledgedAt,
      inboxItems: cached.snapshot.inboxItems.map((item) => ({ ...item, changes: [] })),
    };
    if (windowDays === DEFAULT_WINDOW_DAYS) await publishLauncherInbox(cached.snapshot.inboxItems);
  }
  return { acknowledgedAt };
}

export async function runGhPublic(args: string[], timeout?: number): Promise<string> {
  return runGh(args, timeout);
}

export function viewerLoginPublic(): Promise<string> {
  return viewerLogin();
}

export async function invalidateInboxState(): Promise<void> {
  // Force the next resolveViewerScope to re-detect by clearing stored state.
  // Used after merge/ready actions so the radar reflects the new PR status.
  await updateState((state) => {
    state.windows = {};
  });
  // The merged/readied PR changed state: refresh now rather than on the next tick.
  for (const windowDays of snapshots.keys()) refreshInBackground(windowDays);
}
