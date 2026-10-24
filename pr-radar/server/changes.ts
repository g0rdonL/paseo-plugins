const TRANSITION = /^(.+?): (.+) → (.+)$/;

/**
 * Reports each field's net change from its first recorded origin to its trustworthy current value.
 * Legacy pending lists deduplicate repeated transitions, so their last entry is not the latest state.
 */
export function mergeChanges(
  pending: string[],
  detected: string[],
  current: Readonly<Record<string, string | undefined>>,
): string[] {
  const merged: string[] = [];
  const seen = new Set<string>();
  for (const change of [...pending, ...detected]) {
    const next = TRANSITION.exec(change);
    const to = next ? current[next[1]] : undefined;
    if (!next || typeof to !== "string") {
      if (!merged.includes(change)) merged.push(change);
      continue;
    }
    const [, label, from] = next;
    if (seen.has(label)) continue;
    seen.add(label);
    if (from !== to) merged.push(`${label}: ${from} → ${to}`);
  }
  return merged;
}
