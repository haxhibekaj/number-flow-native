import { wrapOffset } from '../offset';

describe('wrapOffset', () => {
  test('is 0 for the glyph matching the current position', () => {
    expect(wrapOffset(3, 3, 10)).toBe(0);
  });

  test('places the next glyph one slot below and the previous one slot above', () => {
    expect(wrapOffset(4, 3, 10)).toBe(1);
    expect(wrapOffset(2, 3, 10)).toBe(-1);
  });

  test('wraps so 0 sits directly below 9', () => {
    expect(wrapOffset(0, 9, 10)).toBe(1);
    expect(wrapOffset(9, 0, 10)).toBe(-1);
  });

  test('stays within [-length/2, length/2)', () => {
    for (let n = 0; n < 10; n++) {
      for (let c = 0; c < 10; c += 0.5) {
        const o = wrapOffset(n, c, 10);
        expect(o).toBeGreaterThanOrEqual(-5);
        expect(o).toBeLessThan(5);
      }
    }
  });

  test('interpolates for fractional positions mid-spin', () => {
    expect(wrapOffset(4, 3.5, 10)).toBeCloseTo(0.5);
    expect(wrapOffset(3, 3.5, 10)).toBeCloseTo(-0.5);
  });

  test('handles positions beyond one revolution', () => {
    expect(wrapOffset(3, 23, 10)).toBe(0);
    expect(wrapOffset(3, -7, 10)).toBe(0);
  });
});
