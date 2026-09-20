"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.DigitGlyph = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_native_reanimated_1 = __importStar(require("react-native-reanimated"));
const offset_1 = require("../offset");
const styles_1 = require("../styles");
/** One number in a digit column, translated vertically by its distance from the current position. */
exports.DigitGlyph = (0, react_1.memo)(function DigitGlyph({ n, length, position, height, isSizer, paddingVertical, baseTextStyle, textStyle, testID, }) {
    const animatedStyle = (0, react_native_reanimated_1.useAnimatedStyle)(() => {
        const offset = (0, offset_1.wrapOffset)(n, position.value, length);
        const clamped = Math.max(-1, Math.min(1, offset));
        return {
            opacity: Math.abs(offset) >= 1 ? 0 : 1,
            transform: [{ translateY: clamped * height.value }],
        };
    });
    return ((0, jsx_runtime_1.jsx)(react_native_reanimated_1.default.Text, { testID: testID, style: [
            styles_1.styles.text,
            isSizer ? null : styles_1.styles.stackedGlyph,
            baseTextStyle,
            textStyle,
            { paddingVertical },
            animatedStyle,
        ], children: n }));
});
//# sourceMappingURL=DigitGlyph.js.map