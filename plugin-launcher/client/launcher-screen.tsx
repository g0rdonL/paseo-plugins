import { type PluginSurfaceProps, useRpc, useSettings } from "@getpaseo/plugin/client";
import { Icon } from "@getpaseo/plugin/client/react-native";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { launcherList, launcherSettings, type SidebarItem } from "../shared/launcher";
import { buildPluginSidebarRoute } from "../shared/routes";
import { navigateToSidebarRoute } from "./web";

export function LauncherScreen({ theme, layout, host }: PluginSurfaceProps) {
  const list = useRpc(launcherList);
  const query = useQuery({
    queryKey: ["plugin-launcher", host.id],
    queryFn: () => list({}),
  });

  const styles = useMemo(() => {
    const gutter = layout.compact ? 14 : 24;
    const mutedBorder = `${theme.colors.foregroundMuted}35`;
    return {
      screen: { flex: 1 as const, backgroundColor: theme.colors.surface0 },
      content: {
        width: "100%" as const,
        maxWidth: 720,
        alignSelf: "center" as const,
        paddingBottom: 48,
      },
      header: {
        flexDirection: "row" as const,
        alignItems: "center" as const,
        justifyContent: "space-between" as const,
        paddingHorizontal: gutter,
        paddingTop: layout.compact ? 18 : 28,
        paddingBottom: 18,
        gap: 12,
      },
      title: {
        color: theme.colors.foreground,
        fontSize: layout.compact ? 26 : 32,
        fontWeight: "800" as const,
        letterSpacing: -0.8,
      },
      refresh: {
        minHeight: 34,
        justifyContent: "center" as const,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: theme.colors.accent,
        borderRadius: 8,
        backgroundColor: theme.colors.accent,
      },
      refreshPressed: { opacity: 0.72 },
      refreshText: {
        color: theme.colors.accentForeground,
        fontSize: 13,
        fontWeight: "700" as const,
      },
      row: {
        flexDirection: "row" as const,
        alignItems: "center" as const,
        gap: 12,
        marginHorizontal: gutter,
        paddingVertical: layout.compact ? 12 : 14,
        paddingHorizontal: 12,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
      },
      rowPressed: { backgroundColor: theme.colors.surface1 },
      icon: {
        width: 30,
        alignItems: "center" as const,
      },
      rowBody: { flex: 1 as const, gap: 2 },
      rowTitle: {
        color: theme.colors.foreground,
        fontSize: 15,
        fontWeight: "700" as const,
      },
      rowSubtitle: { color: theme.colors.foregroundMuted, fontSize: 12 },
      empty: {
        paddingHorizontal: gutter,
        paddingVertical: 52,
        alignItems: "center" as const,
        gap: 8,
      },
      emptyTitle: { color: theme.colors.foreground, fontSize: 18, fontWeight: "700" as const },
      emptyDetail: {
        color: theme.colors.foregroundMuted,
        fontSize: 13,
        lineHeight: 19,
        textAlign: "center" as const,
        maxWidth: 440,
      },
      error: { color: theme.colors.statusDanger, fontSize: 13, lineHeight: 18 },
      spinner: { marginVertical: 52 },
      mutedBorder,
    };
  }, [layout.compact, theme]);

  if (Platform.OS !== "web") {
    return (
      <View style={styles.screen}>
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>Desktop only</Text>
          <Text style={styles.emptyDetail}>
            The plugin launcher only works inside the Paseo desktop app.
          </Text>
        </View>
      </View>
    );
  }

  const items = query.data?.items ?? [];

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Plugins</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Refresh plugin list"
          accessibilityState={{ busy: query.isFetching }}
          disabled={query.isFetching}
          onPress={() => void query.refetch()}
          style={({ pressed }) => [styles.refresh, pressed && styles.refreshPressed]}
        >
          <Text style={styles.refreshText}>{query.isFetching ? "Scanning" : "Refresh"}</Text>
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {query.isPending ? (
          <ActivityIndicator color={theme.colors.accent} style={styles.spinner} />
        ) : null}
        {query.error ? (
          <View style={styles.empty}>
            <Text accessibilityRole="alert" style={styles.error}>
              {query.error instanceof Error ? query.error.message : "Could not list plugins."}
            </Text>
          </View>
        ) : null}
        {!query.isPending && !query.error && items.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No plugins found</Text>
            <Text style={styles.emptyDetail}>
              No running plugins with a sidebar screen were detected. Disable other plugins' sidebar
              buttons in Settings and use this launcher instead.
            </Text>
          </View>
        ) : null}
        {items.map((item) => (
          <Pressable
            key={`${item.pluginId}\u0000${item.itemId}`}
            accessibilityRole="button"
            accessibilityLabel={`Open ${item.title}`}
            onPress={() =>
              navigateToSidebarRoute(buildPluginSidebarRoute(host.id, item.pluginId, item.itemId))
            }
            style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
          >
            <View style={styles.icon}>
              {item.icon ? (
                <Icon name={item.icon} size={18} color={theme.colors.foregroundMuted} />
              ) : null}
            </View>
            <View style={styles.rowBody}>
              <Text style={styles.rowTitle} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.rowSubtitle} numberOfLines={1}>
                {item.pluginId}
              </Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

export function LauncherSettingsScreen({ theme, layout }: PluginSurfaceProps) {
  const settings = useSettings(launcherSettings);
  const [draft, setDraft] = useState<SidebarItem[]>([]);
  const seededRef = useRef(false);

  useEffect(() => {
    if (settings.status === "ready" && !seededRef.current) {
      seededRef.current = true;
      setDraft(settings.values.overrides.map((item) => ({ ...item })));
    }
  }, [settings.status]);

  const styles = useMemo(() => {
    const gutter = layout.compact ? 14 : 24;
    return {
      screen: { flex: 1 as const, backgroundColor: theme.colors.surface0 },
      content: {
        width: "100%" as const,
        maxWidth: 720,
        alignSelf: "center" as const,
        paddingHorizontal: gutter,
        paddingBottom: 48,
        gap: 14,
      },
      title: {
        color: theme.colors.foreground,
        fontSize: layout.compact ? 26 : 32,
        fontWeight: "800" as const,
        letterSpacing: -0.8,
        paddingTop: layout.compact ? 18 : 28,
      },
      detail: { color: theme.colors.foregroundMuted, fontSize: 13, lineHeight: 19 },
      row: {
        flexDirection: "row" as const,
        flexWrap: "wrap" as const,
        gap: 8,
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: 10,
        backgroundColor: theme.colors.surface1,
      },
      field: { minWidth: 140, flexGrow: 1 as const, flexBasis: 140, gap: 4 },
      label: { color: theme.colors.foregroundMuted, fontSize: 11, fontWeight: "700" as const },
      input: {
        minHeight: 36,
        color: theme.colors.foreground,
        backgroundColor: theme.colors.surface0,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: 6,
        paddingHorizontal: 10,
        paddingVertical: 6,
        fontSize: 13,
      },
      actions: { flexDirection: "row" as const, gap: 8, marginTop: 4 },
      button: {
        minHeight: 36,
        justifyContent: "center" as const,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: theme.colors.accent,
        borderRadius: 8,
        backgroundColor: theme.colors.accent,
      },
      buttonPressed: { opacity: 0.72 },
      buttonText: {
        color: theme.colors.accentForeground,
        fontSize: 13,
        fontWeight: "700" as const,
      },
      remove: {
        minHeight: 36,
        justifyContent: "center" as const,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: 8,
      },
      removeText: { color: theme.colors.foregroundMuted, fontSize: 13 },
      error: { color: theme.colors.statusDanger, fontSize: 13, lineHeight: 18 },
      notice: { color: theme.colors.statusSuccess, fontSize: 13, lineHeight: 18 },
      spinner: { marginVertical: 32 },
    };
  }, [layout.compact, theme]);

  const updateDraft = (index: number, patch: Partial<SidebarItem>) => {
    setDraft((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  };
  const addRow = () =>
    setDraft((prev) => [...prev, { pluginId: "", itemId: "", title: "", icon: "" }]);
  const removeRow = (index: number) => setDraft((prev) => prev.filter((_, i) => i !== index));

  const save = () => {
    if (settings.status !== "ready") return;
    const cleaned = draft.filter((item) => item.pluginId && item.itemId && item.title);
    void settings.save({ overrides: cleaned }, settings.revision);
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Plugin Launcher</Text>
        <Text style={styles.detail}>
          Overrides add or replace launcher entries. Leave a row's pluginId and itemId empty to
          match a plugin by id only. Save to apply.
        </Text>
        {settings.status === "loading" ? (
          <ActivityIndicator color={theme.colors.accent} style={styles.spinner} />
        ) : null}
        {settings.status === "error" ? (
          <Text accessibilityRole="alert" style={styles.error}>
            {settings.error}
          </Text>
        ) : null}
        {settings.status === "invalid" ? (
          <Text accessibilityRole="alert" style={styles.error}>
            {settings.error}
          </Text>
        ) : null}
        {settings.status === "ready" ? (
          <>
            {draft.map((item, index) => (
              <View key={`${item.pluginId}:${item.itemId}:${index}`} style={styles.row}>
                <View style={styles.field}>
                  <Text style={styles.label}>Plugin ID</Text>
                  <TextInput
                    autoCapitalize="none"
                    autoCorrect={false}
                    onChangeText={(value) => updateDraft(index, { pluginId: value })}
                    placeholder="plugin-id"
                    placeholderTextColor={theme.colors.foregroundMuted}
                    style={styles.input}
                    value={item.pluginId}
                  />
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>Item ID</Text>
                  <TextInput
                    autoCapitalize="none"
                    autoCorrect={false}
                    onChangeText={(value) => updateDraft(index, { itemId: value })}
                    placeholder="main"
                    placeholderTextColor={theme.colors.foregroundMuted}
                    style={styles.input}
                    value={item.itemId}
                  />
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>Title</Text>
                  <TextInput
                    autoCapitalize="none"
                    autoCorrect={false}
                    onChangeText={(value) => updateDraft(index, { title: value })}
                    placeholder="My Plugin"
                    placeholderTextColor={theme.colors.foregroundMuted}
                    style={styles.input}
                    value={item.title}
                  />
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>Icon</Text>
                  <TextInput
                    autoCapitalize="none"
                    autoCorrect={false}
                    onChangeText={(value) => updateDraft(index, { icon: value })}
                    placeholder="Blocks"
                    placeholderTextColor={theme.colors.foregroundMuted}
                    style={styles.input}
                    value={item.icon}
                  />
                </View>
                <View style={styles.actions}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Remove override"
                    onPress={() => removeRow(index)}
                    style={({ pressed }) => [styles.remove, pressed && styles.buttonPressed]}
                  >
                    <Text style={styles.removeText}>Remove</Text>
                  </Pressable>
                </View>
              </View>
            ))}
            <View style={styles.actions}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Add override"
                onPress={addRow}
                style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
              >
                <Text style={styles.buttonText}>Add override</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Save overrides"
                accessibilityState={{ busy: settings.saving }}
                disabled={settings.saving}
                onPress={save}
                style={({ pressed }) => [
                  styles.button,
                  (pressed || settings.saving) && styles.buttonPressed,
                ]}
              >
                <Text style={styles.buttonText}>{settings.saving ? "Saving…" : "Save"}</Text>
              </Pressable>
            </View>
            {settings.saveError ? (
              <Text accessibilityRole="alert" style={styles.error}>
                {settings.saveError}
              </Text>
            ) : null}
          </>
        ) : null}
      </ScrollView>
    </View>
  );
}
