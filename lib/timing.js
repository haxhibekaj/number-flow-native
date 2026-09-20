"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.longestDuration = void 0;
exports.resolveTimings = resolveTimings;
const easing_1 = require("./easing");
const resolveTiming = (timing, fallback) => ({
    duration: timing?.duration ?? fallback.duration,
    easing: timing?.easing ?? fallback.easing,
});
function resolveTimings(input) {
    const transform = resolveTiming(input.transformTiming, easing_1.DEFAULT_TRANSFORM_TIMING);
    return {
        transform,
        spin: resolveTiming(input.spinTiming, transform),
        opacity: resolveTiming(input.opacityTiming, easing_1.DEFAULT_OPACITY_TIMING),
    };
}
const longestDuration = (timings) => Math.max(timings.transform.duration, timings.spin.duration, timings.opacity.duration);
exports.longestDuration = longestDuration;
//# sourceMappingURL=timing.js.map