import { Plugin, TFile, Notice, Menu, requestUrl } from "obsidian";
import { ShardPublishSettings, DEFAULT_SETTINGS, ShardPublishSettingTab } from "./settings";
import { publishFile, unpublishFile } from "./publisher";

export default class ShardPublishPlugin extends Plugin {
  settings: ShardPublishSettings;
  statusBarItem: HTMLElement;

  async onload() {
    await this.loadSettings();

    // 1. Add Ribbon Icon
    this.addRibbonIcon("upload-cloud", "Publish to Shard", async () => {
      const activeFile = this.app.workspace.getActiveFile();
      if (!activeFile) {
        new Notice("No active file to publish.");
        return;
      }
      await this.publishFlow(activeFile);
    });

    // 2. Add Status Bar Item
    this.statusBarItem = this.addStatusBarItem();
    this.registerEvent(
      this.app.workspace.on("file-open", (file) => this.updateStatusBar(file))
    );

    // 3. Add Commands
    this.addCommand({
      id: "publish-current-file",
      name: "Publish current file to Shard",
      checkCallback: (checking: boolean) => {
        const activeFile = this.app.workspace.getActiveFile();
        const isValid = activeFile && (activeFile.extension === "canvas" || activeFile.extension === "md");
        if (checking) return !!isValid;
        if (activeFile) {
          this.publishFlow(activeFile);
        }
      },
    });

    this.addCommand({
      id: "unpublish-current-file",
      name: "Unpublish current file from Shard",
      checkCallback: (checking: boolean) => {
        const activeFile = this.app.workspace.getActiveFile();
        const isValid = activeFile && (activeFile.extension === "canvas" || activeFile.extension === "md");
        if (checking) return !!isValid;
        if (activeFile) {
          this.unpublishFlow(activeFile);
        }
      },
    });

    this.addCommand({
      id: "open-in-shard",
      name: "Open current file in Shard browser",
      checkCallback: (checking: boolean) => {
        const activeFile = this.app.workspace.getActiveFile();
        const isValid = activeFile && (activeFile.extension === "canvas" || activeFile.extension === "md");
        if (checking) return !!isValid;
        if (activeFile) {
          this.openInBrowser(activeFile);
        }
      },
    });

    // 4. Register File Menu items
    this.registerEvent(
      this.app.workspace.on("file-menu", (menu: Menu, file) => {
        if (!(file instanceof TFile)) return;
        if (file.extension !== "canvas" && file.extension !== "md") return;

        menu.addItem((item) => {
          item
            .setTitle("Publish to Shard")
            .setIcon("upload-cloud")
            .onClick(async () => {
              await this.publishFlow(file);
            });
        });

        menu.addItem((item) => {
          item
            .setTitle("Unpublish from Shard")
            .setIcon("trash")
            .onClick(async () => {
              await this.unpublishFlow(file);
            });
        });
      })
    );

    // 5. Add Settings Tab
    this.addSettingTab(new ShardPublishSettingTab(this.app, this));

    // Update status bar for initial file
    this.updateStatusBar(this.app.workspace.getActiveFile());
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  async publishFlow(file: TFile) {
    new Notice(`Publishing ${file.name} to Shard...`);
    const result = await publishFile(this.app, file, this.settings, this.settings.defaultVisibility);
    
    if (result.ok) {
      new Notice(`Successfully published: ${file.name}`);
      this.updateStatusBar(file);
    } else {
      new Notice(`Publish failed: ${result.error}`);
    }
  }

  async unpublishFlow(file: TFile) {
    new Notice(`Unpublishing ${file.name} from Shard...`);
    const result = await unpublishFile(this.app, file, this.settings);
    
    if (result.ok) {
      new Notice(`Successfully unpublished: ${file.name}`);
      this.updateStatusBar(file);
    } else {
      new Notice(`Unpublish failed: ${result.error}`);
    }
  }

  openInBrowser(file: TFile) {
    if (!this.settings.shardUrl) {
      new Notice("Shard URL not configured.");
      return;
    }
    const slug = file.path.substring(0, file.path.length - file.extension.length - 1);
    const url = `${this.settings.shardUrl}/${encodeURIComponent(slug)}`;
    window.open(url, "_blank");
  }

  async updateStatusBar(file: TFile | null) {
    if (!file || (file.extension !== "canvas" && file.extension !== "md")) {
      this.statusBarItem.setText("");
      return;
    }

    if (!this.settings.shardUrl) {
      this.statusBarItem.setText("Shard: Configure URL");
      return;
    }

    const slug = file.path.substring(0, file.path.length - file.extension.length - 1);
    try {
      const response = await requestUrl({
        url: `${this.settings.shardUrl}/api/canvas/${encodeURIComponent(slug)}/status`
      });
      if (response.status === 200) {
        const data = response.json;
        if (data.isPublic) {
          this.statusBarItem.setText("Shard: Public 🌐");
        } else {
          this.statusBarItem.setText("Shard: Private 🔒");
        }
      } else {
        this.statusBarItem.setText("Shard: Not Published");
      }
    } catch {
      this.statusBarItem.setText("Shard: Offline");
    }
  }
}
