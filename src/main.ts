import { Notice, Plugin } from 'obsidian';
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
		this.noticeIfBirthdayToday(persons);
	};

	collectPersons(content: string): Array<Person> {
		const persons: Array<Person> = [];
		const splitChar = ";";
		content.split(/\r?\n/).forEach(person => {
			const name = person.substring(5, person.search(splitChar));
			const birthday = person.substring(person.search(splitChar) + 11);
			persons.push(new Person(name, new Birthday(birthday, this.settings.dateFormatting)));
		});
		return persons;
	}

	noticeIfBirthdayToday(persons: Array<Person>): void {
		const personsBirthdayToday: Array<Person> = persons.filter(person => person.hasBirthdayToday());
		if (personsBirthdayToday.length !== 0) {
			this.noticeForAllBirthdaysToday(personsBirthdayToday);
		}
	}

	noticeForAllBirthdaysToday(personsBirthdayToday: Array<Person>): void {
		let message: string = "Today ";
		personsBirthdayToday.forEach(person => message = message.concat(person.toDTO().name).concat(", "));
		message = message.substring(0, message.length-2); // remove last not needed ", "
		new Notice(message.concat((personsBirthdayToday.length > 1 ? " have": " has") + " birthday"));
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
