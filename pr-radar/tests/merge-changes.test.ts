import { describe, expect, test } from "vitest";
import { mergeChanges } from "../server/changes";

describe("mergeChanges", () => {
  test("folds a flip-flopping field into its net change", () => {
    expect(
      mergeChanges(["New activity", "Checks: success → pending"], ["Checks: pending → failure"]),
    ).toEqual(["New activity", "Checks: success → failure"]);
  });

  test("drops a field that ended where it started", () => {
    expect(
      mergeChanges(
        ["Checks: success → pending", "Merge state: CLEAN → UNSTABLE"],
        ["Checks: pending → success", "Merge state: UNSTABLE → CLEAN", "New activity"],
      ),
    ).toEqual(["New activity"]);
  });

  test("keeps unrelated and duplicate plain changes once", () => {
    expect(mergeChanges(["New PR"], ["New PR", "Review: none → APPROVED"])).toEqual([
      "New PR",
      "Review: none → APPROVED",
    ]);
  });
});
