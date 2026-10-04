import { describe, expect, test } from "vitest";
import { mergeSidebarItems } from "../server/launcher";
import type { SidebarItem } from "../shared/launcher";

function item(pluginId: string, itemId: string, title: string, icon = ""): SidebarItem {
  return { pluginId, itemId, title, icon };
}

describe("mergeSidebarItems", () => {
  test("dedupes by pluginId+itemId and lets overrides win", () => {
    const discovered = [
      item("pr-radar", "radar", "PR Radar", "GitPullRequest"),
      item("beads", "main", "Beads"),
    ];
    const overrides = [item("pr-radar", "radar", "Radar", "RadarIcon")];

    expect(mergeSidebarItems(discovered, overrides)).toEqual([
      { pluginId: "beads", itemId: "main", title: "Beads", icon: "" },
      { pluginId: "pr-radar", itemId: "radar", title: "Radar", icon: "RadarIcon" },
    ]);
  });

  test("sorts by title, then pluginId, then itemId", () => {
    const discovered = [item("b", "1", "Zulu"), item("a", "1", "Alpha"), item("a", "2", "Alpha")];

    expect(mergeSidebarItems(discovered, []).map((entry) => entry.itemId)).toEqual(["1", "2", "1"]);
    expect(
      mergeSidebarItems(discovered, []).map((entry) => `${entry.pluginId}:${entry.itemId}`),
    ).toEqual(["a:1", "a:2", "b:1"]);
  });
});
