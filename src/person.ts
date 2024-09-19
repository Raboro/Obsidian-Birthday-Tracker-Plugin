import type Birthday from './birthday';

export default class Person {
  private name: string;
  private birthday: Birthday;

  constructor(name: string, birthday: Birthday) {
    this.name = name;
    this.birthday = birthday;
  }

  compareTo(other: Person): number {
    return this.birthday.compareTo(other.birthday);
  }

  hasBirthdayToday(): boolean {
    return this.birthday.hasBirthdayToday();
  }

  toDTO(): PersonDTO {
    return new PersonDTO(
      this.name,
      this.birthday.toString(),
      this.birthday.getDaysTillNextBirthday(),
      this.birthday.getAge(),
      this.birthday.getMonth(),
    );
  }
}

export class PersonDTO {
  constructor(
    readonly name: string,
    readonly birthday: string,
    readonly daysTillNextBirthday: number,
    readonly age: number,
    readonly month: number,
  ) {}
}
