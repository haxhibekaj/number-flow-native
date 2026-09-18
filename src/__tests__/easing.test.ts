import { linearEasing, DEFAULT_TRANSFORM_TIMING, DEFAULT_OPACITY_TIMING } from '../easing';

describe('linearEasing', () => {
  test('returns the endpoints exactly', () => {
    const ease = linearEasing([0, 0.5, 1]);

    expect(ease(0)).toBe(0);
    expect(ease(1)).toBe(1);
  });

  test('interpolates linearly between evenly spaced points', () => {
    const ease = linearEasing([0, 0.8, 1]);

    expect(ease(0.25)).toBeCloseTo(0.4);
    expect(ease(0.5)).toBeCloseTo(0.8);
    expect(ease(0.75)).toBeCloseTo(0.9);
  });

  test('clamps out-of-range input', () => {
    const ease = linearEasing([0, 1]);

    expect(ease(-1)).toBe(0);
    expect(ease(2)).toBe(1);
  });

  test('throws when given fewer than two points', () => {
    expect(() => linearEasing([1])).toThrow(RangeError);
  });
});

describe('default timings', () => {
  test('match NumberFlow defaults', () => {
    expect(DEFAULT_TRANSFORM_TIMING.duration).toBe(900);
    expect(DEFAULT_OPACITY_TIMING.duration).toBe(450);
    expect(DEFAULT_TRANSFORM_TIMING.easing(0.5)).toBeGreaterThan(0.9);
  });
});
