import Birthday from "./birthday";

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
		return new PersonDTO(this.name, this.birthday.toString());
	}
}

export class PersonDTO {
	name: string;
	birthday: string;

	constructor(name: string, birthday: string) {
		this.name = name;
		this.birthday = birthday;
	}
}