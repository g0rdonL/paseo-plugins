import type { PluginServerContext } from "@getpaseo/plugin/server";
import {
  acknowledgeViewerUpdates,
  resolveViewerScope,
  startBackgroundRefresh,
} from "./server/viewer-scope";
import { acknowledgeViewerScope, viewerScope } from "./shared/viewer-scope";

export default function contribute(server: PluginServerContext) {
  server.handle(viewerScope, resolveViewerScope);
  server.handle(acknowledgeViewerScope, acknowledgeViewerUpdates);
  // Keep GitHub data warm so opening the radar never waits on gh.
  const stop = startBackgroundRefresh();
  return () => stop();
}
