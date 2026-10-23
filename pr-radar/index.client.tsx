import type { PluginClientContext } from "@getpaseo/plugin/client";
import { PrRadar } from "./client/pr-radar";
import { RadarSidebar } from "./client/sidebar";
import { addKeydownListener, currentPathname, isMacPlatform } from "./client/web";
import { isOpenRadarChord, workspaceIdFromPathname } from "./shared/open-shortcut";

export default function contribute(client: PluginClientContext) {
  const removers = [
    client.addScreen({ id: "radar", title: "PR Radar", Component: PrRadar }),
    client.addSidebarHeaderItem({ id: "radar", title: "PR Radar", Component: RadarSidebar }),
    client.addCommandCenterItem({
      id: "open-radar",
      title: "Open PR Radar",
      icon: "GitPullRequest",
      keywords: ["pull requests", "delivery", "merge", "agents"],
      context: "global",
      onSelect({ openScreen }) {
        openScreen({ screenId: "radar" });
      },
    }),
    // Also available as a workspace tab or in the right-hand Explorer pane (its + menu, or ⌘K).
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
  ];
  // ⌥⌘P: open PR Radar in the right pane of the current workspace (desktop only).
  const isMac = isMacPlatform();
  removers.push(
    addKeydownListener((event) => {
      if (!isOpenRadarChord(event, isMac)) return;
      const workspaceId = workspaceIdFromPathname(currentPathname() ?? "");
      if (!workspaceId) return;
      event.preventDefault();
      client.openPanel("radar", { workspaceId, location: "explorer" });
    }),
  );
  return () => {
    for (const remove of removers.reverse()) remove();
  };
}
