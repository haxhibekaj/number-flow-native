import { formatToPartsFallback } from '../formatter-fallback';

describe('formatToPartsFallback', () => {
  test('classifies digits, group separators, decimal, and sign from a formatted string', () => {
    const parts = formatToPartsFallback('-1,234.56', 1234.56);

    expect(parts).toEqual([
      { type: 'minusSign', value: '-' },
      { type: 'integer', value: '1' },
      { type: 'group', value: ',' },
      { type: 'integer', value: '234' },
      { type: 'decimal', value: '.' },
      { type: 'fraction', value: '56' },
    ]);
  });

  test('treats unknown characters as literal', () => {
    const parts = formatToPartsFallback('$12/mo', 12);

    expect(parts).toEqual([
      { type: 'literal', value: '$' },
      { type: 'integer', value: '12' },
      { type: 'literal', value: '/mo' },
    ]);
  });
});
