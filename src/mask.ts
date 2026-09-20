import { StyleSheet } from 'react-native';
import type { StyleProp, TextStyle } from 'react-native';

/** React Native's default font size, used when the caller sets none. */
const DEFAULT_FONT_SIZE = 14;

// Web NumberFlow defaults: --number-flow-mask-height: 0.25em, --number-flow-mask-width: 0.5em.
const MASK_HEIGHT_EM = 0.25;
const MASK_WIDTH_EM = 0.5;

export type MaskGeometry = {
  /** Height of the fade band above and below the digits. */
  maskHeight: number;
  /** Half of `maskHeight`, applied as padding in two places so they sum to `maskHeight`. */
  halfMaskHeight: number;
  /** Width of the fade band at the left and right edges. */
  maskWidth: number;
};

export function getFontSize(style: StyleProp<TextStyle>): number {
  return StyleSheet.flatten(style)?.fontSize ?? DEFAULT_FONT_SIZE;
}

/**
 * Mask band sizes in density-independent pixels. The web version rounds the
 * half-height to whole pixels to keep glyph baselines aligned; we do the same.
 */
export function resolveMask(
  fontSize: number,
  maskHeightProp?: number,
  maskWidthProp?: number
): MaskGeometry {
  const requestedHeight = maskHeightProp ?? fontSize * MASK_HEIGHT_EM;
  const halfMaskHeight = Math.round(Math.max(0, requestedHeight) / 2);
  return {
    halfMaskHeight,
    maskHeight: halfMaskHeight * 2,
    maskWidth: Math.max(0, maskWidthProp ?? fontSize * MASK_WIDTH_EM),
  };
}
