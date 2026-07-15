import {
  type App,
  Notice,
  PluginSettingTab,
  requireApiVersion,
  Setting,
  type SettingDefinitionItem,
} from 'obsidian';
import { DefaultDateFormatter } from './dateFormatter';
import type BirthdayTrackerPlugin from './main';

export interface BirthdayTrackerSettings {
  dateFormatting: string;
  birthdayNodeLocation: string;
  automaticallyOpenBirthdayViewOnStart: boolean;
}

export const DEFAULT_SETTINGS: BirthdayTrackerSettings = {
  dateFormatting: 'DD/MM/YYYY',
  birthdayNodeLocation: 'birthdayNode.md',
  automaticallyOpenBirthdayViewOnStart: true,
};

export class BirthdayTrackerSettingTab extends PluginSettingTab {
  plugin: BirthdayTrackerPlugin;

  constructor(app: App, plugin: BirthdayTrackerPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  getSettingDefinitions(): SettingDefinitionItem<
    keyof BirthdayTrackerSettings
  >[] {
    if (!requireApiVersion('1.13.0')) {
      return [];
    }

    return [
      {
        name: 'Date formatting',
        desc: 'Format your dates will be displayed and collected',
        render: (setting) => {
          setting.addText((text) =>
            text
              .setPlaceholder('Enter your format')
              .setValue(this.plugin.settings.dateFormatting)
              .onChange(
                async (value) =>
                  await this.dateFormattingSettingsOnChange(value),
              ),
          );
        },
      },
      {
        name: 'Birthday node location',
        desc: 'Location of your Node containing the birthday data with .md as postfix',
        control: {
          type: 'textarea',
          key: 'birthdayNodeLocation',
          placeholder: 'Enter the node location',
        },
      },
      {
        name: 'Automatically open birthday view on startup',
        desc: 'If enabled, the birthday view is automatically opened in the right leaf when Obsidian starts',
        control: {
          type: 'toggle',
          key: 'automaticallyOpenBirthdayViewOnStart',
        },
      },
    ];
  }

  async setControlValue(key: string, value: unknown): Promise<void> {
    if (!(key in this.plugin.settings)) {
      return;
    }

    Reflect.set(this.plugin.settings, key, value);
    await this.plugin.saveSettings();
  }

  display(): void {
    this.containerEl.empty();
    this.dateFormattingSettings();
    this.birthdayNodeLocationSettings();
    this.automaticallyOpenBirthdayViewOnStartSettings();
  }

  dateFormattingSettings(): Setting {
    return new Setting(this.containerEl)
      .setName('Date formatting')
      .setDesc('Format your dates will be displayed and collected')
      .addText((text) =>
        text
          .setPlaceholder('Enter your format')
          .setValue(this.plugin.settings.dateFormatting)
          .onChange(async (v) => await this.dateFormattingSettingsOnChange(v)),
      );
  }

  dateFormattingSettingsOnChange = async (value: string) => {
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

  automaticallyOpenBirthdayViewOnStartSettings(): Setting {
    return new Setting(this.containerEl)
      .setName('Automatically open birthday view on startup')
      .setDesc(
        'If enabled, the birthday view is automatically opened in the right leaf when Obsidian starts',
      )
      .addToggle((toggle) => {
        toggle
          .setValue(this.plugin.settings.automaticallyOpenBirthdayViewOnStart)
          .onChange(async (value) => {
            this.plugin.settings.automaticallyOpenBirthdayViewOnStart = value;
            await this.plugin.saveSettings();
          });
      });
  }
}
