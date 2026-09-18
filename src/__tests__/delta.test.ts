import { getDigitDelta } from '../delta';

const LENGTH = 10;

describe('getDigitDelta', () => {
  test('returns the plain difference when the trend agrees with the direction', () => {
    expect(getDigitDelta({ value: 7, prev: 3, trend: 1, length: LENGTH })).toBe(4);
    expect(getDigitDelta({ value: 3, prev: 7, trend: -1, length: LENGTH })).toBe(-4);
  });

  test('wraps around when trend is up but the digit decreased', () => {
    // 9 -> 2 going up must pass 0, 1: +3
    expect(getDigitDelta({ value: 2, prev: 9, trend: 1, length: LENGTH })).toBe(3);
  });

  test('wraps around when trend is down but the digit increased', () => {
    // 2 -> 9 going down must pass 1, 0: -3
    expect(getDigitDelta({ value: 9, prev: 2, trend: -1, length: LENGTH })).toBe(-3);
  });

  test('uses the per-digit direction when trend is 0', () => {
    expect(getDigitDelta({ value: 9, prev: 2, trend: 0, length: LENGTH })).toBe(7);
    expect(getDigitDelta({ value: 2, prev: 9, trend: 0, length: LENGTH })).toBe(-7);
  });

  test('returns 0 when nothing changed', () => {
    expect(getDigitDelta({ value: 4, prev: 4, trend: 1, length: LENGTH })).toBe(0);
  });

  test('respects a shorter column length such as a 0-5 tens digit', () => {
    // 5 -> 0 going up on a 6-slot column wraps by +1
    expect(getDigitDelta({ value: 0, prev: 5, trend: 1, length: 6 })).toBe(1);
  });
});
