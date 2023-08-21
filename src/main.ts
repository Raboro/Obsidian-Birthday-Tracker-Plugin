import { Notice, Plugin, WorkspaceLeaf } from 'obsidian';
import { BirthdayTrackerSettings, BirthdayTrackerSettingTab, DEFAULT_SETTINGS } from './settings';
import Person from './person';
import Birthday from './birthday';
import { BIRTHDAY_TRACKER_VIEW_TYPE, BirthdayTrackerView } from './view';

export default class BirthdayTrackerPlugin extends Plugin {
	settings: BirthdayTrackerSettings;
	persons: Array<Person>;

	async onload() {
		await this.loadSettings();

		this.registerView(BIRTHDAY_TRACKER_VIEW_TYPE, (leaf) => new BirthdayTrackerView(leaf));

		const ribbonIconEl = this.addRibbonIcon('cake', 'Track birthdays', this.trackBirthdays);
		ribbonIconEl.addClass('birthday-tracker-plugin-ribbon-class');

		this.addCommand({
			id: 'track-birthdays',
			name: 'Track Birthdays',
			callback: this.trackBirthdays
		});

		this.addSettingTab(new BirthdayTrackerSettingTab(this.app, this));
		this.app.workspace.onLayoutReady(() => this.trackBirthdays());
	}

	onunload() {

	}

	trackBirthdays = async () => {
		const content = await this.fetchContent();
		if (content) {
			this.trackBirthdaysOfContent(content);
		}
		await this.openView();
	};

	async fetchContent(): Promise<string | undefined> {
		for (const file of this.app.vault.getFiles()) {
			const content = await this.app.vault.read(file);
			if (content.contains('BIRTHDAY_FILE')) {
				return content.trim().replace('BIRTHDAY_FILE','').trim();
			}
		}
		return undefined;
	}

	trackBirthdaysOfContent = (content: string) => {
		this.persons = this.collectPersons(content);
		this.persons.sort((p1: Person, p2: Person) => p1.compareTo(p2));
		this.noticeIfBirthdayToday(this.persons);
	};

	collectPersons(content: string): Array<Person> {
		const persons: Array<Person> = [];
		const splitChar = ';';
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
		let message = 'Today ';
		personsBirthdayToday.forEach(person => message = message.concat(person.toDTO().name).concat(', '));
		message = message.substring(0, message.length-2); // remove last not needed ", "
		new Notice(message.concat((personsBirthdayToday.length > 1 ? ' have': ' has') + ' birthday'));
	}

	async openView(): Promise<void> {
		const leaves: WorkspaceLeaf[] = this.app.workspace.getLeavesOfType(BIRTHDAY_TRACKER_VIEW_TYPE);
		if (this.persons) {
			(await this.getView(leaves)).displayPersons(this.persons);
		}
		this.app.workspace.revealLeaf(leaves[0]);
	}

	async getView(leaves: WorkspaceLeaf[]): Promise<BirthdayTrackerView> {
		if (leaves.length == 0) {
			leaves[0] = this.app.workspace.getRightLeaf(false);
			await leaves[0].setViewState({type: BIRTHDAY_TRACKER_VIEW_TYPE});
		}
		return leaves[0].view as BirthdayTrackerView;
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
