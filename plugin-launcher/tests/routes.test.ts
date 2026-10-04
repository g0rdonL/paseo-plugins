import { describe, expect, test } from "vitest";
import { buildPluginSidebarRoute } from "../shared/routes";

describe("buildPluginSidebarRoute", () => {
  test("builds a plain sidebar route", () => {
    expect(buildPluginSidebarRoute("host-1", "pr-radar", "radar")).toBe(
      "/h/host-1/plugin/pr-radar/sidebar/radar",
    );
  });

  test("encodes server ids, plugin ids, and item ids", () => {
    expect(buildPluginSidebarRoute("host/one", "plugin two", "overview/item")).toBe(
      "/h/host%2Fone/plugin/plugin%20two/sidebar/overview%2Fitem",
    );
  });
});
