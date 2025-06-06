import { describe, expect, test } from 'bun:test';
import Birthday from 'src/birthday';
import { DefaultDateFormatter } from 'src/DateFormatter';

describe('Birthday', () => {
  test('toString() should be same as parsed str', () => {
    const dateAsString = '20/08/2000';
    const birthday = new Birthday(
      '20/08/2000',
      // biome-ignore lint/style/noNonNullAssertion: is valid
      DefaultDateFormatter.createFormat('DD/MM/YYYY')!,
    );
    expect(birthday.toString()).toEqual(dateAsString);
  });
});
