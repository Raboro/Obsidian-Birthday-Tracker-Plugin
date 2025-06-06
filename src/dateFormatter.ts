export interface DateFormatter {
  readonly format: string;
  parseToDate(dateAsString: string): Date;
}

interface DateComponentRange {
  start: number;
  end: number;
}

export class DefaultDateFormatter implements DateFormatter {
  private static readonly DAY_IDENTIFIER = 'DD';
  private static readonly MONTH_IDENTIFIER = 'MM';
  private static readonly YEAR_IDENTIFIER = 'YYYY';

  private readonly dayIndex: number;
  private readonly monthIndex: number;
  private readonly yearIndex: number;
  readonly format: string;

  constructor(format: string) {
    this.format = format;
    this.dayIndex = format.search(DefaultDateFormatter.DAY_IDENTIFIER);
    this.monthIndex = format.search(DefaultDateFormatter.MONTH_IDENTIFIER);
    this.yearIndex = format.search(DefaultDateFormatter.YEAR_IDENTIFIER);
  }

  parseToDate(dateAsString: string): Date {
    const date = new Date();
    const year = this.extractComponentOfDate(dateAsString, {
      start: this.yearIndex,
      end: this.yearIndex + DefaultDateFormatter.YEAR_IDENTIFIER.length,
    });
    const month = this.extractComponentOfDate(dateAsString, {
      start: this.monthIndex,
      end: this.monthIndex + DefaultDateFormatter.MONTH_IDENTIFIER.length,
    });
    const day = this.extractComponentOfDate(dateAsString, {
      start: this.dayIndex,
      end: this.dayIndex + DefaultDateFormatter.DAY_IDENTIFIER.length,
    });
    date.setFullYear(year, month, day);
    return date;
  }

  private extractComponentOfDate(
    dateAsString: string,
    range: DateComponentRange,
  ): number {
    return Number.parseInt(dateAsString.substring(range.start, range.end));
  }
}
