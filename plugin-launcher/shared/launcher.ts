import { defineRpc, defineSettings } from "@getpaseo/plugin";
import { z } from "zod";

export const SidebarItemSchema = z.object({
  pluginId: z.string(),
  itemId: z.string(),
  title: z.string(),
  icon: z.string().default(""),
});
export type SidebarItem = z.infer<typeof SidebarItemSchema>;

export const launcherList = defineRpc({
  name: "plugin-launcher.list",
  input: z.object({}),
  output: z.object({ items: z.array(SidebarItemSchema) }),
});

export const launcherSettings = defineSettings({
  id: "launcher",
  scope: "host",
  version: 1,
  schema: z.object({
    overrides: z.array(SidebarItemSchema).default([]),
  }),
});
