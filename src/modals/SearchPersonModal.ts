import { type App, FuzzySuggestModal } from 'obsidian';
import type { PersonDTO } from '../person';
import PersonModal from './PersonModal';

export default class SearchPersonModal extends FuzzySuggestModal<PersonDTO> {
  private persons: PersonDTO[];

  constructor(app: App, persons: PersonDTO[]) {
    super(app);
    this.persons = persons;
  }

  getItems(): PersonDTO[] {
    return this.persons;
  }

  getItemText(item: PersonDTO): string {
    return item.name;
  }

  onChooseItem(item: PersonDTO, evt: MouseEvent | KeyboardEvent): void {
    new PersonModal(this.app, item).open();
  }
}
