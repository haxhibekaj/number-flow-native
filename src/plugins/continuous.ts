import type { Data, KeyedDigitPart, KeyedNumberPart, Plugin } from '../types';

export type ContinuousState = { startingPos: number | undefined };

const isDigitPart = (part: KeyedNumberPart): part is KeyedDigitPart =>
  part.type === 'integer' || part.type === 'fraction';

const digitPartsOf = (data: Data): KeyedDigitPart[] =>
  [...data.integer, ...data.fraction].filter(isDigitPart);

const isSamePart = (a: KeyedDigitPart, b: KeyedDigitPart) => a.pos === b.pos && a.value === b.value;

const maxNullable = (a?: number, b?: number): number | undefined => {
  if (a == null) return b;
  if (b == null) return a;
  return Math.max(a, b);
};

/**
 * Makes transitions appear to pass through the numbers in between, e.g. 19 -> 21
 * spins the ones digit a full revolution instead of the shortest path.
 */
export const continuous = {
  onUpdate(data: Data, prev: Data, { trend }: { trend: number }): ContinuousState {
    if (!trend) return { startingPos: undefined };

    // Use the digit parts rather than the raw value so compact notation
    // (value 1000, digit "1") behaves sensibly.
    const prevDigits = digitPartsOf(prev);
    const nextDigits = digitPartsOf(data);
    const firstChangedPrev = prevDigits.find((pp) => !nextDigits.some((p) => isSamePart(p, pp)));
    const firstChanged = nextDigits.find((p) => !prevDigits.some((pp) => isSamePart(p, pp)));

    return { startingPos: maxNullable(firstChangedPrev?.pos, firstChanged?.pos) };
  },

  getDelta(
    value: number,
    prev: number,
    digit: { pos: number; length: number },
    { trend, state }: { trend: number; state: ContinuousState }
  ): number | undefined {
    const diff = value - prev;
    const starting = state?.startingPos;
    if (!diff && starting != null && starting >= digit.pos) {
      return digit.length * trend;
    }
    return undefined;
  },
} satisfies Plugin<ContinuousState>;
