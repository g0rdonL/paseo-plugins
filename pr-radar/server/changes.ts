const TRANSITION = /^(.+?): (.+) → (.+)$/;

/**
 * Folds newly detected changes into the pending ones. A field that flips back and forth between
 * refreshes ("Checks: success → pending", then "pending → success") is reported once as its net
 * change, and dropped entirely when it ended where it started.
 */
export function mergeChanges(pending: string[], detected: string[]): string[] {
  const merged: string[] = [];
  for (const change of [...pending, ...detected]) {
    const next = TRANSITION.exec(change);
    const index = next ? merged.findIndex((entry) => TRANSITION.exec(entry)?.[1] === next[1]) : -1;
    if (!next || index === -1) {
      if (!merged.includes(change)) merged.push(change);
      continue;
    }
    const [, label, , to] = next;
    const from = TRANSITION.exec(merged[index])?.[2];
    if (from === to) merged.splice(index, 1);
    else merged[index] = `${label}: ${from} → ${to}`;
  }
  return merged;
}
