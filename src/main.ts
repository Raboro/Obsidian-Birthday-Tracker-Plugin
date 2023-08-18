import { Plugin } from 'obsidian';
import { BirthdayTrackerSettings, BirthdayTrackerSettingTab, DEFAULT_SETTINGS } from './settings';

export default class BirthdayTrackerPlugin extends Plugin {
	settings: BirthdayTrackerSettings;

	async onload() {
		await this.loadSettings();

		const ribbonIconEl = this.addRibbonIcon('cake', 'Track birthdays', this.trackBirthdays);
		ribbonIconEl.addClass('birthday-tracker-plugin-ribbon-class');

		this.addCommand({
			id: 'birthday-tracker-track-birthdays',
			name: 'Track birthdays',
			callback: this.trackBirthdays
		});

		this.addSettingTab(new BirthdayTrackerSettingTab(this.app, this));

		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {

	}

	trackBirthdays = async () => {
		const content = await this.fetchContent();
		if (content) {
			await this.trackBirthdaysOfContent(content);
		}
	};

	async fetchContent():Promise<string | undefined> {
		for (const file of this.app.vault.getFiles()) {
			const content = await this.app.vault.read(file);
			if (content.contains("BIRTHDAY_FILE")) {
				return content;
			}
		}
		return undefined;
	}

	trackBirthdaysOfContent = async (content: string) => {
		// handle content
	};

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
