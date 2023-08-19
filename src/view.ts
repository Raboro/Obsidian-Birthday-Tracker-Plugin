import { ItemView } from "obsidian";

export const BIRTHDAY_TRACKER_VIEW_TYPE = "Birthday-Tracker";

export class BirthdayTrackerView extends ItemView {

    icon = "cake";

    getViewType(): string {
        return BIRTHDAY_TRACKER_VIEW_TYPE;
    }
    getDisplayText(): string {
        return BIRTHDAY_TRACKER_VIEW_TYPE;
    }
    
}