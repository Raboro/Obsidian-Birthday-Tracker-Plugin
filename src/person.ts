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

	toDTO(): PersonDTO {
		return new PersonDTO(
			this.name, 
			this.birthday.toString(), 
			this.birthday.getNextBirthdayInDays(), 
			this.birthday.getAge()
		);
	}
}

export class PersonDTO {
	constructor(
		readonly name: string, 
		readonly birthday: string, 
		readonly nextBirthdayInDays: number,  
		readonly age: number) {}
}