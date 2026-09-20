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
exports.default = NumberFlow;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_native_reanimated_1 = __importStar(require("react-native-reanimated"));
const context_1 = require("../context");
const formatter_1 = require("../formatter");
const mask_1 = require("../mask");
const useAnimationsLifecycle_1 = require("../hooks/useAnimationsLifecycle");
const useCanAnimate_1 = require("../hooks/useCanAnimate");
const useFormatter_1 = require("../hooks/useFormatter");
const styles_1 = require("../styles");
const timing_1 = require("../timing");
const NumberBox_1 = require("./NumberBox");
const NumberMask_1 = require("./NumberMask");
const Section_1 = require("./Section");
const DEFAULT_TREND = (oldValue, value) => Math.sign(value - oldValue);
const NO_PLUGINS = [];
/** Tracks the previous `data` using React's adjust-state-on-render pattern. */
const usePreviousData = (data) => {
    const [history, setHistory] = (0, react_1.useState)({ prev: data, current: data });
    if (history.current !== data) {
        setHistory({ prev: history.current, current: data });
        return history.current;
    }
    return history.prev;
};
function NumberFlow({ value, locales, format, prefix, suffix, style, containerStyle, testID, transformTiming, spinTiming, opacityTiming, animated = true, respectMotionPreference = true, trend = DEFAULT_TREND, digits, plugins = NO_PLUGINS, maskHeight, maskWidth, onAnimationsStart, onAnimationsFinish, }) {
    const formatter = (0, useFormatter_1.useFormatter)(locales, format);
    const data = (0, react_1.useMemo)(() => (0, formatter_1.formatToData)(value, formatter, prefix, suffix), [value, formatter, prefix, suffix]);
    const prevData = usePreviousData(data);
    const computedTrend = (0, react_1.useMemo)(() => (typeof trend === 'function' ? trend(prevData.value, data.value) : trend), [trend, prevData.value, data.value]);
    const canAnimate = (0, useCanAnimate_1.useCanAnimate)({ respectMotionPreference });
    const computedAnimated = animated && canAnimate;
    // Parts only ever appear when the data changes, and on the very first render
    // `usePreviousData` reports the same object it was given. So this is false on
    // mount, which is exactly when entering animations should be suppressed, and
    // needs no extra state, ref or effect of its own.
    const animateIn = prevData !== data;
    const fontSize = (0, mask_1.getFontSize)(style);
    const mask = (0, react_1.useMemo)(() => (0, mask_1.resolveMask)(fontSize, maskHeight, maskWidth), [fontSize, maskHeight, maskWidth]);
    // The web pins `line-height: 1`, which fixes a digit's box at `1em` and so
    // fixes how far it travels per step. React Native would otherwise use the
    // font's natural line height, making every spin overshoot the web version.
    const baseTextStyle = (0, react_1.useMemo)(() => ({ lineHeight: fontSize }), [fontSize]);
    const timings = (0, react_1.useMemo)(() => (0, timing_1.resolveTimings)({ transformTiming, spinTiming, opacityTiming }), [transformTiming, spinTiming, opacityTiming]);
    const lifecycle = (0, useAnimationsLifecycle_1.useAnimationsLifecycle)({
        duration: (0, timing_1.longestDuration)(timings),
        onAnimationsStart,
        onAnimationsFinish,
    });
    const notifiedFor = (0, react_1.useRef)(data);
    (0, react_1.useEffect)(() => {
        if (!computedAnimated || notifiedFor.current === data)
            return;
        notifiedFor.current = data;
        if (prevData.valueAsString === data.valueAsString)
            return;
        lifecycle.notifyUpdate();
    }, [computedAnimated, data, prevData, lifecycle]);
    (0, react_1.useEffect)(() => {
        if (!computedAnimated)
            lifecycle.finishNow();
    }, [computedAnimated, lifecycle]);
    const pluginState = (0, react_1.useMemo)(() => plugins.map((plugin) => plugin.onUpdate?.(data, prevData, { trend: computedTrend })), [plugins, data, prevData, computedTrend]);
    const flow = (0, react_1.useMemo)(() => {
        const { transform, spin, opacity } = timings;
        return {
            animated: computedAnimated,
            animateIn,
            revision: data,
            trend: computedTrend,
            digits,
            plugins,
            pluginState,
            spinTiming: spin,
            createLayout: () => computedAnimated
                ? react_native_reanimated_1.LinearTransition.duration(transform.duration).easing(transform.easing)
                : undefined,
            createEnter: () => computedAnimated ? react_native_reanimated_1.FadeIn.duration(opacity.duration).easing(opacity.easing) : undefined,
            createExit: () => computedAnimated ? react_native_reanimated_1.FadeOut.duration(opacity.duration).easing(opacity.easing) : undefined,
            baseTextStyle,
            textStyle: style,
            mask,
        };
    }, [
        timings,
        computedAnimated,
        animateIn,
        data,
        computedTrend,
        digits,
        plugins,
        pluginState,
        style,
        mask,
        baseTextStyle,
    ]);
    return ((0, jsx_runtime_1.jsx)(react_native_reanimated_1.default.View, { testID: testID, accessible: true, accessibilityRole: "text", accessibilityLabel: data.valueAsString, style: [styles_1.styles.root, containerStyle], children: (0, jsx_runtime_1.jsxs)(context_1.FlowContext.Provider, { value: flow, children: [(0, jsx_runtime_1.jsx)(Section_1.Section, { parts: data.pre, testID: testID }), (0, jsx_runtime_1.jsx)(NumberMask_1.NumberMask, { mask: mask, children: (0, jsx_runtime_1.jsxs)(NumberBox_1.NumberBox, { timing: timings.transform, animated: computedAnimated, paddingHorizontal: mask.maskWidth, paddingVertical: mask.halfMaskHeight, children: [(0, jsx_runtime_1.jsx)(Section_1.Section, { parts: data.integer, masked: true, testID: testID }), (0, jsx_runtime_1.jsx)(Section_1.Section, { parts: data.fraction, masked: true, testID: testID })] }) }), (0, jsx_runtime_1.jsx)(Section_1.Section, { parts: data.post, testID: testID })] }) }));
}
//# sourceMappingURL=NumberFlow.js.map