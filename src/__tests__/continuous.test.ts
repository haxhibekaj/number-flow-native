import { continuous } from '../plugins/continuous';
import { formatToData } from '../formatter';

const en = new Intl.NumberFormat('en-US');

describe('continuous plugin', () => {
  test('stores the highest changed digit position on update', () => {
    const prev = formatToData(120, en);
    const next = formatToData(130, en);

    const state = continuous.onUpdate(next, prev, { trend: 1 });

    expect(state).toEqual({ startingPos: 1 });
  });

  test('stores undefined when there is no trend', () => {
    const prev = formatToData(120, en);
    const next = formatToData(130, en);

    expect(continuous.onUpdate(next, prev, { trend: 0 })).toEqual({ startingPos: undefined });
  });

  test('spins an unchanged lower digit one full revolution in the trend direction', () => {
    const digit = { pos: 0, length: 10 };

    expect(continuous.getDelta(0, 0, digit, { trend: 1, state: { startingPos: 1 } })).toBe(10);
    expect(continuous.getDelta(0, 0, digit, { trend: -1, state: { startingPos: 1 } })).toBe(-10);
  });

  test('leaves changed digits and higher digits to the default delta', () => {
    expect(
      continuous.getDelta(3, 2, { pos: 0, length: 10 }, { trend: 1, state: { startingPos: 1 } })
    ).toBeUndefined();
    expect(
      continuous.getDelta(1, 1, { pos: 2, length: 10 }, { trend: 1, state: { startingPos: 1 } })
    ).toBeUndefined();
  });

  test('uses the digit parts rather than the raw value for compact notation', () => {
    const compact = new Intl.NumberFormat('en-US', { notation: 'compact' });
    const prev = formatToData(1000, compact); // "1K"
    const next = formatToData(2000, compact); // "2K"

    expect(continuous.onUpdate(next, prev, { trend: 1 })).toEqual({ startingPos: 0 });
  });
});
