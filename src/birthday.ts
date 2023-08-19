export default class Birthday {
	private str: string;
    private date: Date;

	constructor(str: string, dateFormatting: string) {
		this.str = str;
        this.convertStringToDate(dateFormatting);
	}

    private convertStringToDate(dateFormatting: string) {
        this.date = this.constructDate(
            dateFormatting.search("DD"),
            dateFormatting.search("MM"),
            dateFormatting.search("YYYY")
        );
    }

    private constructDate(dayIndex: number, monthIndex: number, yearIndex: number): Date {
        const date = new Date();
        date.setFullYear(
            this.dateNumber(yearIndex, yearIndex+4), 
            this.dateNumber(monthIndex, monthIndex+2, 1), // month has one offset
            this.dateNumber(dayIndex, dayIndex+2)
        );
        return date;
    }

    private dateNumber(start: number, end: number, offset?: number): number {
        return parseInt(this.str.substring(start, end)) - (offset ?? 0);
    }

    compareTo(other: Birthday): number {
        return this.date.getTime() - other.date.getTime();
    }

    toString(): string {
        return this.str;
    }
}