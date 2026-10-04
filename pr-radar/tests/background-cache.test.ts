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
} = await import("../server/viewer-scope");

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));
const loginCalls = () => gh.calls.filter((args) => args[0] === "api" && args[1] === "user").length;

describe("background cache", () => {
  beforeEach(async () => {
    gh.fail = false;
    gh.gate = null;
    vi.useRealTimers();
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

    const second = await resolveViewerScope({ urls: ["https://github.com/a/b/pull/1"], windowDays: 30 });
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
});
