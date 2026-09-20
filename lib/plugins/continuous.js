"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.continuous = void 0;
const isDigitPart = (part) => part.type === 'integer' || part.type === 'fraction';
const digitPartsOf = (data) => [...data.integer, ...data.fraction].filter(isDigitPart);
const isSamePart = (a, b) => a.pos === b.pos && a.value === b.value;
const maxNullable = (a, b) => {
    if (a == null)
        return b;
    if (b == null)
        return a;
    return Math.max(a, b);
};
/**
 * Makes transitions appear to pass through the numbers in between, e.g. 19 -> 21
 * spins the ones digit a full revolution instead of the shortest path.
 */
exports.continuous = {
    onUpdate(data, prev, { trend }) {
        if (!trend)
            return { startingPos: undefined };
        // Use the digit parts rather than the raw value so compact notation
        // (value 1000, digit "1") behaves sensibly.
        const prevDigits = digitPartsOf(prev);
        const nextDigits = digitPartsOf(data);
        const firstChangedPrev = prevDigits.find((pp) => !nextDigits.some((p) => isSamePart(p, pp)));
        const firstChanged = nextDigits.find((p) => !prevDigits.some((pp) => isSamePart(p, pp)));
        return { startingPos: maxNullable(firstChangedPrev?.pos, firstChanged?.pos) };
    },
    getDelta(value, prev, digit, { trend, state }) {
        const diff = value - prev;
        const starting = state?.startingPos;
        if (!diff && starting != null && starting >= digit.pos) {
            return digit.length * trend;
        }
        return undefined;
    },
};
//# sourceMappingURL=continuous.js.map