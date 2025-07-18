export interface DateFormatter {
  readonly format: string;
  parseToDate(dateAsString: string): Date;
}

interface DateComponentRange {
  start: number;
  end: number;
  offset?: number;
}

export class DefaultDateFormatter implements DateFormatter {
  private static readonly DAY_IDENTIFIER = 'DD';
  private static readonly MONTH_IDENTIFIER = 'MM';
  private static readonly YEAR_IDENTIFIER = 'YYYY';

  private readonly dayIndex: number;
  private readonly monthIndex: number;
  private readonly yearIndex: number;
  readonly format: string;

  private constructor(format: string) {
    this.format = format;
    this.dayIndex = format.search(DefaultDateFormatter.DAY_IDENTIFIER);
    this.monthIndex = format.search(DefaultDateFormatter.MONTH_IDENTIFIER);
    this.yearIndex = format.search(DefaultDateFormatter.YEAR_IDENTIFIER);
  }

  static createFormat(format: string): DateFormatter | undefined {
    return DefaultDateFormatter.isValidFormat(format)
      ? new DefaultDateFormatter(format)
      : undefined;
  }

  private static isValidFormat(format: string): boolean {
    const containsDay = DefaultDateFormatter.formatContains(
      DefaultDateFormatter.DAY_IDENTIFIER,
      format,
    );
    const containsMonth = DefaultDateFormatter.formatContains(
      DefaultDateFormatter.MONTH_IDENTIFIER,
      format,
    );
    const containsYear = DefaultDateFormatter.formatContains(
      DefaultDateFormatter.YEAR_IDENTIFIER,
      format,
    );
    return (
      containsDay &&
      containsMonth &&
      containsYear &&
      !DefaultDateFormatter.containsInvalidChars(format)
    );
  }

  private static formatContains(subStr: string, format: string): boolean {
    return format.includes(subStr) || format.includes(subStr.toLowerCase());
  }

  private static containsInvalidChars(format: string): boolean {
    const invalidChars: string[] = [
      'A',
      'B',
      'C',
      'E',
      'F',
      'G',
      'H',
      'I',
      'J',
      'K',
      'L',
      'N',
      'O',
      'P',
      'Q',
      'R',
      'S',
      'T',
      'U',
      'V',
      'W',
      'X',
      'Z',
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
    ];
    for (const invalidChar in invalidChars) {
      if (DefaultDateFormatter.formatContains(invalidChar, format)) {
        return true;
      }
    }
    return false;
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
      offset: 1, // needed offset cause Date API returns wrong month of date => WHYYY???
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
    return (
      Number.parseInt(dateAsString.substring(range.start, range.end)) -
      (range.offset ?? 0)
    );
  }
}
