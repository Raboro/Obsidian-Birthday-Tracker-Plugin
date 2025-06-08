import { DefaultDateFormatter } from 'src/dateFormatter';
import { describe, expect, test } from 'bun:test';
import Birthday from 'src/birthday';
import Person from 'src/person';

describe('Person', () => {
  test('creation of person with birthday today should have birthday today', () => {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth();
    const year = today.getFullYear();
    const todayAsString = `${(day < 10 ? '0' : '') + day}/${(month < 10 ? '0' : '') + month}/${year}`;
    // biome-ignore lint/style/noNonNullAssertion: is valid
    const formatter = DefaultDateFormatter.createFormat('DD/MM/YYYY')!;
    const birthday = new Birthday(todayAsString, formatter);
    const person = new Person('selina', birthday);
    expect(person.hasBirthdayToday()).toBeTrue();
  });
});
