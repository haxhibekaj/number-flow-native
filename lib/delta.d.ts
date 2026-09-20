export type DigitDeltaInput = {
    value: number;
    prev: number;
    /** Overall trend: positive spins up, negative spins down, 0 lets each digit pick. */
    trend: number;
    /** Number of glyphs in the column (max digit + 1). */
    length: number;
};
/**
 * How many slots a digit column should spin to reach `value` from `prev`,
 * wrapping around the column when the trend disagrees with the raw direction.
 */
export declare function getDigitDelta({ value, prev, trend, length }: DigitDeltaInput): number;
//# sourceMappingURL=delta.d.ts.map