import { App, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

interface BirthdayTrackerSettings {
	dateFormatting: string;
}

const DEFAULT_SETTINGS: BirthdayTrackerSettings = {
	dateFormatting: 'DD/MM/YYYY'
};

export default class BirthdayTrackerPlugin extends Plugin {
	settings: BirthdayTrackerSettings;

	async onload() {
		await this.loadSettings();

		const ribbonIconEl = this.addRibbonIcon('dice', 'Track birthdays', (evt: MouseEvent) => {
			new Notice('Track birthdays');
		});
		ribbonIconEl.addClass('birthday-tracker-plugin-ribbon-class');

		this.addCommand({
			id: 'birthday-tracker-track-birthdays',
			name: 'Track birthdays',
			callback: () => {
				new Notice("worked");
			}
		});

		this.addSettingTab(new BirthdayTrackerSettingTab(this.app, this));

		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class BirthdayTrackerSettingTab extends PluginSettingTab {
	plugin: BirthdayTrackerPlugin;

	constructor(app: App, plugin: BirthdayTrackerPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Date formatting')
			.setDesc('Format your dates will be displayed and collected')
			.addText(text => text
				.setPlaceholder('Enter your format')
				.setValue(this.plugin.settings.dateFormatting)
				.onChange(async (value) => {
					let noticeMessage = "Wrong date formatting!!";
					if (this.isFormattingValid(value)) {
						this.plugin.settings.dateFormatting = value;
						await this.plugin.saveSettings();
						noticeMessage = "Valid date formatting";
					} 
					new Notice(noticeMessage);
				}));
	}

	isFormattingValid(format: string): boolean {
		const containsDoubleD: boolean = this.formatContains("DD", format);
		const containsDoubleM: boolean = this.formatContains("MM", format);
		const containsFourY: boolean = this.formatContains("YYYY", format);
		return containsDoubleD && containsDoubleM && containsFourY && !this.containsInvalidChars(format);
	}

	formatContains(subStr: string, format: string): boolean {
		return format.contains(subStr) || format.contains(subStr.toLowerCase());
	}

	containsInvalidChars(format: string): boolean {
		const invalidChars: string[] = ["A", "B", "C", "E", "F", "G", "H", "I", "J", "K", "L", "N", 
										"O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Z"];
		for (const invalidChar in invalidChars) {
			if (this.formatContains(invalidChar, format)) {
				return true;
			}
		}
		return false;
	}
}
