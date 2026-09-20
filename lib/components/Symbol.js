"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Symbol = Symbol;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_native_reanimated_1 = __importDefault(require("react-native-reanimated"));
const context_1 = require("../context");
const styles_1 = require("../styles");
/** A non-digit character (sign, separator, currency, prefix...). Cross-fades when its text changes. */
function Symbol({ part, paddingVertical, testID }) {
    const flow = (0, context_1.useFlow)();
    return ((0, jsx_runtime_1.jsx)(react_native_reanimated_1.default.View, { testID: testID, layout: flow.createLayout(), exiting: flow.createExit(), children: (0, jsx_runtime_1.jsx)(react_native_reanimated_1.default.Text, { style: [styles_1.styles.text, flow.baseTextStyle, flow.textStyle, { paddingVertical }], entering: flow.animateIn ? flow.createEnter() : undefined, exiting: flow.createExit(), children: part.value }, part.value) }));
}
//# sourceMappingURL=Symbol.js.map