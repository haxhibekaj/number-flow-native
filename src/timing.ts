import { DEFAULT_OPACITY_TIMING, DEFAULT_TRANSFORM_TIMING } from './easing';
import type { ResolvedTiming, Timing } from './types';

export type ResolvedTimings = {
  transform: ResolvedTiming;
  spin: ResolvedTiming;
  opacity: ResolvedTiming;
};

const resolveTiming = (timing: Timing | undefined, fallback: ResolvedTiming): ResolvedTiming => ({
  duration: timing?.duration ?? fallback.duration,
  easing: timing?.easing ?? fallback.easing,
});

export function resolveTimings(input: {
  transformTiming?: Timing;
  spinTiming?: Timing;
  opacityTiming?: Timing;
}): ResolvedTimings {
  const transform = resolveTiming(input.transformTiming, DEFAULT_TRANSFORM_TIMING);
  return {
    transform,
    spin: resolveTiming(input.spinTiming, transform),
    opacity: resolveTiming(input.opacityTiming, DEFAULT_OPACITY_TIMING),
  };
}

export const longestDuration = (timings: ResolvedTimings): number =>
  Math.max(timings.transform.duration, timings.spin.duration, timings.opacity.duration);
