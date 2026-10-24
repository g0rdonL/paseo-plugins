import {
  Platform,
  Pressable,
  type StyleProp,
  Text,
  type TextStyle,
  View,
  type ViewStyle,
} from "react-native";
import { SORT_KEYS, SORT_TITLES, type SortKey } from "./radar";

interface SortControlsProps {
  sortKey: SortKey;
  onSort: (key: SortKey) => void;
  styles: {
    chip: StyleProp<ViewStyle>;
    chipActive: StyleProp<ViewStyle>;
    chipText: StyleProp<TextStyle>;
    chipTextActive: StyleProp<TextStyle>;
  };
}

// The host's React Native Web forwards this DOM event; native RN does not declare it.
export interface RadioKeyEvent {
  key: string;
  target: unknown;
  currentTarget: {
    parentElement: { querySelectorAll(selector: string): ArrayLike<{ focus(): void }> } | null;
  };
  preventDefault(): void;
}

const rowStyle: ViewStyle = { flexDirection: "row", flexWrap: "wrap", gap: 7 };

export function SortControls({ sortKey, onSort, styles }: SortControlsProps) {
  const isWeb = Platform.OS === "web";
  return (
    <View accessibilityRole="radiogroup" accessibilityLabel="Sort pull requests" style={rowStyle}>
      <Text style={[styles.chipText, { alignSelf: "center" }]}>Sort</Text>
      {SORT_KEYS.map((key, index) => (
        <Pressable
          accessibilityRole="radio"
          accessibilityState={{ checked: sortKey === key }}
          aria-checked={sortKey === key}
          key={key}
          tabIndex={isWeb ? (sortKey === key ? 0 : -1) : undefined}
          {...(isWeb
            ? {
                onKeyDown: (event: RadioKeyEvent) => {
                  if (event.target !== event.currentTarget) return;
                  let next = index;
                  switch (event.key) {
                    case " ":
                      break;
                    case "ArrowRight":
                    case "ArrowDown":
                      next = (index + 1) % SORT_KEYS.length;
                      break;
                    case "ArrowLeft":
                    case "ArrowUp":
                      next = (index + SORT_KEYS.length - 1) % SORT_KEYS.length;
                      break;
                    default:
                      return;
                  }
                  event.preventDefault();
                  if (SORT_KEYS[next] !== sortKey) onSort(SORT_KEYS[next]);
                  if (next !== index) {
                    event.currentTarget.parentElement
                      ?.querySelectorAll('[role="radio"]')
                      [next]?.focus();
                  }
                },
              }
            : {})}
          onPress={() => onSort(key)}
          style={[styles.chip, sortKey === key && styles.chipActive]}
        >
          <Text style={[styles.chipText, sortKey === key && styles.chipTextActive]}>
            {SORT_TITLES[key]}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
