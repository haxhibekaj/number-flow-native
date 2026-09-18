/**
 * Slot a glyph `n` occupies relative to the current (possibly fractional) column
 * position, wrapped into [-length / 2, length / 2). 0 is the visible slot,
 * +1 is directly below, -1 directly above.
 */
export function wrapOffset(n: number, position: number, length: number): number {
  'worklet';
  const current = ((position % length) + length) % length;
  const raw = (((length + n - current) % length) + length) % length;
  return raw >= length / 2 ? raw - length : raw;
}
