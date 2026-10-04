export function buildPluginSidebarRoute(
  serverId: string,
  pluginId: string,
  itemId: string,
): string {
  return `/h/${encodeURIComponent(serverId)}/plugin/${encodeURIComponent(pluginId)}/sidebar/${encodeURIComponent(itemId)}`;
}
