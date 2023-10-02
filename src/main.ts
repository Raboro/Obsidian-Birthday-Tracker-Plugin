import { Notice, Plugin, TFile, WorkspaceLeaf } from 'obsidian';
import { BirthdayTrackerSettings, BirthdayTrackerSettingTab, DEFAULT_SETTINGS } from './settings';
import Person from './person';
import Birthday from './birthday';
import { BIRTHDAY_TRACKER_VIEW_TYPE, BirthdayTrackerView } from './views/birthdayTrackerView';
import SearchPersonModal from './modals/SearchPersonModal';

export default class BirthdayTrackerPlugin extends Plugin {
	settings: BirthdayTrackerSettings;
	persons: Array<Person>;

	async onload() {
		await this.loadSettings();

		this.registerView(BIRTHDAY_TRACKER_VIEW_TYPE, (leaf) => new BirthdayTrackerView(leaf));

		const ribbonIconEl = this.addRibbonIcon('cake', 'Track birthdays', this.trackBirthdays);
		ribbonIconEl.addClass('birthday-tracker-plugin-ribbon-class');
		
		this.addCommands();

		this.addSettingTab(new BirthdayTrackerSettingTab(this.app, this));
		this.app.workspace.onLayoutReady(() => this.trackBirthdays());
	}

	private addCommands() {
		this.addCommand({
			id: 'track-birthdays',
			name: 'Track Birthdays',
			callback: this.trackBirthdays
		});
		this.addCommand({
			id: 'search-person',
			name: 'Search Person',
			callback: this.searchPerson
		});
	}

	onunload() {

	}

	trackBirthdays = async () => {
		const content = await this.fetchContent();
		if (content) {
			this.trackBirthdaysOfContent(content);
			await this.openBirthdayView();
		} else {
			new Notice('Nothing inside your node');	
		}
	};

	async fetchContent(): Promise<string | undefined> {
		const file = this.app.vault.getAbstractFileByPath(this.settings.birthdayNodeLocation);
		if (file && file instanceof TFile) {
			return (await this.app.vault.read(file)).trim();
		}
		new Notice('Node could not be found at location: ' + this.settings.birthdayNodeLocation);
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
		content.split(/\r?\n/).forEach(line => {
			if (this.lineContainsPerson(line)) {
				const name = line.substring(5, line.search(splitChar));
				const birthday = line.substring(line.search(splitChar) + 11);
				persons.push(new Person(name, new Birthday(birthday, this.settings.dateFormatting)));
			}
		});
		return persons;
	}

	lineContainsPerson = (line: string) => {
		return line.contains('name=') && line.contains('birthday=');
	};

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

	async openBirthdayView(): Promise<void> {
		const leaves: WorkspaceLeaf[] = this.app.workspace.getLeavesOfType(BIRTHDAY_TRACKER_VIEW_TYPE);
		if (this.persons) {
			(await this.getBirthdayView(leaves)).displayPersons(this.persons);
		}
		this.app.workspace.revealLeaf(leaves[0]);
	}

	async getBirthdayView(leaves: WorkspaceLeaf[]): Promise<BirthdayTrackerView> {
		if (leaves.length == 0) {
			leaves[0] = this.app.workspace.getRightLeaf(false);
			await leaves[0].setViewState({type: BIRTHDAY_TRACKER_VIEW_TYPE});
		}
		return leaves[0].view as BirthdayTrackerView;
	}

	searchPerson = async () => {
		await this.fetchContent();
        if (this.persons.length >= 1) {
			new SearchPersonModal(this.app, this.persons.map(person => person.toDTO())).open();
        } else {
            new Notice('No persons were found');
        }
    };

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
