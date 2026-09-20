import type { StyleProp, TextStyle } from 'react-native';
export type MaskGeometry = {
    /** Height of the fade band above and below the digits. */
    maskHeight: number;
    /** Half of `maskHeight`, applied as padding in two places so they sum to `maskHeight`. */
    halfMaskHeight: number;
    /** Width of the fade band at the left and right edges. */
    maskWidth: number;
};
export declare function getFontSize(style: StyleProp<TextStyle>): number;
/**
 * Mask band sizes in density-independent pixels. The web version rounds the
 * half-height to whole pixels to keep glyph baselines aligned; we do the same.
 */
export declare function resolveMask(fontSize: number, maskHeightProp?: number, maskWidthProp?: number): MaskGeometry;
//# sourceMappingURL=mask.d.ts.map