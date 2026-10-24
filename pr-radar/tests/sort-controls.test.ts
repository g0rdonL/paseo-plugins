import { Children, isValidElement, type ReactNode } from "react";
import { expect, test, vi } from "vitest";

vi.mock("react-native", () => ({ Pressable: "Pressable", Text: "Text", View: "View" }));

import { SORT_KEYS, type SortKey } from "../client/radar";
import { SortControls } from "../client/sort-controls";

interface ControlProps {
  children?: ReactNode;
  accessibilityRole?: string;
  accessibilityState?: { checked: boolean };
  "aria-checked"?: boolean;
  onPress?: () => void;
}

function radios(node: ReactNode): ControlProps[] {
  return Children.toArray(node).flatMap((child) => {
    if (!isValidElement<ControlProps>(child)) return [];
    if (child.props.accessibilityRole === "radio") return [child.props];
    return radios(child.props.children);
  });
}

const styles = { chips: {}, chip: {}, chipActive: {}, chipText: {}, chipTextActive: {} };

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
  }
});
