import { type App, Modal } from 'obsidian';
import type { PersonDTO } from '../person';

export default class PersonModal extends Modal {
  private person: PersonDTO;

  constructor(app: App, person: PersonDTO) {
    super(app);
    this.person = person;
  }

  onOpen(): void {
    const { contentEl } = this;
    const div: HTMLDivElement = contentEl.createDiv({
      cls: 'personContainer smallerScale',
    });
    div.createEl('p', {
      text: 'Name: ' + this.person.name + ' (' + this.person.age + ')',
    });
    div.createEl('p', {
      text: 'Days next birthday: ' + this.person.nextBirthdayInDays,
    });
    div.createEl('p', { text: 'Birthday: ' + this.person.birthday });
  }

  onClose(): void {
    const { contentEl } = this;
    contentEl.empty();
  }
}
