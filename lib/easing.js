"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_OPACITY_TIMING = exports.DEFAULT_TRANSFORM_TIMING = exports.DEFAULT_LINEAR_POINTS = void 0;
exports.linearEasing = linearEasing;
const react_native_reanimated_1 = require("react-native-reanimated");
/** Piecewise-linear easing from evenly spaced output points, like CSS `linear()`. */
function linearEasing(points) {
    if (points.length < 2) {
        throw new RangeError('linearEasing requires at least two points');
    }
    const pts = [...points];
    const segments = pts.length - 1;
    const first = pts[0] ?? 0;
    const last = pts[segments] ?? 1;
    return (t) => {
        'worklet';
        if (t <= 0)
            return first;
        if (t >= 1)
            return last;
        const scaled = t * segments;
        const index = Math.floor(scaled);
        const from = pts[index] ?? 0;
        const to = pts[index + 1] ?? from;
        return from + (to - from) * (scaled - index);
    };
}
/** The spring-like curve NumberFlow uses for its default transform timing. */
exports.DEFAULT_LINEAR_POINTS = [
    0, 0.005, 0.019, 0.039, 0.066, 0.096, 0.129, 0.165, 0.202, 0.24, 0.278, 0.316, 0.354, 0.39, 0.426,
    0.461, 0.494, 0.526, 0.557, 0.586, 0.614, 0.64, 0.665, 0.689, 0.711, 0.731, 0.751, 0.769, 0.786,
    0.802, 0.817, 0.831, 0.844, 0.856, 0.867, 0.877, 0.887, 0.896, 0.904, 0.912, 0.919, 0.925, 0.931,
    0.937, 0.942, 0.947, 0.951, 0.955, 0.959, 0.962, 0.965, 0.968, 0.971, 0.973, 0.976, 0.978, 0.98,
    0.981, 0.983, 0.984, 0.986, 0.987, 0.988, 0.989, 0.99, 0.991, 0.992, 0.992, 0.993, 0.994, 0.994,
    0.995, 0.995, 0.996, 0.996, 0.9963, 0.9967, 0.9969, 0.9972, 0.9975, 0.9977, 0.9979, 0.9981,
    0.9982, 0.9984, 0.9985, 0.9987, 0.9988, 0.9989, 1,
];
exports.DEFAULT_TRANSFORM_TIMING = {
    duration: 900,
    easing: linearEasing(exports.DEFAULT_LINEAR_POINTS),
};
exports.DEFAULT_OPACITY_TIMING = {
    duration: 450,
    easing: react_native_reanimated_1.Easing.out(react_native_reanimated_1.Easing.ease),
};
//# sourceMappingURL=easing.js.map