import { ItemView, WorkspaceLeaf } from "obsidian";
import Person, { PersonDTO } from "./person";

export const BIRTHDAY_TRACKER_VIEW_TYPE = "Birthday-Tracker";

export class BirthdayTrackerView extends ItemView {
    persons: Array<Person>;
    icon = "cake";

    constructor(leaf: WorkspaceLeaf, persons: Array<Person>) {
        super(leaf);
        this.persons = persons;
      }

    getViewType(): string {
        return BIRTHDAY_TRACKER_VIEW_TYPE;
    }

    getDisplayText(): string {
        return BIRTHDAY_TRACKER_VIEW_TYPE;
    }

    async onOpen() {
        const { contentEl } = this;
        contentEl.createEl("h1", {text: "Birthday Tracker"});
        if (this.persons) {
            this.displayPersons(contentEl);
        } else {
            contentEl.createEl("h3", {text: "Hit the ribbon icon or command to load birthdays"});
        }
    }

    displayPersons(contentEl: HTMLElement): void {
        const container: HTMLDivElement = contentEl.createDiv({cls: "personsFlexboxContainer"});
        this.persons.forEach(person => this.displayPerson(person.toDTO(), container));
    }

    displayPerson(person: Readonly<PersonDTO>, container: HTMLDivElement): void {
        const div: HTMLDivElement = container.createDiv({cls: "personContainer"});
        div.createEl("p", {text: "Name: " + person.name})
        div.createEl("p", {text: "Days next birthday: " + person.nextBirthdayInDays})
        div.createEl("p", {text: "Birthday: "+ person.birthday})
    }
    
}