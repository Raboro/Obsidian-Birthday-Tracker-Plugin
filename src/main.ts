import { Notice, Plugin, TFile, type WorkspaceLeaf } from 'obsidian';
import Birthday from './birthday';
import { DefaultDateFormatter } from './dateFormatter';
import SearchPersonModal from './modals/SearchPersonModal';
import Person from './person';
import {
  type BirthdayTrackerSettings,
  BirthdayTrackerSettingTab,
  DEFAULT_SETTINGS,
} from './settings';
import {
  BIRTHDAY_TRACKER_VIEW_TYPE,
  BirthdayTrackerView,
} from './views/birthdayTrackerView';
import {
  BIRTHDAY_TRACKER_YEAR_OVERVIEW_VIEW_TYPE,
  YearOverviewView,
} from './views/yearOverviewView';

export default class BirthdayTrackerPlugin extends Plugin {
  settings: BirthdayTrackerSettings;
  persons: Array<Person>;

  async onload() {
    await this.loadSettings();

    this.registerView(
      BIRTHDAY_TRACKER_VIEW_TYPE,
      (leaf) => new BirthdayTrackerView(leaf),
    );
    this.registerView(
      BIRTHDAY_TRACKER_YEAR_OVERVIEW_VIEW_TYPE,
      (leaf) => new YearOverviewView(leaf),
    );

    const ribbonIconEl = this.addRibbonIcon(
      'cake',
      'Track birthdays',
      this.trackBirthdays,
    );
    ribbonIconEl.addClass('birthday-tracker-plugin-ribbon-class');
    this.addRibbonIcon(
      'calendar-days',
      'Open year overview',
      this.openYearView,
    );

    this.addCommands();

    this.addSettingTab(new BirthdayTrackerSettingTab(this.app, this));
    this.app.workspace.onLayoutReady(
      async () =>
        await this.trackBirthdaysWithOpenOption(
          this.settings.automaticallyOpenBirthdayViewOnStart,
        ),
    );
  }

  private addCommands() {
    this.addCommand({
      id: 'track-birthdays',
      name: 'Track Birthdays',
      callback: this.trackBirthdays,
    });
    this.addCommand({
      id: 'search-person',
      name: 'Search Person',
      callback: this.searchPerson,
    });
    this.addCommand({
      id: 'year-overview',
      name: 'Year Overview',
      callback: this.openYearView,
    });
  }

  onunload() {}

  trackBirthdays = async () => await this.trackBirthdaysWithOpenOption(true);

  trackBirthdaysWithOpenOption = async (shouldOpenView: boolean) => {
    const content = await this.fetchContent();
    if (content) {
      this.trackBirthdaysOfContent(content);
      if (shouldOpenView) {
        await this.openBirthdayView();
      }
    } else {
      new Notice('Nothing inside your node');
    }
  };

  async fetchContent(): Promise<string | undefined> {
    const file = this.app.vault.getAbstractFileByPath(
      this.settings.birthdayNodeLocation,
    );
    if (file && file instanceof TFile) {
      return (await this.app.vault.read(file)).trim();
    }
    new Notice(
      `Node could not be found at location: ${this.settings.birthdayNodeLocation}`,
    );
    return undefined;
  }

  trackBirthdaysOfContent = (content: string) => {
    this.persons = this.collectPersons(content);
    this.persons.sort((p1: Person, p2: Person) => p1.compareTo(p2));
    this.noticeIfBirthdayToday(this.persons);
  };

  collectPersons(content: string): Array<Person> {
    const persons: Array<Person> = [];
    // biome-ignore lint: performance issue to use for..of not relevant
    content.split(/\r?\n/).forEach((line) => {
      if (this.lineContainsPerson(line)) {
        const splittedLine = line.split(';');
        const name = splittedLine[0]?.trim().split('=').last()?.trim() ?? '';
        const birthdayAsString =
          splittedLine[1]?.replace(' ', '').split('=').last()?.trim() ?? '';
        const birthday = new Birthday(
          birthdayAsString,
          // biome-ignore lint/style/noNonNullAssertion: Should work, because this check is already done before in settings.ts when dateFormatting is updated
          DefaultDateFormatter.createFormat(this.settings.dateFormatting)!,
        );
        persons.push(new Person(name, birthday));
      }
    });
    return persons;
  }

  lineContainsPerson = (line: string) => {
    return line.contains('name=') && line.contains('birthday=');
  };

  noticeIfBirthdayToday(persons: Array<Person>): void {
    const personsBirthdayToday: Array<Person> = persons.filter((person) =>
      person.hasBirthdayToday(),
    );
    if (personsBirthdayToday.length !== 0) {
      this.noticeForAllBirthdaysToday(personsBirthdayToday);
    }
  }

  noticeForAllBirthdaysToday(personsBirthdayToday: Array<Person>): void {
    let message = 'Today ';
    // biome-ignore lint: performance issue to use for..of not relevant
    personsBirthdayToday.forEach(
      // biome-ignore lint: message can be overwritten here
      (person) => (message = message.concat(person.toDTO().name).concat(', ')),
    );
    message = message.substring(0, message.length - 2); // remove last not needed ", "
    new Notice(
      message.concat(
        `${personsBirthdayToday.length > 1 ? ' have' : ' has'} birthday`,
      ),
    );
  }

  async openBirthdayView(): Promise<void> {
    const leaves: WorkspaceLeaf[] = this.app.workspace.getLeavesOfType(
      BIRTHDAY_TRACKER_VIEW_TYPE,
    );
    if (this.persons) {
      (await this.getBirthdayView(leaves)).displayPersons(this.persons);
    }
    this.app.workspace.revealLeaf(leaves[0]);
  }

  async getBirthdayView(leaves: WorkspaceLeaf[]): Promise<BirthdayTrackerView> {
    if (leaves.length === 0) {
      const leaf: WorkspaceLeaf | null = this.app.workspace.getRightLeaf(false);
      if (leaf) {
        leaves[0] = leaf;
        await leaves[0].setViewState({ type: BIRTHDAY_TRACKER_VIEW_TYPE });
      }
    }
    return leaves[0].view as BirthdayTrackerView;
  }

  openYearView = async (): Promise<void> => {
    const leaves: WorkspaceLeaf[] = this.app.workspace.getLeavesOfType(
      BIRTHDAY_TRACKER_YEAR_OVERVIEW_VIEW_TYPE,
    );
    if (leaves.length === 0) {
      leaves[0] = this.app.workspace.getLeaf(false);
      await leaves[0].setViewState({
        type: BIRTHDAY_TRACKER_YEAR_OVERVIEW_VIEW_TYPE,
      });
    }
    const persons: Person[] = await this.getPersons();
    await (leaves[0].view as YearOverviewView).updatePersons(
      persons.map((p) => p.toDTO()),
    );
    this.app.workspace.revealLeaf(leaves[0]);
  };

  async getPersons(): Promise<Person[]> {
    const content = await this.fetchContent();
    if (content) {
      this.trackBirthdaysOfContent(content);
    }
    return this.persons;
  }

  searchPerson = async () => {
    await this.fetchContent();
    if (this.persons.length >= 1) {
      new SearchPersonModal(
        this.app,
        this.persons.map((person) => person.toDTO()),
      ).open();
    } else {
      new Notice('No persons were found');
    }
  };

  async loadSettings() {
    this.settings = { ...DEFAULT_SETTINGS, ...(await this.loadData()) };
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
