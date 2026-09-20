"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getColumnLength = getColumnLength;
const DEFAULT_MAX_DIGIT = 9;
/** Number of glyphs in the column for a digit position, honoring `digits[pos].max`. */
function getColumnLength(digits, pos) {
    const max = digits?.[pos]?.max;
    if (max === undefined)
        return DEFAULT_MAX_DIGIT + 1;
    if (!Number.isInteger(max) || max < 1 || max > DEFAULT_MAX_DIGIT) {
        throw new RangeError(`digits[${pos}].max must be an integer from 1 to 9, received ${String(max)}`);
    }
    return max + 1;
}
//# sourceMappingURL=digits.js.map