import { formatToPartsFallback } from './formatter-fallback';
import type {
  Data,
  KeyedDigitPart,
  KeyedNumberPart,
  KeyedSymbolPart,
  NumberPartType,
  Value,
} from './types';

type RawPartType = Intl.NumberFormatPartTypes | 'prefix' | 'suffix';
type RawPart = { type: RawPartType; value: string };

type UnkeyedIntegerPart =
  | { type: 'integer'; value: number }
  | { type: KeyedSymbolPart['type']; value: string };

const normalizeType = (type: RawPartType): NumberPartType =>
  type === 'minusSign' || type === 'plusSign' ? 'sign' : type;

export function parseValue(value: Value): number {
  const numeric = typeof value === 'string' ? Number(value.trim() === '' ? NaN : value) : value;
  if (typeof numeric !== 'number' || !Number.isFinite(numeric)) {
    throw new TypeError(
      `NumberFlow value must be a finite number or numeric string, received ${JSON.stringify(value)}`
    );
  }
  return numeric;
}

const getRawParts = (formatter: Intl.NumberFormat, value: Value, numeric: number): RawPart[] => {
  if (typeof formatter.formatToParts === 'function') {
    return formatter.formatToParts(value as number);
  }
  return formatToPartsFallback(formatter.format(value as number), numeric);
};

const withAffixes = (parts: RawPart[], prefix?: string, suffix?: string): RawPart[] => [
  ...(prefix ? [{ type: 'prefix' as const, value: prefix }] : []),
  ...parts,
  ...(suffix ? [{ type: 'suffix' as const, value: suffix }] : []),
];

/** Returns a function that hands out the next 0-based index for a part type. */
const createIndexer = () => {
  const counts = new Map<NumberPartType, number>();
  return (type: NumberPartType): number => {
    const next = counts.get(type) ?? 0;
    counts.set(type, next + 1);
    return next;
  };
};

const splitDigits = (text: string): UnkeyedIntegerPart[] =>
  Array.from(text).map((char) => {
    const digit = Number(char);
    return Number.isInteger(digit) && char.trim() !== ''
      ? { type: 'integer' as const, value: digit }
      : { type: 'literal' as const, value: char };
  });

/** Integer digits are keyed right-to-left so the ones digit stays stable as digits are added. */
const keyIntegerRtl = (
  parts: UnkeyedIntegerPart[],
  nextIndex: (type: NumberPartType) => number
): KeyedNumberPart[] =>
  parts
    .slice()
    .reverse()
    .map<KeyedNumberPart>((part) => {
      const index = nextIndex(part.type);
      const key = `${part.type}:${index}`;
      return part.type === 'integer'
        ? { type: 'integer', value: part.value, key, pos: index }
        : { type: part.type, value: part.value, key };
    })
    .reverse();

type Accumulator = {
  pre: KeyedNumberPart[];
  integer: UnkeyedIntegerPart[];
  fraction: KeyedNumberPart[];
  post: KeyedNumberPart[];
  seenNumber: boolean;
};

const EMPTY: Accumulator = { pre: [], integer: [], fraction: [], post: [], seenNumber: false };

const fractionDigits = (
  text: string,
  nextIndex: (type: NumberPartType) => number
): KeyedDigitPart[] =>
  Array.from(text).map((char) => {
    const index = nextIndex('fraction');
    return { type: 'fraction', value: Number(char), key: `fraction:${index}`, pos: -1 - index };
  });

export function formatToData(
  value: Value,
  formatter: Intl.NumberFormat,
  prefix?: string,
  suffix?: string
): Data {
  const numeric = parseValue(value);
  const parts = withAffixes(getRawParts(formatter, value, numeric), prefix, suffix);
  const nextIndex = createIndexer();

  const acc = parts.reduce<Accumulator>((state, part) => {
    const type = normalizeType(part.type);
    switch (type) {
      case 'integer':
        return { ...state, seenNumber: true, integer: [...state.integer, ...splitDigits(part.value)] };
      case 'group':
        return { ...state, integer: [...state.integer, { type, value: part.value }] };
      case 'decimal':
        return {
          ...state,
          seenNumber: true,
          fraction: [...state.fraction, { type, value: part.value, key: `decimal:${nextIndex(type)}` }],
        };
      case 'fraction':
        return { ...state, fraction: [...state.fraction, ...fractionDigits(part.value, nextIndex)] };
      default: {
        const symbol: KeyedSymbolPart = { type, value: part.value, key: `${type}:${nextIndex(type)}` };
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
