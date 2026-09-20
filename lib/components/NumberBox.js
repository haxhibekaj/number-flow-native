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
exports.NumberBox = NumberBox;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_reanimated_1 = __importStar(require("react-native-reanimated"));
const styles_1 = require("../styles");
/**
 * Sizes itself to its digits and animates width changes on the same curve the
 * digits spin on. Without this the box snaps the moment a digit is added or
 * removed while its contents are still sliding, which reads as a jump. The web
 * version animates the number's width for exactly this reason.
 *
 * The inner row uses `alignSelf: 'flex-start'` so it keeps its natural width
 * while the outer box is mid-animation; any overflow is hidden by the mask.
 */
function NumberBox({ timing, animated, paddingHorizontal, paddingVertical, children, }) {
    const width = (0, react_native_reanimated_1.useSharedValue)(0);
    const measured = (0, react_native_reanimated_1.useSharedValue)(false);
    const onLayout = (0, react_1.useCallback)((event) => {
        width.value = event.nativeEvent.layout.width;
        measured.value = true;
    }, [width, measured]);
    const boxStyle = (0, react_native_reanimated_1.useAnimatedStyle)(() => {
        // Before the first measurement, fall back to intrinsic sizing so there is
        // no zero-width frame on mount.
        if (!measured.value)
            return {};
        return { width: animated ? (0, react_native_reanimated_1.withTiming)(width.value, timing) : width.value };
    }, [animated, timing]);
    return ((0, jsx_runtime_1.jsx)(react_native_reanimated_1.default.View, { style: boxStyle, children: (0, jsx_runtime_1.jsx)(react_native_1.View, { style: [styles_1.styles.measuredRow, { paddingHorizontal, paddingVertical }], onLayout: onLayout, children: children }) }));
}
//# sourceMappingURL=NumberBox.js.map