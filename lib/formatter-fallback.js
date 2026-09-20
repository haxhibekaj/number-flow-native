"use strict";
/**
 * Minimal replacement for `Intl.NumberFormat.prototype.formatToParts` for
 * engines that only implement `format()`. Classifies runs of characters by
 * whether they are digits, and uses the numeric value to decide which
 * separator is the decimal point.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatToPartsFallback = formatToPartsFallback;
const DIGIT = /[0-9]/;
const MINUS_SIGNS = new Set(['-', '−']);
const PLUS_SIGNS = new Set(['+']);
const splitIntoRuns = (formatted) => Array.from(formatted).reduce((runs, char) => {
    const isDigit = DIGIT.test(char);
    const last = runs[runs.length - 1];
    if (last && last.isDigit === isDigit) {
        return [...runs.slice(0, -1), { isDigit, text: last.text + char }];
    }
    return [...runs, { isDigit, text: char }];
}, []);
const findDecimalIndex = (runs, value) => {
    const digitIndexes = runs.flatMap((run, i) => (run.isDigit ? [i] : []));
    const lastDigitIndex = digitIndexes[digitIndexes.length - 1];
    const hasFraction = !Number.isInteger(value);
    if (!hasFraction || digitIndexes.length < 2 || lastDigitIndex === undefined)
        return -1;
    return lastDigitIndex - 1;
};
const classifySymbol = (runs, index, decimalIndex) => {
    const run = runs[index];
    const isBetweenDigits = Boolean(runs[index - 1]?.isDigit && runs[index + 1]?.isDigit);
    if (index === decimalIndex)
        return 'decimal';
    if (isBetweenDigits)
        return 'group';
    const precedesDigit = Boolean(runs[index + 1]?.isDigit);
    if (precedesDigit && MINUS_SIGNS.has(run.text))
        return 'minusSign';
    if (precedesDigit && PLUS_SIGNS.has(run.text))
        return 'plusSign';
    return 'literal';
};
function formatToPartsFallback(formatted, value) {
    const runs = splitIntoRuns(formatted);
    const decimalIndex = findDecimalIndex(runs, value);
    return runs.map((run, index) => {
        if (run.isDigit) {
            const isFraction = decimalIndex >= 0 && index > decimalIndex;
            return { type: isFraction ? 'fraction' : 'integer', value: run.text };
        }
        return { type: classifySymbol(runs, index, decimalIndex), value: run.text };
    });
}
//# sourceMappingURL=formatter-fallback.js.map