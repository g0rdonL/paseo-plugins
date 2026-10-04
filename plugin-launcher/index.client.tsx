import type { PluginClientContext } from "@getpaseo/plugin/client";
import { LauncherScreen, LauncherSettingsScreen } from "./client/launcher-screen";

export default function contribute(client: PluginClientContext) {
  client.addSurface("main", LauncherScreen);
  client.addSidebarItem({
    id: "main",
    title: "Plugins",
    icon: "Blocks",
    surface: "main",
  });
  client.addSettingsScreen({
    id: "launcher",
    title: "Plugin Launcher",
    icon: "Blocks",
    Component: LauncherSettingsScreen,
  });
  return () => {};
}
