import Birthday from './birthday';

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

	toDTO(): Readonly<PersonDTO> {
		return new PersonDTO(this.name, this.birthday.toString(), this.birthday.getNextBirthdayInDays(), 
							 this.birthday.getAge());
	}
}

export class PersonDTO {
	name: string;
	birthday: string;
	nextBirthdayInDays: number;
	age: number;

	constructor(name: string, birthday: string, nextBirthdayInDays: number, age: number) {
		this.name = name;
		this.birthday = birthday;
		this.nextBirthdayInDays = nextBirthdayInDays;
		this.age = age;
	}
}