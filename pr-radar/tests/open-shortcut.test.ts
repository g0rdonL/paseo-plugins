import { describe, expect, it } from "vitest";
import {
  decodeWorkspaceSegment,
  isOpenRadarChord,
  workspaceIdFromPathname,
} from "../shared/open-shortcut";

const b64url = (s: string) =>
  Buffer.from(s, "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
const key = (over: Partial<Parameters<typeof isOpenRadarChord>[0]>) => ({
  code: "KeyP",
  metaKey: false,
  ctrlKey: false,
  altKey: false,
  shiftKey: false,
  ...over,
});

describe("isOpenRadarChord", () => {
  it("matches ⌥⌘P on macOS only", () => {
    expect(isOpenRadarChord(key({ metaKey: true, altKey: true }), true)).toBe(true);
    expect(isOpenRadarChord(key({ metaKey: true }), true)).toBe(false); // ⌘P = Search files
    expect(isOpenRadarChord(key({ metaKey: true, shiftKey: true }), true)).toBe(false); // ⌘⇧P
    expect(isOpenRadarChord(key({ metaKey: true, altKey: true, shiftKey: true }), true)).toBe(
      false,
    );
    expect(isOpenRadarChord(key({ code: "KeyO", metaKey: true, altKey: true }), true)).toBe(false);
  });
  it("matches Ctrl+Alt+P elsewhere", () => {
    expect(isOpenRadarChord(key({ ctrlKey: true, altKey: true }), false)).toBe(true);
    expect(isOpenRadarChord(key({ metaKey: true, altKey: true }), false)).toBe(false);
  });
});

describe("workspace route decoding (mirrors Paseo 0.10)", () => {
  it("raw ids pass through", () => {
    expect(workspaceIdFromPathname("/h/srv_1/workspace/wks_29f70d70c62045c1")).toBe(
      "wks_29f70d70c62045c1",
    );
    expect(workspaceIdFromPathname("/h/srv_1/workspace/wks_abc/agent/x")).toBe("wks_abc");
  });
  it("b64_ prefixed and bare base64url paths decode", () => {
    expect(decodeWorkspaceSegment(`b64_${b64url("/Users/gordon/dev/x")}`)).toBe(
      "/Users/gordon/dev/x",
    );
    expect(decodeWorkspaceSegment(b64url("/Users/gordon/dev/ü"))).toBe("/Users/gordon/dev/ü");
  });
  it("a raw id that happens to be valid base64 but not a path stays raw", () => {
    expect(decodeWorkspaceSegment("abcd")).toBe("abcd");
  });
  it("non-workspace routes yield null", () => {
    expect(workspaceIdFromPathname("/h/srv_1/agent/abc")).toBeNull();
    expect(workspaceIdFromPathname("/")).toBeNull();
  });
});
