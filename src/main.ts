import { Plugin } from 'obsidian';
import { BirthdayTrackerSettings, BirthdayTrackerSettingTab, DEFAULT_SETTINGS } from './settings';
import Person from './person';
import Birthday from './birthday';

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

	async fetchContent(): Promise<string | undefined> {
		for (const file of this.app.vault.getFiles()) {
			const content = await this.app.vault.read(file);
			if (content.contains("BIRTHDAY_FILE")) {
				return content.trim().replace("BIRTHDAY_FILE","").trim();
			}
		}
		return undefined;
	}

	trackBirthdaysOfContent = async (content: string) => {
		const persons: Array<Person> = this.collectPersons(content);
		persons.sort((p1: Person, p2: Person) => p1.compareTo(p2));
	};

	collectPersons(content: string): Array<Person> {
		const persons: Array<Person> = [];
		const splitChar: string = ";";
		content.split(/\r?\n/).forEach(person => {
			const name = person.substring(5, person.search(splitChar));
			const birthday = person.substring(person.search(splitChar) + 11);
			persons.push(new Person(name, new Birthday(birthday, this.settings.dateFormatting)));
		});
		return persons;
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
