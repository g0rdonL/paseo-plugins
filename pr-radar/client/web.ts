import { Platform, type ScrollViewProps } from "react-native";

export const revealFocusedChip: NonNullable<ScrollViewProps["onFocus"]> = (event) => {
  if (Platform.OS !== "web") return;

  const target = event.target as unknown as {
    scrollIntoView(options: { block: "nearest"; inline: "nearest" }): void;
  };
  target.scrollIntoView({ block: "nearest", inline: "nearest" });
};
