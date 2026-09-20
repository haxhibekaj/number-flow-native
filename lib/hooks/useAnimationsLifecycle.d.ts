type Options = {
    /** How long after the last update the animations are considered finished. */
    duration: number;
    onAnimationsStart?: () => void;
    onAnimationsFinish?: () => void;
};
export type AnimationsLifecycle = {
    /** Call when an animated update begins. Starts or extends the in-flight window. */
    notifyUpdate: () => void;
    /** Ends the in-flight window immediately, e.g. when `animated` flips to false. */
    finishNow: () => void;
};
/**
 * Emits a single start event when animations begin and a single finish event
 * once no update has arrived for `duration` ms, mirroring NumberFlow's
 * `animationsstart` / `animationsfinish` events.
 */
export declare function useAnimationsLifecycle({ duration, onAnimationsStart, onAnimationsFinish, }: Options): AnimationsLifecycle;
export {};
//# sourceMappingURL=useAnimationsLifecycle.d.ts.map