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
exports.Digit = Digit;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_native_reanimated_1 = __importStar(require("react-native-reanimated"));
const context_1 = require("../context");
const delta_1 = require("../delta");
const digits_1 = require("../digits");
const styles_1 = require("../styles");
const DigitGlyph_1 = require("./DigitGlyph");
const resolveDelta = (flow, value, prev, digit) => {
    for (const [index, plugin] of flow.plugins.entries()) {
        const delta = plugin.getDelta?.(value, prev, digit, {
            trend: flow.trend,
            state: flow.pluginState[index],
        });
        if (delta != null)
            return delta;
    }
    return (0, delta_1.getDigitDelta)({ value, prev, trend: flow.trend, length: digit.length });
};
/** A single digit column that spins through its glyphs to reach each new value. */
function Digit({ part, testID }) {
    const flow = (0, context_1.useFlow)();
    const length = (0, digits_1.getColumnLength)(flow.digits, part.pos);
    // Digits added mid-flight start at 0 and spin up to their value, as on the web.
    const startsAtZero = flow.animateIn && flow.animated;
    const initial = startsAtZero ? 0 : part.value;
    const position = (0, react_native_reanimated_1.useSharedValue)(initial);
    const height = (0, react_native_reanimated_1.useSharedValue)(0);
    const state = (0, react_1.useRef)({ value: initial, target: initial, revision: flow.revision });
    (0, react_1.useEffect)(() => {
        const { value: prev, target, revision } = state.current;
        // Re-run once per value update, even for unchanged digits: plugins such as
        // `continuous` may still want to spin them.
        if (revision === flow.revision && prev === part.value)
            return;
        const delta = resolveDelta(flow, part.value, prev, { pos: part.pos, length });
        const nextTarget = target + delta;
        state.current = { value: part.value, target: nextTarget, revision: flow.revision };
        if (delta === 0)
            return;
        if (!flow.animated) {
            (0, react_native_reanimated_1.cancelAnimation)(position);
            position.value = nextTarget;
            return;
        }
        // withTiming starts from wherever the column currently is, so interrupted
        // spins accumulate instead of jumping.
        position.value = (0, react_native_reanimated_1.withTiming)(nextTarget, {
            duration: flow.spinTiming.duration,
            easing: flow.spinTiming.easing,
        });
    }, [flow, length, part.pos, part.value, position]);
    // Turning animations off finishes any in-flight spin.
    (0, react_1.useEffect)(() => {
        if (flow.animated)
            return;
        (0, react_native_reanimated_1.cancelAnimation)(position);
        position.value = state.current.target;
    }, [flow.animated, position]);
    const glyphs = (0, react_1.useMemo)(() => Array.from({ length }, (_, n) => n), [length]);
    const onLayout = (0, react_1.useCallback)((event) => {
        height.value = event.nativeEvent.layout.height;
    }, [height]);
    return ((0, jsx_runtime_1.jsx)(react_native_reanimated_1.default.View, { testID: testID, style: styles_1.styles.column, onLayout: onLayout, layout: flow.createLayout(), entering: flow.animateIn ? flow.createEnter() : undefined, exiting: flow.createExit(), children: glyphs.map((n) => ((0, jsx_runtime_1.jsx)(DigitGlyph_1.DigitGlyph, { n: n, length: length, position: position, height: height, isSizer: n === 0, paddingVertical: flow.mask.halfMaskHeight, baseTextStyle: flow.baseTextStyle, textStyle: flow.textStyle, testID: testID ? `${testID}-glyph-${n}` : undefined }, n))) }));
}
//# sourceMappingURL=Digit.js.map