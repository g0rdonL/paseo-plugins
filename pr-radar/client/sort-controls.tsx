import {
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
    chips: StyleProp<ViewStyle>;
    chip: StyleProp<ViewStyle>;
    chipActive: StyleProp<ViewStyle>;
    chipText: StyleProp<TextStyle>;
    chipTextActive: StyleProp<TextStyle>;
  };
}

export function SortControls({ sortKey, onSort, styles }: SortControlsProps) {
  return (
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel="Sort pull requests"
      style={styles.chips}
    >
      <Text style={[styles.chipText, { alignSelf: "center" }]}>Sort</Text>
      {SORT_KEYS.map((key) => (
        <Pressable
          accessibilityRole="radio"
          accessibilityState={{ checked: sortKey === key }}
          aria-checked={sortKey === key}
          key={key}
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
