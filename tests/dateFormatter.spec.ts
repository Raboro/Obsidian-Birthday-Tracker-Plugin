import { describe, expect, test } from 'bun:test';
import { DefaultDateFormatter } from 'src/dateFormatter';

describe('DateFormatter', () => {
  test('parseDate should parse default correctly', () => {
    // biome-ignore lint/style/noNonNullAssertion: is valid
    const formatter = DefaultDateFormatter.createFormat('DD/MM/YYYY')!;
    const date = formatter.parseToDate('20/08/2000');
    expect(date.getDate()).toBe(20);
    expect(date.getMonth()).toBe(8);
    expect(date.getFullYear()).toBe(2000);
  });

  test('parseDate should parse with different format correctly', () => {
    // biome-ignore lint/style/noNonNullAssertion: is valid
    const formatter = DefaultDateFormatter.createFormat('MM/DD/YYYY')!;
    const date = formatter.parseToDate('08/20/2000');
    expect(date.getDate()).toBe(20);
    expect(date.getMonth()).toBe(8);
    expect(date.getFullYear()).toBe(2000);
  });

  test('creation should create valid formatter', () => {
    expect(DefaultDateFormatter.createFormat('MM/DD/YYYY')).not.toBe(undefined);
    expect(DefaultDateFormatter.createFormat('DD/MM/YYYY')).not.toBe(undefined);
    expect(DefaultDateFormatter.createFormat('YYYY/MM/DD')).not.toBe(undefined);
    expect(DefaultDateFormatter.createFormat('YYYY/DD/MM')).not.toBe(undefined);
    expect(DefaultDateFormatter.createFormat('DD-MM-YYYY')).not.toBe(undefined);
  });

  test('creation should not create invalid formatter', () => {
    expect(DefaultDateFormatter.createFormat('MX/DD/YYYY')).toBeUndefined();
    expect(DefaultDateFormatter.createFormat('DL/MM/YYYY')).toBeUndefined();
    expect(DefaultDateFormatter.createFormat('YYY/MM/DD')).toBeUndefined();
    expect(DefaultDateFormatter.createFormat('Y1EY/DD/MM')).toBeUndefined();
    expect(DefaultDateFormatter.createFormat('D9-MM-YYYY')).toBeUndefined();
  });
});
