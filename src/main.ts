import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

interface BirthdayTrackerSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: BirthdayTrackerSettings = {
	mySetting: 'default'
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
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
	}
}
