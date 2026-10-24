import { Platform } from "react-native";
import { afterEach, describe, expect, test, vi } from "vitest";
import { revealFocusedChip } from "../client/web";

vi.mock("react-native", () => ({ Platform: { OS: "web" } }));

afterEach(() => {
  Platform.OS = "web";
});

describe("focused filter chips", () => {
  test("reveals the focused child with nearest alignment instead of scrolling the container", () => {
    const target = { scrollIntoView: vi.fn() };
    const currentTarget = { scrollIntoView: vi.fn() };
    revealFocusedChip({ target, currentTarget } as unknown as Parameters<
      typeof revealFocusedChip
    >[0]);
    expect(target.scrollIntoView).toHaveBeenCalledWith({ block: "nearest", inline: "nearest" });
    expect(currentTarget.scrollIntoView).not.toHaveBeenCalled();
  });

  test.each(["ios", "android"] as const)(
    "leaves %s focus scrolling to the native view",
    (platform) => {
      Platform.OS = platform;
      const target = { scrollIntoView: vi.fn() };
      revealFocusedChip({ target } as unknown as Parameters<typeof revealFocusedChip>[0]);
      expect(target.scrollIntoView).not.toHaveBeenCalled();
      expect(() =>
        revealFocusedChip({ target: 1 } as unknown as Parameters<typeof revealFocusedChip>[0]),
      ).not.toThrow();
    },
  );
});
