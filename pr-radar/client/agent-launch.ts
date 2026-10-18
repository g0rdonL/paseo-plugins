import type { PaseoProviderSnapshotResult, PaseoProviderSnapshotUpdate } from "@getpaseo/client";

export interface LaunchProfile {
  name: string;
  provider: string;
  model?: string;
  modeId?: string;
  thinkingOptionId?: string;
  featureValues?: Record<string, unknown>;
}

export interface AgentLaunch {
  /** Shown in the "Started …" notice. */
  label: string;
  config: {
    provider: string;
    modeId?: string;
    thinkingOptionId?: string;
    featureValues?: Record<string, unknown>;
  };
}

type ProviderEntries = PaseoProviderSnapshotResult["entries"];

export const NO_LAUNCH_TARGET =
  "No agent profile is configured and no Paseo provider is ready. Add an agent profile or enable a provider in Paseo.";

/** The "Model Router" profile, else the first profile. */
export function pickProfile<T extends LaunchProfile>(profiles: readonly T[]): T | null {
  return (
    profiles.find((candidate) => candidate.name.toLowerCase() === "model router") ??
    profiles[0] ??
    null
  );
}

export function launchFromProfile(profile: LaunchProfile): AgentLaunch {
  return {
    label: profile.name,
    config: {
      provider: profile.model ? `${profile.provider}/${profile.model}` : profile.provider,
      ...(profile.modeId ? { modeId: profile.modeId } : {}),
      ...(profile.thinkingOptionId ? { thinkingOptionId: profile.thinkingOptionId } : {}),
      ...(profile.featureValues ? { featureValues: profile.featureValues } : {}),
    },
  };
}

/** First ready, enabled provider's default model (else its first selectable model). */
export function launchFromProviders(entries: ProviderEntries): AgentLaunch | null {
  for (const entry of entries) {
    if (entry.status !== "ready" || entry.enabled === false) continue;
    const models = (entry.models ?? []).filter((model) => model.isSelectable !== false);
    const model = models.find((candidate) => candidate.isDefault === true) ?? models[0];
    if (!model) continue;
    return {
      label: `${entry.label ?? entry.provider} · ${model.label}`,
      config: { provider: `${entry.provider}/${model.id}` },
    };
  }
  return null;
}

export function providersLoading(entries: ProviderEntries): boolean {
  return entries.some((entry) => entry.status === "loading");
}

interface ProviderActions {
  snapshot(): Promise<PaseoProviderSnapshotResult>;
  subscribe(handler: (update: PaseoProviderSnapshotUpdate) => void): () => void;
}

/**
 * Fallback when no agent profile exists. The daemon discovers providers lazily, so the first
 * snapshot can have every entry still "loading"; wait for pushed updates until one is usable.
 */
export async function launchFromDefaultProvider(
  providers: ProviderActions,
  timeoutMs = 20_000,
): Promise<AgentLaunch> {
  const snapshot = await providers.snapshot();
  const immediate = launchFromProviders(snapshot.entries);
  if (immediate) return immediate;
  if (!providersLoading(snapshot.entries)) throw new Error(NO_LAUNCH_TARGET);

  return new Promise<AgentLaunch>((resolve, reject) => {
    let unsubscribe: () => void = () => {};
    const timer = setTimeout(() => {
      unsubscribe();
      reject(new Error(NO_LAUNCH_TARGET));
    }, timeoutMs);
    unsubscribe = providers.subscribe((update) => {
      if (update.cwd !== snapshot.cwd) return;
      const launch = launchFromProviders(update.entries);
      if (!launch && providersLoading(update.entries)) return;
      clearTimeout(timer);
      unsubscribe();
      if (launch) resolve(launch);
      else reject(new Error(NO_LAUNCH_TARGET));
    });
  });
}
