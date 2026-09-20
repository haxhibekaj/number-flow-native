"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCanAnimate = useCanAnimate;
const react_native_reanimated_1 = require("react-native-reanimated");
/** Whether NumberFlow will animate, taking the OS reduce-motion setting into account. */
function useCanAnimate({ respectMotionPreference = true } = {}) {
    const prefersReducedMotion = (0, react_native_reanimated_1.useReducedMotion)();
    return !respectMotionPreference || !prefersReducedMotion;
}
//# sourceMappingURL=useCanAnimate.js.map