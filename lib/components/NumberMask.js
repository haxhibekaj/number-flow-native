"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NumberMask = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_native_1 = require("react-native");
const masked_view_1 = __importDefault(require("@react-native-masked-view/masked-view"));
const expo_linear_gradient_1 = require("expo-linear-gradient");
const styles_1 = require("../styles");
// Fully transparent black: only the alpha channel matters for a mask, and an
// explicit rgba avoids the premultiplied-color fringing 'transparent' can cause.
const CLEAR = 'rgba(0,0,0,0)';
const OPAQUE = 'rgb(0,0,0)';
const VERTICAL_FADE = [CLEAR, OPAQUE];
const VERTICAL_UNFADE = [OPAQUE, CLEAR];
const HORIZONTAL_START = { x: 0, y: 0.5 };
const HORIZONTAL_END = { x: 1, y: 0.5 };
/**
 * Opaque in the middle, fading to transparent over `size` at both ends. Built
 * from two fixed-size gradients around a solid centre so no measurement is
 * needed to place the gradient stops.
 */
function FadeBands({ size, horizontal }) {
    const band = horizontal ? { width: size } : { height: size };
    const gradientProps = horizontal ? { start: HORIZONTAL_START, end: HORIZONTAL_END } : {};
    return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { style: horizontal ? styles_1.styles.maskRow : styles_1.styles.maskColumn, children: [(0, jsx_runtime_1.jsx)(expo_linear_gradient_1.LinearGradient, { colors: VERTICAL_FADE, style: band, ...gradientProps }), (0, jsx_runtime_1.jsx)(react_native_1.View, { style: styles_1.styles.maskCore }), (0, jsx_runtime_1.jsx)(expo_linear_gradient_1.LinearGradient, { colors: VERTICAL_UNFADE, style: band, ...gradientProps })] }));
}
/**
 * Applies NumberFlow's edge fade to the digits. The horizontal and vertical
 * bands are nested so their alphas combine, which also softens the corners the
 * way the web version's radial corner gradients do.
 */
exports.NumberMask = (0, react_1.memo)(function NumberMask({ mask, children }) {
    return ((0, jsx_runtime_1.jsx)(masked_view_1.default, { style: { marginHorizontal: -mask.maskWidth }, maskElement: (0, jsx_runtime_1.jsx)(masked_view_1.default, { style: styles_1.styles.maskFill, maskElement: (0, jsx_runtime_1.jsx)(FadeBands, { size: mask.maskWidth, horizontal: true }), children: (0, jsx_runtime_1.jsx)(FadeBands, { size: mask.maskHeight, horizontal: false }) }), children: children }));
});
//# sourceMappingURL=NumberMask.js.map