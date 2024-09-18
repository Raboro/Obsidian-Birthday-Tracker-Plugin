import { type App, Notice, PluginSettingTab, Setting } from 'obsidian';
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
    this.dateFormattingSettings();
    this.birthdayNodeLocationSettings();
  }

  dateFormattingSettings(): Setting {
    return new Setting(this.containerEl)
      .setName('Date formatting')
      .setDesc('Format your dates will be displayed and collected')
      .addText((text) =>
        text
          .setPlaceholder('Enter your format')
          .setValue(this.plugin.settings.dateFormatting)
          .onChange(
            async (value) => await this.dateFormattingSettingsOnChange(value),
          ),
      );
  }

  dateFormattingSettingsOnChange = async (value: string) => {
    let noticeMessage = 'Wrong date formatting!!';
    if (this.isFormattingValid(value)) {
      this.plugin.settings.dateFormatting = value;
      await this.plugin.saveSettings();
      noticeMessage = 'Valid date formatting';
    }
    new Notice(noticeMessage);
  };

  isFormattingValid(format: string): boolean {
    const containsDoubleD: boolean = this.formatContains('DD', format);
    const containsDoubleM: boolean = this.formatContains('MM', format);
    const containsFourY: boolean = this.formatContains('YYYY', format);
    return (
      containsDoubleD &&
      containsDoubleM &&
      containsFourY &&
      !this.containsInvalidChars(format)
    );
  }

  formatContains(subStr: string, format: string): boolean {
    return format.contains(subStr) || format.contains(subStr.toLowerCase());
  }

  containsInvalidChars(format: string): boolean {
    const invalidChars: string[] = [
      'A',
      'B',
      'C',
      'E',
      'F',
      'G',
      'H',
      'I',
      'J',
      'K',
      'L',
      'N',
      'O',
      'P',
      'Q',
      'R',
      'S',
      'T',
      'U',
      'V',
      'W',
      'X',
      'Z',
    ];
    for (const invalidChar in invalidChars) {
      if (this.formatContains(invalidChar, format)) {
        return true;
      }
    }
    return false;
  }

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
