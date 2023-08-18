import { Notice, Plugin } from 'obsidian';
import { BirthdayTrackerSettingTab } from './settings';

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
