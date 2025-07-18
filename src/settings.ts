import { type App, Notice, PluginSettingTab, Setting } from 'obsidian';
import { DefaultDateFormatter } from './dateFormatter';
import type BirthdayTrackerPlugin from './main';

export interface BirthdayTrackerSettings {
  dateFormatting: string;
  birthdayNodeLocation: string;
}

export const DEFAULT_SETTINGS: BirthdayTrackerSettings = {
  dateFormatting: 'DD/MM/YYYY',
  birthdayNodeLocation: 'birthdayNode.md',
};

export class BirthdayTrackerSettingTab extends PluginSettingTab {
  plugin: BirthdayTrackerPlugin;

  constructor(app: App, plugin: BirthdayTrackerPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    this.containerEl.empty();
    this.dateFormatterSettings();
    this.birthdayNodeLocationSettings();
  }

  dateFormatterSettings(): Setting {
    return new Setting(this.containerEl)
      .setName('Date formatting')
      .setDesc('Format your dates will be displayed and collected')
      .addText((text) =>
        text
          .setPlaceholder('Enter your format')
          .setValue(this.plugin.settings.dateFormatting)
          .onChange(async (v) => await this.dateFormatterSettingsOnChange(v)),
      );
  }

  dateFormatterSettingsOnChange = async (value: string) => {
    let noticeMessage = 'Wrong date formatting!!';
    const dateFormatter = DefaultDateFormatter.createFormat(value);
    if (dateFormatter) {
      this.plugin.settings.dateFormatting = dateFormatter.format;
      await this.plugin.saveSettings();
      noticeMessage = 'Valid date formatting';
    }
    new Notice(noticeMessage);
  };

  birthdayNodeLocationSettings(): Setting {
    return new Setting(this.containerEl)
      .setName('Birthday node location')
      .setDesc(
        'Location of your Node containing the birthday data with .md as postfix',
      )
      .addTextArea((text) =>
        text
          .setPlaceholder('Enter the node location')
          .setValue(this.plugin.settings.birthdayNodeLocation)
          .onChange(async (value) => {
            this.plugin.settings.birthdayNodeLocation = value;
            await this.plugin.saveSettings();
          }),
      );
  }
}
