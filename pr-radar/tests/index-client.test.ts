import type { PluginClientContext } from "@getpaseo/plugin/client";
import { describe, expect, test, vi } from "vitest";

vi.mock("../client/pr-radar", () => ({ PrRadar: () => null }));
vi.mock("../client/sidebar", () => ({ RadarSidebar: () => null }));
const removeShortcut = vi.hoisted(() => vi.fn());
vi.mock("../client/web", () => ({
  addKeydownListener: () => removeShortcut,
  currentPathname: () => null,
  isMacPlatform: () => true,
}));

import contribute from "../index.client";

describe("client entry", () => {
  test("registers the radar screen, sidebar row, panel and openers, and removes them all on cleanup", () => {
    const registered: string[] = [];
    const removed: string[] = [];
    const commands: Array<{ id: string; onSelect(capabilities: unknown): void }> = [];
    const register = (method: string) => (contribution: { id: string }) => {
      registered.push(`${method}:${contribution.id}`);
      return () => removed.push(`${method}:${contribution.id}`);
    };
    const client = {
      addScreen: register("addScreen"),
      addSidebarHeaderItem: register("addSidebarHeaderItem"),
      addWorkspacePanel: register("addWorkspacePanel"),
      addCommandCenterItem: (command: { id: string; onSelect(capabilities: unknown): void }) => {
        commands.push(command);
        return register("addCommandCenterItem")(command);
      },
    } as unknown as PluginClientContext;

    const cleanup = contribute(client);
    expect(registered).toEqual([
      "addScreen:radar",
      "addSidebarHeaderItem:radar",
      "addCommandCenterItem:open-radar",
      "addWorkspacePanel:radar",
      "addCommandCenterItem:open-radar-right",
    ]);

    const openScreen = vi.fn();
    commands[0].onSelect({ openScreen });
    expect(openScreen).toHaveBeenCalledWith({ screenId: "radar" });
    const openPanel = vi.fn();
    commands[1].onSelect({ openPanel });
    expect(openPanel).toHaveBeenCalledWith("radar", { location: "explorer" });

    cleanup();
    expect(removeShortcut).toHaveBeenCalledOnce();
    expect(removed).toEqual([
      "addCommandCenterItem:open-radar-right",
      "addWorkspacePanel:radar",
      "addCommandCenterItem:open-radar",
      "addSidebarHeaderItem:radar",
      "addScreen:radar",
    ]);
  });
});
