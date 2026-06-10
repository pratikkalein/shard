import { App, PluginSettingTab, Setting } from "obsidian";
import type ShardPublishPlugin from "./main";

export interface ShardPublishSettings {
  shardUrl: string;
  apiKey: string;
  defaultVisibility: "public" | "private";
}

export const DEFAULT_SETTINGS: ShardPublishSettings = {
  shardUrl: "",
  apiKey: "",
  defaultVisibility: "private",
};

export class ShardPublishSettingTab extends PluginSettingTab {
  plugin: ShardPublishPlugin;

  constructor(app: App, plugin: ShardPublishPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    containerEl.createEl("h2", { text: "Shard Publish Settings" });

    new Setting(containerEl)
      .setName("Shard URL")
      .setDesc("The base URL of your deployed Shard instance (e.g. https://shard.example.com)")
      .addText((text) =>
        text
          .setPlaceholder("https://shard.example.com")
          .setValue(this.plugin.settings.shardUrl)
          .onChange(async (value) => {
            this.plugin.settings.shardUrl = value.trim().replace(/\/$/, "");
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("API Key")
      .setDesc("The SHARD_PUBLISH_KEY configured on your Shard server")
      .addText((text) =>
        text
          .setPlaceholder("Enter API key")
          .setValue(this.plugin.settings.apiKey)
          .onChange(async (value) => {
            this.plugin.settings.apiKey = value.trim();
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Default Visibility")
      .setDesc("Initial visibility state for newly published content")
      .addDropdown((dropdown) =>
        dropdown
          .addOption("private", "Private (requires admin login to view)")
          .addOption("public", "Public (visible to everyone)")
          .setValue(this.plugin.settings.defaultVisibility)
          .onChange(async (value: "public" | "private") => {
            this.plugin.settings.defaultVisibility = value;
            await this.plugin.saveSettings();
          })
      );
  }
}
