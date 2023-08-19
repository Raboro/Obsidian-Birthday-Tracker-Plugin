export default class Birthday {
	private str: string
    private date: Date

	constructor(str: string, dateFormatting: string) {
		this.str = str
        this.convertStringToDate(dateFormatting);
	}

    private convertStringToDate(dateFormatting: string) {
        const dayIndex = dateFormatting.search("DD");
        const monthIndex = dateFormatting.search("MM");
        const yearIndex = dateFormatting.search("YYYY");
        this.date = new Date();
        this.date.setDate(this.dateNumber(dayIndex, dayIndex+2));
        this.date.setMonth(this.dateNumber(monthIndex, monthIndex+2, 1)); // month has one offset
        this.date.setFullYear(this.dateNumber(yearIndex, yearIndex+4));
    }

    private dateNumber(start: number, end: number, offset?: number): number {
        return parseInt(this.str.substring(start, end)) - (offset ?? 0)
    }

    compareTo(other: Birthday): number {
        return this.date.getTime() - other.date.getTime();
    }

    toString(): string {
        return this.str;
    }
}