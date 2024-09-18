import { ItemView } from 'obsidian';
import type Person from '../person';
import type { PersonDTO } from '../person';

export const BIRTHDAY_TRACKER_VIEW_TYPE = 'Birthday-Tracker';

export class BirthdayTrackerView extends ItemView {
  private container: HTMLDivElement;
  icon = 'cake';

  getViewType(): string {
    return BIRTHDAY_TRACKER_VIEW_TYPE;
  }

  getDisplayText(): string {
    return BIRTHDAY_TRACKER_VIEW_TYPE;
  }

  async onOpen() {
    const { contentEl } = this;
    contentEl.createEl('h1', { text: 'Birthday Tracker' });
    this.container = contentEl.createDiv({ cls: 'personsFlexboxContainer' });
  }

  displayPersons(persons: Array<Person>): void {
    while (this.container.firstChild) {
      this.container.removeChild(this.container.lastChild as Node);
    }
    // biome-ignore lint: performance issue to use for..of not relevant
    persons.forEach((person) => this.displayPerson(person.toDTO()));
  }

  displayPerson(person: PersonDTO): void {
    const div: HTMLDivElement = this.container.createDiv({
      cls: 'personContainer',
    });
    div.createEl('p', {
      text: `Name: ${person.name} (${person.age})`,
    });
    div.createEl('p', {
      text: `Days next birthday: ${person.nextBirthdayInDays}`,
    });
    div.createEl('p', { text: `Birthday: ${person.birthday}` });
  }
}
