import { formatToData } from '../formatter';

const en = new Intl.NumberFormat('en-US');

describe('formatToData', () => {
  test('splits integer digits and keys them right-to-left with pos', () => {
    const data = formatToData(123, en);

    expect(data.integer).toEqual([
      { type: 'integer', value: 1, key: 'integer:2', pos: 2 },
      { type: 'integer', value: 2, key: 'integer:1', pos: 1 },
      { type: 'integer', value: 3, key: 'integer:0', pos: 0 },
    ]);
    expect(data.pre).toEqual([]);
    expect(data.fraction).toEqual([]);
    expect(data.post).toEqual([]);
    expect(data.valueAsString).toBe('123');
    expect(data.value).toBe(123);
  });

  test('keeps the ones digit key stable when a leading digit is added', () => {
    const before = formatToData(99, en);
    const after = formatToData(100, en);

    expect(before.integer.at(-1)?.key).toBe('integer:0');
    expect(after.integer.at(-1)?.key).toBe('integer:0');
    expect(after.integer[0]?.key).toBe('integer:2');
  });

  test('keys group separators from the right too', () => {
    const data = formatToData(1234567, en);

    const groups = data.integer.filter((p) => p.type === 'group');
    expect(groups.map((g) => g.key)).toEqual(['group:1', 'group:0']);
    expect(data.valueAsString).toBe('1,234,567');
  });

  test('puts decimal and fraction digits in fraction with negative pos', () => {
    const data = formatToData(3.25, en);

    expect(data.fraction).toEqual([
      { type: 'decimal', value: '.', key: 'decimal:0' },
      { type: 'fraction', value: 2, key: 'fraction:0', pos: -1 },
      { type: 'fraction', value: 5, key: 'fraction:1', pos: -2 },
    ]);
  });

  test('merges minusSign and plusSign into sign in pre', () => {
    const minus = formatToData(-5, en);
    const plus = formatToData(5, new Intl.NumberFormat('en-US', { signDisplay: 'always' }));

    expect(minus.pre).toEqual([{ type: 'sign', value: '-', key: 'sign:0' }]);
    expect(plus.pre).toEqual([{ type: 'sign', value: '+', key: 'sign:0' }]);
  });

  test('adds prefix before everything and suffix after everything', () => {
    const data = formatToData(7, en, '~', '/mo');

    expect(data.pre[0]).toEqual({ type: 'prefix', value: '~', key: 'prefix:0' });
    expect(data.post.at(-1)).toEqual({ type: 'suffix', value: '/mo', key: 'suffix:0' });
    expect(data.valueAsString).toBe('~7/mo');
  });

  test('puts currency symbols before the number in pre and units after in post', () => {
    const usd = formatToData(12, new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }));
    const pct = formatToData(0.5, new Intl.NumberFormat('en-US', { style: 'percent' }));

    expect(usd.pre).toEqual([{ type: 'currency', value: '$', key: 'currency:0' }]);
    expect(pct.post).toEqual([{ type: 'percentSign', value: '%', key: 'percentSign:0' }]);
  });

  test('handles compact notation with a trailing compact symbol', () => {
    const data = formatToData(1500, new Intl.NumberFormat('en-US', { notation: 'compact' }));

    expect(data.valueAsString).toBe('1.5K');
    expect(data.post).toEqual([{ type: 'compact', value: 'K', key: 'compact:0' }]);
  });

  test('accepts numeric strings and preserves them for formatting', () => {
    const data = formatToData('42', en);

    expect(data.value).toBe(42);
    expect(data.valueAsString).toBe('42');
  });

  test('throws a TypeError for non-numeric input', () => {
    expect(() => formatToData('abc', en)).toThrow(TypeError);
    expect(() => formatToData(Number.NaN, en)).toThrow(TypeError);
    expect(() => formatToData(Number.POSITIVE_INFINITY, en)).toThrow(TypeError);
  });

  test('does not mutate the parts returned by the formatter', () => {
    const parts = en.formatToParts(1);
    const spy = jest.spyOn(en, 'formatToParts').mockReturnValue(parts);
    const snapshot = JSON.stringify(parts);

    formatToData(1, en, 'pre', 'post');

    expect(JSON.stringify(parts)).toBe(snapshot);
    spy.mockRestore();
  });
});
