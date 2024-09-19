import { describe, expect, test } from 'bun:test';
import Birthday from 'src/birthday';

describe('Birthday', () => {
  test('toString() should be same as parsed str', () => {
    const dateAsString = '20/08/2000';
    const birthday = new Birthday('20/08/2000', 'DD/MM/YYYY');
    expect(birthday.toString()).toEqual(dateAsString);
  });
});
