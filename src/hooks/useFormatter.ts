import { useMemo } from 'react';
import type { Format } from '../types';

// Intl.NumberFormat instances are expensive to build, so they are cached by
// their serialized options, exactly as the web version does.
const formatterCache = new Map<string, Intl.NumberFormat>();

const getCachedFormatter = (
  key: string,
  locales?: Intl.LocalesArgument,
  format?: Format
): Intl.NumberFormat => {
  const cached = formatterCache.get(key);
  if (cached) return cached;
  const created = new Intl.NumberFormat(locales, format);
  formatterCache.set(key, created);
  return created;
};

export function useFormatter(locales?: Intl.LocalesArgument, format?: Format): Intl.NumberFormat {
  const key = JSON.stringify([locales ?? null, format ?? null]);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- key captures locales and format
  return useMemo(() => getCachedFormatter(key, locales, format), [key]);
}
