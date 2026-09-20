import type { ResolvedTiming, Timing } from './types';
export type ResolvedTimings = {
    transform: ResolvedTiming;
    spin: ResolvedTiming;
    opacity: ResolvedTiming;
};
export declare function resolveTimings(input: {
    transformTiming?: Timing;
    spinTiming?: Timing;
    opacityTiming?: Timing;
}): ResolvedTimings;
export declare const longestDuration: (timings: ResolvedTimings) => number;
//# sourceMappingURL=timing.d.ts.map