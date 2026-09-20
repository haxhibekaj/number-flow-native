"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseValue = parseValue;
exports.formatToData = formatToData;
const formatter_fallback_1 = require("./formatter-fallback");
const normalizeType = (type) => type === 'minusSign' || type === 'plusSign' ? 'sign' : type;
function parseValue(value) {
    const numeric = typeof value === 'string' ? Number(value.trim() === '' ? NaN : value) : value;
    if (typeof numeric !== 'number' || !Number.isFinite(numeric)) {
        throw new TypeError(`NumberFlow value must be a finite number or numeric string, received ${JSON.stringify(value)}`);
    }
    return numeric;
}
const getRawParts = (formatter, value, numeric) => {
    if (typeof formatter.formatToParts === 'function') {
        return formatter.formatToParts(value);
    }
    return (0, formatter_fallback_1.formatToPartsFallback)(formatter.format(value), numeric);
};
const withAffixes = (parts, prefix, suffix) => [
    ...(prefix ? [{ type: 'prefix', value: prefix }] : []),
    ...parts,
    ...(suffix ? [{ type: 'suffix', value: suffix }] : []),
];
/** Returns a function that hands out the next 0-based index for a part type. */
const createIndexer = () => {
    const counts = new Map();
    return (type) => {
        const next = counts.get(type) ?? 0;
        counts.set(type, next + 1);
        return next;
    };
};
const splitDigits = (text) => Array.from(text).map((char) => {
    const digit = Number(char);
    return Number.isInteger(digit) && char.trim() !== ''
        ? { type: 'integer', value: digit }
        : { type: 'literal', value: char };
});
/** Integer digits are keyed right-to-left so the ones digit stays stable as digits are added. */
const keyIntegerRtl = (parts, nextIndex) => parts
    .slice()
    .reverse()
    .map((part) => {
    const index = nextIndex(part.type);
    const key = `${part.type}:${index}`;
    return part.type === 'integer'
        ? { type: 'integer', value: part.value, key, pos: index }
        : { type: part.type, value: part.value, key };
})
    .reverse();
const EMPTY = { pre: [], integer: [], fraction: [], post: [], seenNumber: false };
const fractionDigits = (text, nextIndex) => Array.from(text).map((char) => {
    const index = nextIndex('fraction');
    return { type: 'fraction', value: Number(char), key: `fraction:${index}`, pos: -1 - index };
});
function formatToData(value, formatter, prefix, suffix) {
    const numeric = parseValue(value);
    const parts = withAffixes(getRawParts(formatter, value, numeric), prefix, suffix);
    const nextIndex = createIndexer();
    const acc = parts.reduce((state, part) => {
        const type = normalizeType(part.type);
        switch (type) {
            case 'integer':
                return {
                    ...state,
                    seenNumber: true,
                    integer: [...state.integer, ...splitDigits(part.value)],
                };
            case 'group':
                return { ...state, integer: [...state.integer, { type, value: part.value }] };
            case 'decimal':
                return {
                    ...state,
                    seenNumber: true,
                    fraction: [
                        ...state.fraction,
                        { type, value: part.value, key: `decimal:${nextIndex(type)}` },
                    ],
                };
            case 'fraction':
                return {
                    ...state,
                    fraction: [...state.fraction, ...fractionDigits(part.value, nextIndex)],
                };
            default: {
                const symbol = {
                    type,
                    value: part.value,
                    key: `${type}:${nextIndex(type)}`,
                };
                return state.seenNumber
                    ? { ...state, post: [...state.post, symbol] }
                    : { ...state, pre: [...state.pre, symbol] };
            }
        }
    }, EMPTY);
    return {
        pre: acc.pre,
        integer: keyIntegerRtl(acc.integer, nextIndex),
        fraction: acc.fraction,
        post: acc.post,
        valueAsString: parts.map((p) => p.value).join(''),
        value: numeric,
    };
}
//# sourceMappingURL=formatter.js.map