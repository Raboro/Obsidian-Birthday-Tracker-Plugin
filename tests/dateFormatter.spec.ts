import { describe, expect, test } from 'bun:test';
import { DefaultDateFormatter } from 'src/DateFormatter';

describe('DateFormatter', () => {
  test('parseDate should parse default correctly', () => {
    const formatter = new DefaultDateFormatter('DD/MM/YYYY');
    const date = formatter.parseToDate('20/08/2000');
    expect(date.getDate()).toBe(20);
    expect(date.getMonth()).toBe(8);
    expect(date.getFullYear()).toBe(2000);
  });

  test('parseDate should parse with different format correctly', () => {
    const formatter = new DefaultDateFormatter('MM/DD/YYYY');
    const date = formatter.parseToDate('08/20/2000');
    expect(date.getDate()).toBe(20);
    expect(date.getMonth()).toBe(8);
    expect(date.getFullYear()).toBe(2000);
  });
});
