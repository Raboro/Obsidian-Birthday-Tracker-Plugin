import type { DateFormatter } from './dateFormatter';

export default class Birthday {
  private readonly birthdayAsString: string;
  private readonly age: number;
  private readonly daysTillNextBirthday: number;
  private readonly date: Date;

  constructor(birthdayAsString: string, dateFormatter: DateFormatter) {
    this.birthdayAsString = birthdayAsString;
    this.date = dateFormatter.parseToDate(birthdayAsString);
    this.age = this.determineAge();
    this.daysTillNextBirthday = this.calcDaysTillNextBirthday();
  }

  private determineAge(): number {
    let age = new Date().getFullYear() - this.date.getFullYear();
    return this.hadBirthdayThisYear() ? age : --age;
  }

  private hadBirthdayThisYear(): boolean {
    const monthPassed = new Date().getMonth() > this.date.getMonth();
    const daysPassed =
      new Date().getMonth() === this.date.getMonth() &&
      new Date().getDate() >= this.date.getDate(); //getDay returns Day of the week, getDate the Day number
    return monthPassed || daysPassed;
  }

  private calcDaysTillNextBirthday(): number {
    const days = this.calcDays(new Date().getFullYear());
    if (-days === 0) {
      return 0;
    }
    return days > 0 ? days : this.calcDays(new Date().getFullYear() + 1);
  }

  private calcDays(newYear: number): number {
    const dateCurrentYear: Date = new Date(this.date);
    dateCurrentYear.setFullYear(newYear);
    const timeDifference = Date.now() - dateCurrentYear.getTime();
    return -Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
  }

  compareTo(other: Birthday): number {
    return this.daysTillNextBirthday - other.daysTillNextBirthday;
  }

  hasBirthdayToday(): boolean {
    return this.daysTillNextBirthday === 0;
  }

  getAge(): number {
    return this.age;
  }

  getDaysTillNextBirthday(): number {
    return this.daysTillNextBirthday;
  }

  getMonth(): number {
    return this.date.getMonth();
  }

  toString(): string {
    return this.birthdayAsString;
  }
}
