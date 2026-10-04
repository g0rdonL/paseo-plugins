// ⌥⌘P (Ctrl+Alt+P off macOS) opens PR Radar in the right-hand Explorer pane. Paseo has no
// plugin shortcut API, so the client listens for the chord itself (desktop only, see
// client/web.ts) and reads the current workspace from the app's route. Pure helpers here.

export interface ChordEvent {
  code: string;
  metaKey: boolean;
  ctrlKey: boolean;
  altKey: boolean;
  shiftKey: boolean;
}

/** ⌥⌘P on macOS, Ctrl+Alt+P elsewhere. Uses `code`: Option changes `key` on macOS ("π"). */
export function isOpenRadarChord(event: ChordEvent, isMac: boolean): boolean {
  if (event.code !== "KeyP" || !event.altKey || event.shiftKey) return false;
  return isMac ? event.metaKey && !event.ctrlKey : event.ctrlKey && !event.metaKey;
}

const ENCODED_PREFIX = "b64_";

function base64UrlToUtf8(value: string): string | null {
  if (!/^[A-Za-z0-9_-]+$/.test(value)) return null;
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
  let bits = 0;
  let buffer = 0;
  let percent = "";
  for (const char of value) {
    buffer = (buffer << 6) | alphabet.indexOf(char);
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      percent += `%${((buffer >> bits) & 0xff).toString(16).padStart(2, "0")}`;
    }
  }
  try {
    return decodeURIComponent(percent);
  } catch {
    return null;
  }
}

function looksLikePath(value: string): boolean {
  return value.includes("/") || value.includes("\\") || /^[A-Za-z]:[\\/]/.test(value);
}

/**
 * Mirrors Paseo 0.10's workspace route segment decoding: `b64_` + base64url, a bare base64url
 * that decodes to a path, or the raw id.
 */
export function decodeWorkspaceSegment(segment: string): string | null {
  let raw: string;
  try {
    raw = decodeURIComponent(segment).trim();
  } catch {
    raw = segment.trim();
  }
  if (!raw) return null;
  if (raw.startsWith(ENCODED_PREFIX)) {
    return base64UrlToUtf8(raw.slice(ENCODED_PREFIX.length))?.trim() || null;
  }
  const decoded = base64UrlToUtf8(raw);
  if (decoded && looksLikePath(decoded)) return decoded.trim();
  return raw;
}

/** Workspace id from a Paseo route such as /h/<host>/workspace/<segment>[/...]. */
export function workspaceIdFromPathname(pathname: string): string | null {
  const match = pathname.match(/^\/h\/[^/]+\/workspace\/([^/?#]+)/);
  return match ? decodeWorkspaceSegment(match[1]) : null;
}
