import { Children, isValidElement, type ReactNode } from "react";
import { beforeEach, expect, test, vi } from "vitest";

const platform = vi.hoisted(() => ({ OS: "web" }));
vi.mock("react-native", () => ({
  Platform: platform,
  Pressable: "Pressable",
  Text: "Text",
  View: "View",
}));

import { SORT_KEYS, type SortKey } from "../client/radar";
import { type RadioKeyEvent, SortControls } from "../client/sort-controls";

interface ControlProps {
  children?: ReactNode;
  accessibilityRole?: string;
  accessibilityState?: { checked: boolean };
  "aria-checked"?: boolean;
  onPress?: () => void;
  tabIndex?: 0 | -1;
  onKeyDown?: (event: RadioKeyEvent) => void;
}

function radios(node: ReactNode): ControlProps[] {
  return Children.toArray(node).flatMap((child) => {
    if (!isValidElement<ControlProps>(child)) return [];
    if (child.props.accessibilityRole === "radio") return [child.props];
    return radios(child.props.children);
  });
}

const styles = { chip: {}, chipActive: {}, chipText: {}, chipTextActive: {} };

beforeEach(() => {
  platform.OS = "web";
});

test("exactly one sort is checked on web and native, and pressing another moves the checked state", () => {
  let sortKey: SortKey = "attention";
  const onSort = (key: SortKey) => {
    sortKey = key;
  };
  let controls = radios(SortControls({ sortKey, onSort, styles }));
  expect(controls.map((control) => control["aria-checked"])).toEqual([
    true,
    false,
    false,
    false,
    false,
  ]);
  for (const [index, key] of SORT_KEYS.entries()) {
    controls[index].onPress?.();
    expect(sortKey).toBe(key);
    controls = radios(SortControls({ sortKey, onSort, styles }));
    expect(controls.map((control) => control["aria-checked"])).toEqual(
      SORT_KEYS.map((sort) => sort === key),
    );
    expect(controls.map((control) => control.accessibilityState?.checked)).toEqual(
      SORT_KEYS.map((sort) => sort === key),
    );
    expect(controls.map((control) => control.tabIndex)).toEqual(
      SORT_KEYS.map((sort) => (sort === key ? 0 : -1)),
    );
  }
});

function keyEvent(key: string) {
  const nodes = SORT_KEYS.map(() => ({ focus: vi.fn() }));
  const currentTarget = { parentElement: { querySelectorAll: () => nodes } };
  return { key, target: currentTarget, currentTarget, preventDefault: vi.fn(), nodes };
}

test("Space selects the focused unchecked radio without scrolling or reselecting a checked one", () => {
  let sortKey: SortKey = "attention";
  const onSort = vi.fn((key: SortKey) => {
    sortKey = key;
  });
  const event = keyEvent(" ");
  radios(SortControls({ sortKey, onSort, styles }))[1].onKeyDown?.(event);
  expect(sortKey).toBe("mergeable");
  expect(onSort).toHaveBeenCalledExactlyOnceWith("mergeable");
  expect(event.preventDefault).toHaveBeenCalledOnce();
  radios(SortControls({ sortKey, onSort, styles }))[1].onKeyDown?.(keyEvent(" "));
  expect(onSort).toHaveBeenCalledOnce();
});

test.each([
  [0, "ArrowLeft", 4],
  [0, "ArrowUp", 4],
  [4, "ArrowRight", 0],
  [4, "ArrowDown", 0],
  [1, "ArrowRight", 2],
  [2, "ArrowLeft", 1],
] as const)("radio %i handles %s by selecting and focusing radio %i", (index, key, next) => {
  const onSort = vi.fn();
  const event = keyEvent(key);
  radios(SortControls({ sortKey: SORT_KEYS[index], onSort, styles }))[index].onKeyDown?.(event);
  expect(onSort).toHaveBeenCalledExactlyOnceWith(SORT_KEYS[next]);
  expect(event.preventDefault).toHaveBeenCalledOnce();
  expect(event.nodes.map((node) => node.focus.mock.calls.length)).toEqual(
    SORT_KEYS.map((_, position) => (position === next ? 1 : 0)),
  );
});

test.each(["Tab", "Enter", "a"])("%s keeps the host's existing keyboard behavior", (key) => {
  const onSort = vi.fn();
  const event = keyEvent(key);
  radios(SortControls({ sortKey: "attention", onSort, styles }))[0].onKeyDown?.(event);
  expect(onSort).not.toHaveBeenCalled();
  expect(event.preventDefault).not.toHaveBeenCalled();
  expect(event.nodes.every((node) => node.focus.mock.calls.length === 0)).toBe(true);
});

test("Space from another event target is not captured", () => {
  const onSort = vi.fn();
  const event = keyEvent(" ");
  event.target = { ...event.currentTarget };
  radios(SortControls({ sortKey: "attention", onSort, styles }))[0].onKeyDown?.(event);
  expect(onSort).not.toHaveBeenCalled();
  expect(event.preventDefault).not.toHaveBeenCalled();
});

test.each(["ios", "android"])("%s keeps native press behavior without web keyboard props", (os) => {
  platform.OS = os;
  const onSort = vi.fn();
  const controls = radios(SortControls({ sortKey: "attention", onSort, styles }));
  expect(
    controls.every((control) => control.onKeyDown === undefined && control.tabIndex === undefined),
  ).toBe(true);
  controls[1].onPress?.();
  expect(onSort).toHaveBeenCalledExactlyOnceWith("mergeable");
});
