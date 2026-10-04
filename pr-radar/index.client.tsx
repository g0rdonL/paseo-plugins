import type { PluginClientContext } from "@getpaseo/plugin/client";
import { SidebarRow } from "@getpaseo/plugin/client/ui";
import { PrRadar } from "./client/pr-radar";
import { supportsRadarScreen } from "./client/screen-state";
import { RadarSidebar } from "./client/sidebar";
import { addKeydownListener, currentPathname, isMacPlatform } from "./client/web";
import { isOpenRadarChord, workspaceIdFromPathname } from "./shared/open-shortcut";

export default function contribute(client: PluginClientContext) {
  const screens = supportsRadarScreen(client, SidebarRow);
  if (screens) {
    client.addScreen({
      id: "radar",
      title: "PR Radar",
      Component: PrRadar,
    });
    client.addSidebarHeaderItem({ id: "radar", title: "PR Radar", Component: RadarSidebar });
  } else {
    client.addSurface("radar", PrRadar);
    client.addSidebarItem({
      id: "radar",
      title: "PR Radar",
      icon: "GitPullRequest",
      surface: "radar",
    });
  }
  // Also available as a workspace tab or in the right-hand Explorer pane (its + menu, or ⌘K).
  // Older hosts in the supported range may lack workspace panels, so feature-check first.
  const removePanel: (() => void)[] = [];
  if (typeof client.addWorkspacePanel === "function") {
    removePanel.push(
      client.addWorkspacePanel({
        id: "radar",
        title: "PR Radar",
        icon: "GitPullRequest",
        context: "workspace",
        locations: ["workspace", "explorer"],
        Component: PrRadar,
      }),
      client.addCommandCenterItem({
        id: "open-radar-right",
        title: "Open PR Radar in right panel",
        icon: "GitPullRequest",
        keywords: ["pull requests", "explorer", "side"],
        context: "workspace",
        onSelect({ openPanel }) {
          openPanel("radar", { location: "explorer" });
        },
      }),
    );
  }
  // ⌥⌘P: open PR Radar in the right pane of the current workspace (desktop only).
  const isMac = isMacPlatform();
  const removeShortcut =
    typeof client.addWorkspacePanel === "function"
      ? addKeydownListener((event) => {
          if (!isOpenRadarChord(event, isMac)) return;
          const workspaceId = workspaceIdFromPathname(currentPathname() ?? "");
          if (!workspaceId) return;
          event.preventDefault();
          client.openPanel("radar", { workspaceId, location: "explorer" });
        })
      : () => {};
  client.addCommandCenterItem({
    id: "open-radar",
    title: "Open PR Radar",
    icon: "GitPullRequest",
    keywords: ["pull requests", "delivery", "merge", "agents"],
    context: "global",
    onSelect(capabilities) {
      if (screens && typeof capabilities.openScreen === "function")
        capabilities.openScreen({ screenId: "radar" });
      else capabilities.openSurface("radar");
    },
  });
  return () => {
    removeShortcut();
    for (const remove of removePanel) remove();
  };
}
