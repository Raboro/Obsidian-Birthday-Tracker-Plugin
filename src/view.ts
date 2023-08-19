import { ItemView, WorkspaceLeaf } from "obsidian";
import Person from "./person";

export const BIRTHDAY_TRACKER_VIEW_TYPE = "Birthday-Tracker";

export class BirthdayTrackerView extends ItemView {
    persons: Array<Person>
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
            this.persons.forEach(person => contentEl.createEl("p", {
                text: person.toDTO().name + " birthday at: " + person.toDTO().birthday
            })); 
        } else {
            contentEl.createEl("h3", {text: "Hit the ribbon icon or command to load birthdays"});
        }
    }
    
}