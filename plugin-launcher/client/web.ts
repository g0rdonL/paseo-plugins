import { Platform } from "react-native";

interface LauncherWindowLocation {
  assign(url: string): void;
}

declare const window: { location: LauncherWindowLocation };

export function navigateToSidebarRoute(route: string): void {
  if (Platform.OS !== "web") return;
  window.location.assign(route);
}
