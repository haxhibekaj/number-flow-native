import { getFontSize, resolveMask } from '../mask';

describe('getFontSize', () => {
  test("falls back to React Native's default when the style sets none", () => {
    expect(getFontSize(undefined)).toBe(14);
    expect(getFontSize({ color: 'red' })).toBe(14);
  });

  test('reads fontSize through nested style arrays', () => {
    expect(getFontSize([{ fontSize: 40 }, { fontWeight: '600' }])).toBe(40);
    expect(getFontSize([{ fontSize: 40 }, { fontSize: 12 }])).toBe(12);
  });
});

describe('resolveMask', () => {
  test('defaults to a quarter-em height and half-em width', () => {
    expect(resolveMask(40)).toEqual({ halfMaskHeight: 5, maskHeight: 10, maskWidth: 20 });
  });

  test('rounds the half height to whole points so glyphs stay aligned', () => {
    // 14 * 0.25 = 3.5 -> half 1.75 rounds to 2, so the full height is 4.
    expect(resolveMask(14)).toEqual({ halfMaskHeight: 2, maskHeight: 4, maskWidth: 7 });
  });

  test('honors explicit overrides', () => {
    expect(resolveMask(40, 20, 6)).toEqual({ halfMaskHeight: 10, maskHeight: 20, maskWidth: 6 });
  });

  test('allows zero to disable each fade', () => {
    expect(resolveMask(40, 0, 0)).toEqual({ halfMaskHeight: 0, maskHeight: 0, maskWidth: 0 });
  });

  test('clamps negative values to zero', () => {
    expect(resolveMask(40, -10, -10)).toEqual({ halfMaskHeight: 0, maskHeight: 0, maskWidth: 0 });
  });
});
