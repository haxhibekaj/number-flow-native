"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDigitDelta = getDigitDelta;
/**
 * How many slots a digit column should spin to reach `value` from `prev`,
 * wrapping around the column when the trend disagrees with the raw direction.
 */
function getDigitDelta({ value, prev, trend, length }) {
    const diff = value - prev;
    const direction = trend || Math.sign(diff);
    if (direction < 0 && value > prev)
        return value - length - prev;
    if (direction > 0 && value < prev)
        return length - prev + value;
    return diff;
}
//# sourceMappingURL=delta.js.map