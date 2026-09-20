import type { Data } from '../types';
export type ContinuousState = {
    startingPos: number | undefined;
};
/**
 * Makes transitions appear to pass through the numbers in between, e.g. 19 -> 21
 * spins the ones digit a full revolution instead of the shortest path.
 */
export declare const continuous: {
    onUpdate(data: Data, prev: Data, { trend }: {
        trend: number;
    }): ContinuousState;
    getDelta(value: number, prev: number, digit: {
        pos: number;
        length: number;
    }, { trend, state }: {
        trend: number;
        state: ContinuousState;
    }): number | undefined;
};
//# sourceMappingURL=continuous.d.ts.map