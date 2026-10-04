import type { PluginServerContext } from "@getpaseo/plugin/server";
import { resolveLauncherList } from "./server/launcher";
import { launcherList, launcherSettings } from "./shared/launcher";

export default function contribute(server: PluginServerContext) {
  const settings = server.registerSettings(launcherSettings);
  server.handle(launcherList, (input) => resolveLauncherList(input, settings));
  return () => {};
}
