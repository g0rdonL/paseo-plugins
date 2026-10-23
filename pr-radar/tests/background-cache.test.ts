import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeEach, describe, expect, test, vi } from "vitest";

const { gh, home } = vi.hoisted(() => ({
  gh: {
    calls: [] as string[][],
    fail: false,
    /** Resolves pending gh calls when set; lets a test hold a refresh open. */
    gate: null as Promise<void> | null,
    /** gh search calls currently running, and the most seen at once. */
    activeSearches: 0,
    peakSearches: 0,
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
    const isSearch = args[0] === "search";
    if (isSearch) {
      gh.activeSearches += 1;
      gh.peakSearches = Math.max(gh.peakSearches, gh.activeSearches);
    }
    const respond = () => {
      if (isSearch) gh.activeSearches -= 1;
      if (gh.fail) return callback(new Error("gh: network down"));
      const stdout = args[0] === "api" && args[1] === "user" ? "g0rdonL\n" : "[]";
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
  resetViewerScopeCache,
  startBackgroundRefresh,
  STALE_AFTER_MS,
  FAILURE_BACKOFF_MS,
} = await import("../server/viewer-scope");

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));
const loginCalls = () => gh.calls.filter((args) => args[0] === "api" && args[1] === "user").length;

describe("background cache", () => {
  beforeEach(async () => {
    gh.fail = false;
    gh.gate = null;
    gh.peakSearches = 0;
    vi.useRealTimers();
    // Paseo sets PASEO_HOME for agents; keep the state file in the temp home either way.
    vi.stubEnv("PASEO_HOME", join(home.dir, ".paseo"));
    await resetViewerScopeCache();
    gh.calls = [];
  });

  afterAll(() => rmSync(home.dir, { recursive: true, force: true }));

  test("overlapping refreshes of different windows both persist", async () => {
    const [week, month] = await Promise.all([
      resolveViewerScope({ urls: [], windowDays: 7 }),
      resolveViewerScope({ urls: [], windowDays: 30 }),
    ]);
    expect(week.error).toBeNull();
    expect(month.error).toBeNull();
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
    expect(first.viewer).toBe("g0rdonL");
    const sweep = gh.calls.length;
    expect(sweep).toBeGreaterThan(5);

    const second = await resolveViewerScope({
      urls: ["https://github.com/a/b/pull/1"],
      windowDays: 30,
    });
    expect(second.viewer).toBe("g0rdonL");
    expect(second.ownedUrls).toContain("https://github.com/a/b/pull/1");
    expect(gh.calls.length).toBe(sweep);
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
    expect(answer.viewer).toBe("g0rdonL"); // served while the refresh is still held open
    expect(loginCalls()).toBe(before + 1);
    release();
    await flush();
  });

  test("concurrent first requests share one GitHub sweep", async () => {
    const [a, b] = await Promise.all([
      resolveViewerScope({ urls: [], windowDays: 7 }),
      resolveViewerScope({ urls: [], windowDays: 7 }),
    ]);
    expect(a.viewer).toBe("g0rdonL");
    expect(b.viewer).toBe("g0rdonL");
    expect(loginCalls()).toBe(1);
  });

  test("a failed background refresh keeps serving the last good snapshot", async () => {
    await resolveViewerScope({ urls: [], windowDays: 30 });
    gh.fail = true;
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(Date.now() + STALE_AFTER_MS + 1_000);
    const errors = vi.spyOn(console, "error").mockImplementation(() => {});
    const answer = await resolveViewerScope({ urls: [], windowDays: 30 });
    await flush();
    await flush();
    expect(answer.error).toBeNull();
    expect(answer.viewer).toBe("g0rdonL");
    errors.mockRestore();
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
    const stop = startBackgroundRefresh(60_000);
    stop();
    // The first read joins the startup refresh instead of starting another sweep.
    const answer = await resolveViewerScope({ urls: [], windowDays: 30 });
    expect(answer.viewer).toBe("g0rdonL");
    expect(loginCalls()).toBe(1);
    const calls = gh.calls.length;
    await resolveViewerScope({ urls: [], windowDays: 30 });
    expect(gh.calls.length).toBe(calls);
  });

  test("GitHub searches run with bounded concurrency", async () => {
    let release!: () => void;
    gh.gate = new Promise((resolve) => {
      release = resolve;
    });
    const pending = resolveViewerScope({ urls: [], windowDays: 30 });
    for (let i = 0; i < 20; i += 1) {
      await flush();
      release();
    }
    await pending;
    expect(gh.calls.filter((args) => args[0] === "search").length).toBe(8);
    expect(gh.peakSearches).toBeLessThanOrEqual(2);
  });

  test("after a failed first sweep, reads back off instead of hammering GitHub", async () => {
    gh.fail = true;
    const errors = vi.spyOn(console, "error").mockImplementation(() => {});
    const first = await resolveViewerScope({ urls: [], windowDays: 30 });
    expect(first.error).toMatch(/network down/);
    const sweeps = loginCalls();

    const again = await resolveViewerScope({ urls: [], windowDays: 30 });
    expect(again.error).toMatch(/network down/);
    expect(loginCalls()).toBe(sweeps); // answered from the recorded failure

    gh.fail = false;
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(Date.now() + FAILURE_BACKOFF_MS[0] + 1_000);
    const recovered = await resolveViewerScope({ urls: [], windowDays: 30 });
    expect(recovered.error).toBeNull();
    expect(recovered.viewer).toBe("g0rdonL");
    errors.mockRestore();
  });

  test("a failed refresh with nothing cached schedules a quick retry", async () => {
    vi.useFakeTimers({ toFake: ["setTimeout", "Date"] });
    gh.fail = true;
    const errors = vi.spyOn(console, "error").mockImplementation(() => {});
    const stop = startBackgroundRefresh(60 * 60_000);
    await vi.advanceTimersByTimeAsync(1_000); // viewerLogin's own 250 ms retry
    const sweeps = loginCalls();
    gh.fail = false;
    await vi.advanceTimersByTimeAsync(FAILURE_BACKOFF_MS[0] + 1_000);
    stop();
    expect(loginCalls()).toBeGreaterThan(sweeps);
    vi.useRealTimers();
    const answer = await resolveViewerScope({ urls: [], windowDays: 30 });
    expect(answer.error).toBeNull();
    errors.mockRestore();
  });
});
