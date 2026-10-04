import { describe, expect, test } from "vitest";
import { scanSidebarItems } from "../shared/scanner";

describe("scanSidebarItems", () => {
  test("extracts a single-line addSidebarItem call", () => {
    const text = `client.addSidebarItem({ id: "radar", title: "PR Radar", icon: "GitPullRequest", surface: "radar" });`;
    expect(scanSidebarItems(text)).toEqual([
      { itemId: "radar", title: "PR Radar", icon: "GitPullRequest" },
    ]);
  });

  test("extracts a multiline call", () => {
    const text = `client.addSidebarItem({
      id: "main",
      title: "Plugins",
      icon: "Blocks",
      surface: "main",
    });`;
    expect(scanSidebarItems(text)).toEqual([{ itemId: "main", title: "Plugins", icon: "Blocks" }]);
  });

  test("extracts multiple calls from one file", () => {
    const text = [
      `client.addSidebarItem({ id: "a", title: "Alpha", icon: "A", surface: "a" });`,
      `client.addSidebarItem({ id: "b", title: "Beta", surface: "b" });`,
    ].join("\n");
    expect(scanSidebarItems(text)).toEqual([
      { itemId: "a", title: "Alpha", icon: "A" },
      { itemId: "b", title: "Beta", icon: "" },
    ]);
  });

  test("handles every quote style", () => {
    const text =
      'client.addSidebarItem({ id: "single", title: \'double\', icon: `tick`, surface: "s" });';
    expect(scanSidebarItems(text)).toEqual([{ itemId: "single", title: "double", icon: "tick" }]);
  });

  test("defaults icon to empty string when it is missing", () => {
    const text = `client.addSidebarItem({ id: "x", title: "X", surface: "x" });`;
    expect(scanSidebarItems(text)).toEqual([{ itemId: "x", title: "X", icon: "" }]);
  });

  test("returns an empty list when there are no matches", () => {
    expect(scanSidebarItems("nothing to see here")).toEqual([]);
  });

  test("drops items that are missing an id or a title", () => {
    const text = `client.addSidebarItem({ title: "No id", surface: "s" }); client.addSidebarItem({ id: "no-title", surface: "s" });`;
    expect(scanSidebarItems(text)).toEqual([]);
  });

  test("ignores parens and braces inside string contents", () => {
    const text = `client.addSidebarItem({ id: "a)", title: "has (parens)", icon: "Block", surface: "a" });`;
    expect(scanSidebarItems(text)).toEqual([
      { itemId: "a)", title: "has (parens)", icon: "Block" },
    ]);
  });

  test("resolves identifier values through const declarations", () => {
    const text = `const TITLE = "Paseo Cafe";
client.addSidebarItem({ id: SCREEN_ID, title: TITLE, icon: "Coffee", surface: SCREEN_ID });`;
    const constants = `${text}\nexport const SCREEN_ID = "directory";`;
    expect(scanSidebarItems(text, constants)).toEqual([
      { itemId: "directory", title: "Paseo Cafe", icon: "Coffee" },
    ]);
  });

  test("drops a call whose identifier cannot be resolved", () => {
    const text = `client.addSidebarItem({ id: UNKNOWN, title: "X" });`;
    expect(scanSidebarItems(text)).toEqual([]);
  });
});
