import type { Digits } from './types';

const DEFAULT_MAX_DIGIT = 9;

/** Number of glyphs in the column for a digit position, honoring `digits[pos].max`. */
export function getColumnLength(digits: Digits | undefined, pos: number): number {
  const max = digits?.[pos]?.max;
  if (max === undefined) return DEFAULT_MAX_DIGIT + 1;
  if (!Number.isInteger(max) || max < 1 || max > DEFAULT_MAX_DIGIT) {
    throw new RangeError(
      `digits[${pos}].max must be an integer from 1 to 9, received ${String(max)}`
    );
  }
  return max + 1;
}
