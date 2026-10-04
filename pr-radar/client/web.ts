import { Platform } from "react-native";

// The only module that touches DOM globals; everything is gated on web (desktop app).
interface KeyEventLike {
  code: string;
  metaKey: boolean;
  ctrlKey: boolean;
  altKey: boolean;
  shiftKey: boolean;
  preventDefault(): void;
}
declare const window: {
  location: { pathname: string };
  navigator: { platform: string };
  addEventListener(
    type: "keydown",
    listener: (event: KeyEventLike) => void,
    capture?: boolean,
  ): void;
  removeEventListener(
    type: "keydown",
    listener: (event: KeyEventLike) => void,
    capture?: boolean,
  ): void;
};

/** Current route pathname on web; null on native. */
export function currentPathname(): string | null {
  return Platform.OS === "web" ? window.location.pathname : null;
}

export function isMacPlatform(): boolean {
  return Platform.OS === "web" ? /Mac/i.test(window.navigator.platform) : Platform.OS === "ios";
}

/** Registers a global keydown listener on web. No-op on native. Returns cleanup. */
export function addKeydownListener(listener: (event: KeyEventLike) => void): () => void {
  if (Platform.OS !== "web") return () => {};
  window.addEventListener("keydown", listener, true);
  return () => window.removeEventListener("keydown", listener, true);
}
