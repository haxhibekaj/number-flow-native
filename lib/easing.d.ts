import type { EasingFunction, ResolvedTiming } from './types';
/** Piecewise-linear easing from evenly spaced output points, like CSS `linear()`. */
export declare function linearEasing(points: readonly number[]): EasingFunction;
/** The spring-like curve NumberFlow uses for its default transform timing. */
export declare const DEFAULT_LINEAR_POINTS: readonly number[];
export declare const DEFAULT_TRANSFORM_TIMING: ResolvedTiming;
export declare const DEFAULT_OPACITY_TIMING: ResolvedTiming;
//# sourceMappingURL=easing.d.ts.map