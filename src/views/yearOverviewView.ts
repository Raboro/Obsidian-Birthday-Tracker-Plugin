import { ItemView } from "obsidian";

export const BIRTHDAY_TRACKER_YEAR_OVERVIEW_VIEW_TYPE = "Birthday-Tracker-Year-Overview";

export class YearOverviewView extends ItemView {
    icon = "calendar-days";

    getViewType(): string {
        return BIRTHDAY_TRACKER_YEAR_OVERVIEW_VIEW_TYPE;
    }

    getDisplayText(): string {
        return BIRTHDAY_TRACKER_YEAR_OVERVIEW_VIEW_TYPE;
    }

    async onOpen() {
        const { contentEl } = this;
        contentEl.createEl('h1', {text: 'Birthday Tracker - Year Overview'});
    }
}