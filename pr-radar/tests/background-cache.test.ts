import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeEach, describe, expect, test, vi } from "vitest";

const { gh, home } = vi.hoisted(() => ({
  gh: {
    calls: [] as string[][],
    fail: false,
    /** Authors returned by the GraphQL author lookup, keyed by lowercased PR URL. */
    authors: {} as Record<string, string>,
    /** Resolves pending gh calls when set; lets a test hold a refresh open. */
    gate: null as Promise<void> | null,
  },
  home: { dir: "" },
}));

vi.mock("node:os", async (importOriginal) => {
  const actual = await importOriginal<typeof import("node:os")>();
  return { ...actual, homedir: () => home.dir };
});

vi.mock("node:child_process", () => ({
  execFile: (
    _command: string,
    args: string[],
    _options: unknown,
    callback: (error: Error | null, result?: { stdout: string; stderr: string }) => void,
  ) => {
    gh.calls.push(args);
    const respond = () => {
      if (gh.fail) return callback(new Error("gh: network down"));
      let stdout = args[0] === "api" && args[1] === "user" ? "testuser\n" : "[]";
      if (args[1] === "graphql" && args.some((arg) => arg.includes("resource(url:"))) {
        const data: Record<string, unknown> = {};
        for (const arg of args) {
          const match = /^u(\d+)=(.+)$/.exec(arg);
          if (!match) continue;
          const login = gh.authors[match[2].toLowerCase()];
          data[`p${match[1]}`] = login ? { author: { login } } : null;
        }
        stdout = JSON.stringify({ data });
      }
      callback(null, { stdout, stderr: "" });
    };
    if (gh.gate) void gh.gate.then(respond);
    else respond();
  },
}));

home.dir = mkdtempSync(join(tmpdir(), "pr-radar-cache-"));

const {
  acknowledgeViewerUpdates,
  resolveViewerScope,
  MAX_STALE_MS,
  resetViewerScopeCache,
  startBackgroundRefresh,
  STALE_AFTER_MS,
} = await import("../server/viewer-scope");

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));
const loginCalls = () => gh.calls.filter((args) => args[0] === "api" && args[1] === "user").length;

describe("background cache", () => {
  beforeEach(async () => {
    gh.fail = false;
    gh.gate = null;
    vi.useRealTimers();
    // Paseo sets PASEO_HOME for agents; keep the state file in the temp home either way.
    vi.stubEnv("PASEO_HOME", join(home.dir, ".paseo"));
    await resetViewerScopeCache();
    gh.calls = [];
  });

  afterAll(() => rmSync(home.dir, { recursive: true, force: true }));

  test("overlapping refreshes of different windows both persist", async () => {
    const stateFile = join(home.dir, ".paseo", "plugin-data", "pr-radar", "inbox-state.json");
    rmSync(stateFile, { force: true });
    const [week, month] = await Promise.all([
      resolveViewerScope({ urls: [], windowDays: 7 }),
      resolveViewerScope({ urls: [], windowDays: 30 }),
    ]);
    expect(week.error).toBeNull();
    expect(month.error).toBeNull();
    const state = JSON.parse(readFileSync(stateFile, "utf8"));
    expect(Object.keys(state.windows).sort()).toEqual(["30", "7"]);
  });

  test("an acknowledgement made during a refresh is not overwritten", async () => {
    await resolveViewerScope({ urls: [], windowDays: 30 });
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(Date.now() + STALE_AFTER_MS + 1_000);
    let release!: () => void;
    gh.gate = new Promise((resolve) => {
      release = resolve;
    });
    await resolveViewerScope({ urls: [], windowDays: 30 }); // starts a held background refresh
    const { acknowledgedAt } = await acknowledgeViewerUpdates({ windowDays: 30 });
    release();
    await resetViewerScopeCache(); // waits for that refresh to finish writing
    gh.gate = null;
    const after = await resolveViewerScope({ urls: [], windowDays: 30 });
    expect(after.acknowledgedAt).toBe(acknowledgedAt);
  });

  test("waits once, then answers from memory without calling gh", async () => {
    const first = await resolveViewerScope({ urls: [], windowDays: 30 });
    expect(first.viewer).toBe("testuser");
    const sweep = gh.calls.length;
    expect(sweep).toBeGreaterThan(3);

    const second = await resolveViewerScope({
      urls: ["https://github.com/a/b/pull/1"],
      windowDays: 30,
    });
    expect(second.viewer).toBe("testuser");
    expect(gh.calls.length).toBe(sweep + 1); // one author lookup for the unseen URL

    await resolveViewerScope({ urls: ["https://github.com/a/b/pull/1"], windowDays: 30 });
    expect(gh.calls.length).toBe(sweep + 1); // the answer is cached
  });

  test("a PR the viewer opened is theirs before GitHub search indexes it", async () => {
    gh.authors = {
      "https://github.com/me/repo/pull/7": "TestUser",
      "https://github.com/other/repo/pull/8": "someone",
    };
    try {
      const answer = await resolveViewerScope({
        urls: ["https://github.com/me/repo/pull/7", "https://github.com/other/repo/pull/8"],
        windowDays: 30,
      });
      expect(answer.authoredUrls).toEqual(["https://github.com/me/repo/pull/7"]);
    } finally {
      gh.authors = {};
    }
  });

  test("a failed author lookup leaves ownership to search and is retried", async () => {
    await resolveViewerScope({ urls: [], windowDays: 30 });
    gh.fail = true;
    const url = "https://github.com/me/repo/pull/9";
    const first = await resolveViewerScope({ urls: [url], windowDays: 30 });
    expect(first.authoredUrls).toEqual([]);
    gh.fail = false;
    gh.authors = { [url]: "testuser" };
    try {
      const second = await resolveViewerScope({ urls: [url], windowDays: 30 });
      expect(second.authoredUrls).toEqual([url]);
    } finally {
      gh.authors = {};
    }
  });

  test("a stale read returns immediately and refreshes in the background", async () => {
    await resolveViewerScope({ urls: [], windowDays: 30 });
    const before = loginCalls();
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(Date.now() + STALE_AFTER_MS + 1_000);

    let release!: () => void;
    gh.gate = new Promise((resolve) => {
      release = resolve;
    });
    const answer = await resolveViewerScope({ urls: [], windowDays: 30 });
    expect(answer.viewer).toBe("testuser"); // served while the refresh is still held open
    expect(loginCalls()).toBe(before + 1);
    release();
    await flush();
  });

  test("concurrent first requests share one GitHub sweep", async () => {
    const [a, b] = await Promise.all([
      resolveViewerScope({ urls: [], windowDays: 7 }),
      resolveViewerScope({ urls: [], windowDays: 7 }),
    ]);
    expect(a.viewer).toBe("testuser");
    expect(b.viewer).toBe("testuser");
    expect(loginCalls()).toBe(1);
  });

  test("a failed background refresh keeps serving the last good snapshot", async () => {
    await resolveViewerScope({ urls: [], windowDays: 30 });
    const before = loginCalls();
    gh.fail = true;
    vi.useFakeTimers({ toFake: ["Date", "setTimeout", "clearTimeout"] });
    vi.setSystemTime(Date.now() + STALE_AFTER_MS + 1_000);
    const failed = Promise.withResolvers<void>();
    const errors = vi.spyOn(console, "error").mockImplementation(() => failed.resolve());
    try {
      const answer = await resolveViewerScope({ urls: [], windowDays: 30 });
      await vi.runAllTimersAsync();
      expect(loginCalls()).toBeGreaterThan(before);
      await failed.promise;
      expect(answer.error).toBeNull();
      expect(answer.viewer).toBe("testuser");
      const afterFailure = resolveViewerScope({ urls: [], windowDays: 30 });
      await vi.runAllTimersAsync();
      expect(await afterFailure).toEqual(answer);
    } finally {
      await resetViewerScopeCache();
      errors.mockRestore();
      vi.useRealTimers();
    }
  });

  test("a snapshot too old to trust is not served: a refresh that keeps failing is reported", async () => {
    await resolveViewerScope({ urls: [], windowDays: 30 });
    gh.fail = true;
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(Date.now() + MAX_STALE_MS + 1_000);
    const errors = vi.spyOn(console, "error").mockImplementation(() => {});
    const answer = await resolveViewerScope({ urls: [], windowDays: 30 });
    expect(answer.viewer).toBeNull();
    expect(answer.error).toMatch(/network down/);
    errors.mockRestore();
  });

  test("a window asked about again after a snapshot too old to serve waits for fresh data", async () => {
    await resolveViewerScope({ urls: [], windowDays: 30 });
    const before = loginCalls();
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(Date.now() + MAX_STALE_MS + 1_000);
    let release!: () => void;
    gh.gate = new Promise((resolve) => {
      release = resolve;
    });
    let answered = false;
    const pending = resolveViewerScope({ urls: [], windowDays: 30 }).then(() => {
      answered = true;
    });
    await flush();
    expect(answered).toBe(false); // old data is not served while the refresh runs
    expect(loginCalls()).toBe(before + 1);
    release();
    await pending;
  });

  test("with nothing cached, a failure is reported", async () => {
    gh.fail = true;
    const errors = vi.spyOn(console, "error").mockImplementation(() => {});
    const answer = await resolveViewerScope({ urls: [], windowDays: 30 });
    expect(answer.viewer).toBeNull();
    expect(answer.error).toMatch(/network down/);
    errors.mockRestore();
  });

  test("the loop warms the default window at startup and stops cleanly", async () => {
    vi.useFakeTimers({ toFake: ["setInterval", "clearInterval", "Date"] });
    const stop = startBackgroundRefresh(60_000);
    try {
      stop();
      // The first read joins the startup refresh instead of starting another sweep.
      const answer = await resolveViewerScope({ urls: [], windowDays: 30 });
      expect(answer.viewer).toBe("testuser");
      expect(loginCalls()).toBe(1);
      const calls = gh.calls.length;
      await resolveViewerScope({ urls: [], windowDays: 30 });
      expect(gh.calls.length).toBe(calls);
      await vi.advanceTimersByTimeAsync(60_000);
      expect(gh.calls.length).toBe(calls);
    } finally {
      stop();
      vi.clearAllTimers();
      await resetViewerScopeCache();
      vi.useRealTimers();
    }
  });

  test("windows nobody asks about stop being refreshed, the default one included", async () => {
    vi.useFakeTimers({ toFake: ["setInterval", "clearInterval", "Date"] });
    const stop = startBackgroundRefresh(60_000);
    await resolveViewerScope({ urls: [], windowDays: 30 }); // joins the startup refresh
    const calls = gh.calls.length;
    vi.setSystemTime(Date.now() + 31 * 60_000);
    vi.advanceTimersByTime(60_000);
    await flush();
    expect(gh.calls.length).toBe(calls);
    stop();
  });
});
