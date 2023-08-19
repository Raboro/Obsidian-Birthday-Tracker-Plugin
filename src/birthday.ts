export default class Birthday {
	private str: string;
    private date: Date;
    private nextBirthday: number;

	constructor(str: string, dateFormatting: string) {
		this.str = str;
        this.convertStringToDate(dateFormatting);
        this.nextBirthday = this.daysTillBirthday();
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

    daysTillBirthday(): number {
        const days = this.calcDays(new Date().getFullYear());
        if (days === -0) {
            return 0;
        }
        return days > 0 ? days : this.calcDays(new Date().getFullYear() + 1);
    }

    private calcDays(newYear: number): number {
        const dateCurrentYear: Date = new Date(this.date);
        dateCurrentYear.setFullYear(newYear);
        const timeDifference = new Date().getTime() - dateCurrentYear.getTime();
        return -Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    }

    compareTo(other: Birthday): number {
        return this.nextBirthday - other.nextBirthday;
    }

    toString(): string {
        return this.str;
    }
}