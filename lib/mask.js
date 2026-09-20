"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFontSize = getFontSize;
exports.resolveMask = resolveMask;
const react_native_1 = require("react-native");
/** React Native's default font size, used when the caller sets none. */
const DEFAULT_FONT_SIZE = 14;
// Web NumberFlow defaults: --number-flow-mask-height: 0.25em, --number-flow-mask-width: 0.5em.
const MASK_HEIGHT_EM = 0.25;
const MASK_WIDTH_EM = 0.5;
function getFontSize(style) {
    return react_native_1.StyleSheet.flatten(style)?.fontSize ?? DEFAULT_FONT_SIZE;
}
/**
 * Mask band sizes in density-independent pixels. The web version rounds the
 * half-height to whole pixels to keep glyph baselines aligned; we do the same.
 */
function resolveMask(fontSize, maskHeightProp, maskWidthProp) {
    const requestedHeight = maskHeightProp ?? fontSize * MASK_HEIGHT_EM;
    const halfMaskHeight = Math.round(Math.max(0, requestedHeight) / 2);
    return {
        halfMaskHeight,
        maskHeight: halfMaskHeight * 2,
        maskWidth: Math.max(0, maskWidthProp ?? fontSize * MASK_WIDTH_EM),
    };
}
//# sourceMappingURL=mask.js.map