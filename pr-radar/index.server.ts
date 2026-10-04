import type { PluginServerContext } from "@getpaseo/plugin/server";
import { performMarkReady, performMerge } from "./server/merge";
import { acknowledgeViewerUpdates, resolveViewerScope } from "./server/viewer-scope";
import {
  acknowledgeViewerScope,
  markPullRequestReady,
  mergePullRequest,
  viewerScope,
} from "./shared/viewer-scope";

export default function contribute(server: PluginServerContext) {
  server.handle(viewerScope, resolveViewerScope);
  server.handle(acknowledgeViewerScope, acknowledgeViewerUpdates);
  server.handle(mergePullRequest, performMerge);
  server.handle(markPullRequestReady, performMarkReady);
  return () => {};
}
