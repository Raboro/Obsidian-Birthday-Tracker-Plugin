import { ItemView } from "obsidian";
import { PersonDTO } from "src/person";

export const BIRTHDAY_TRACKER_YEAR_OVERVIEW_VIEW_TYPE = "Birthday-Tracker-Year-Overview";

const MONTHS = ["January", "February", "March", "April", "Mai", "June", "July", "August", "September", "October", "November", "December"]

export class YearOverviewView extends ItemView {
    icon = "calendar-days";
    persons: PersonDTO[] = [];

    getViewType(): string {
        return BIRTHDAY_TRACKER_YEAR_OVERVIEW_VIEW_TYPE;
    }

    getDisplayText(): string {
        return BIRTHDAY_TRACKER_YEAR_OVERVIEW_VIEW_TYPE;
    }

    async onOpen() {
        const { contentEl } = this;
        contentEl.createEl('h1', {text: 'Birthday Tracker - Year Overview'});
        const container = contentEl.createDiv({cls: 'yearContainer'});
        for (let i = 0; i < 12; i++) {
            const month = container.createDiv({cls:"monthContainer"});
            month.createEl("h4", {text:MONTHS[i], cls:"monthName"})
            const personContainer = month.createDiv({cls:"personsYearViewContainer"})
        }
    }

    async updatePersons(persons: PersonDTO[]) {
        this.persons = persons;
        const { contentEl } = this;
        contentEl.empty();
        await this.onOpen();
    }
}