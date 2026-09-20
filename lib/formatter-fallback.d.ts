/**
 * Minimal replacement for `Intl.NumberFormat.prototype.formatToParts` for
 * engines that only implement `format()`. Classifies runs of characters by
 * whether they are digits, and uses the numeric value to decide which
 * separator is the decimal point.
 */
type FallbackPartType = 'integer' | 'fraction' | 'group' | 'decimal' | 'minusSign' | 'plusSign' | 'literal';
export type FallbackPart = {
    type: FallbackPartType;
    value: string;
};
export declare function formatToPartsFallback(formatted: string, value: number): FallbackPart[];
export {};
//# sourceMappingURL=formatter-fallback.d.ts.map