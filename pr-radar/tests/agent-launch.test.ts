import type { PaseoProviderSnapshotResult, PaseoProviderSnapshotUpdate } from "@getpaseo/client";
import { describe, expect, test } from "vitest";
import {
  launchFromDefaultProvider,
  launchFromProfile,
  launchFromProviders,
  NO_LAUNCH_TARGET,
  pickProfile,
} from "../client/agent-launch";

type Entries = PaseoProviderSnapshotResult["entries"];

const entries = (list: unknown[]) => list as Entries;

const ready = entries([
  { provider: "codex", status: "unavailable", enabled: false, models: [] },
  {
    provider: "claude",
    label: "Claude",
    status: "ready",
    enabled: true,
    models: [
      { id: "haiku", label: "Haiku" },
      { id: "opus", label: "Opus", isDefault: true },
    ],
  },
]);

function fakeProviders(snapshot: Entries) {
  let handler: ((update: PaseoProviderSnapshotUpdate) => void) | null = null;
  return {
    providers: {
      snapshot: async () => ({ cwd: "/home", entries: snapshot }) as PaseoProviderSnapshotResult,
      subscribe: (next: (update: PaseoProviderSnapshotUpdate) => void) => {
        handler = next;
        return () => {
          handler = null;
        };
      },
    },
    push: (cwd: string, next: Entries) =>
      handler?.({ cwd, entries: next } as unknown as PaseoProviderSnapshotUpdate),
    subscribed: () => handler !== null,
  };
}

describe("pickProfile", () => {
  test("prefers Model Router, then the first profile, else null", () => {
    const a = { name: "Fast", provider: "kimi" };
    const b = { name: "model router", provider: "opencode" };
    expect(pickProfile([a, b])).toBe(b);
    expect(pickProfile([a])).toBe(a);
    expect(pickProfile([])).toBeNull();
  });
});

describe("launchFromProfile", () => {
  test("joins provider and model and copies set options", () => {
    expect(
      launchFromProfile({ name: "R", provider: "opencode", model: "m1", modeId: "build" }),
    ).toEqual({ label: "R", config: { provider: "opencode/m1", modeId: "build" } });
  });
});

describe("launchFromProviders", () => {
  test("uses the first ready provider's default model", () => {
    expect(launchFromProviders(ready)).toEqual({
      label: "Claude · Opus",
      config: { provider: "claude/opus" },
    });
  });

  test("returns null when nothing is ready", () => {
    expect(launchFromProviders(entries([{ provider: "claude", status: "loading" }]))).toBeNull();
  });
});

describe("launchFromDefaultProvider", () => {
  test("resolves straight from a ready snapshot", async () => {
    const { providers } = fakeProviders(ready);
    await expect(launchFromDefaultProvider(providers)).resolves.toMatchObject({
      config: { provider: "claude/opus" },
    });
  });

  test("waits for lazy discovery to finish", async () => {
    const fake = fakeProviders(entries([{ provider: "claude", status: "loading" }]));
    const pending = launchFromDefaultProvider(fake.providers);
    await new Promise((resolve) => setTimeout(resolve, 0));
    fake.push("/other", ready);
    expect(fake.subscribed()).toBe(true);
    fake.push("/home", ready);
    await expect(pending).resolves.toMatchObject({ config: { provider: "claude/opus" } });
    expect(fake.subscribed()).toBe(false);
  });

  test("fails when discovery ends with nothing usable", async () => {
    const fake = fakeProviders(entries([{ provider: "claude", status: "loading" }]));
    const pending = launchFromDefaultProvider(fake.providers);
    await new Promise((resolve) => setTimeout(resolve, 0));
    fake.push("/home", entries([{ provider: "claude", status: "unavailable" }]));
    await expect(pending).rejects.toThrow(NO_LAUNCH_TARGET);
  });

  test("times out if discovery never settles", async () => {
    const fake = fakeProviders(entries([{ provider: "claude", status: "loading" }]));
    await expect(launchFromDefaultProvider(fake.providers, 10)).rejects.toThrow(NO_LAUNCH_TARGET);
    expect(fake.subscribed()).toBe(false);
  });

  test("fails immediately when no provider is ready or loading", async () => {
    const { providers } = fakeProviders(entries([{ provider: "codex", status: "unavailable" }]));
    await expect(launchFromDefaultProvider(providers)).rejects.toThrow(NO_LAUNCH_TARGET);
  });
});
