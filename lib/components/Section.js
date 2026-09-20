"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Section = Section;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_native_1 = require("react-native");
const context_1 = require("../context");
const styles_1 = require("../styles");
const Digit_1 = require("./Digit");
const Symbol_1 = require("./Symbol");
const isDigit = (part) => part.type === 'integer' || part.type === 'fraction';
/** A run of keyed parts. Assistive tech reads the root label instead of these glyphs. */
function Section({ parts, masked = false, testID }) {
    const flow = (0, context_1.useFlow)();
    const symbolPadding = masked ? flow.mask.halfMaskHeight : flow.mask.maskHeight;
    return ((0, jsx_runtime_1.jsx)(react_native_1.View, { style: styles_1.styles.section, accessibilityElementsHidden: true, importantForAccessibility: "no-hide-descendants", children: parts.map((part) => {
            const partTestID = testID ? `${testID}-part-${part.key}` : undefined;
            return isDigit(part) ? ((0, jsx_runtime_1.jsx)(Digit_1.Digit, { part: part, testID: partTestID }, part.key)) : ((0, jsx_runtime_1.jsx)(Symbol_1.Symbol, { part: part, paddingVertical: symbolPadding, testID: partTestID }, part.key));
        }) }));
}
//# sourceMappingURL=Section.js.map