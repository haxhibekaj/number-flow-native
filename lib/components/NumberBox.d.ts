import React, { type ReactNode } from 'react';
import type { ResolvedTiming } from '../types';
type Props = {
    timing: ResolvedTiming;
    animated: boolean;
    paddingHorizontal: number;
    paddingVertical: number;
    children: ReactNode;
};
/**
 * Sizes itself to its digits and animates width changes on the same curve the
 * digits spin on. Without this the box snaps the moment a digit is added or
 * removed while its contents are still sliding, which reads as a jump. The web
 * version animates the number's width for exactly this reason.
 *
 * The inner row uses `alignSelf: 'flex-start'` so it keeps its natural width
 * while the outer box is mid-animation; any overflow is hidden by the mask.
 */
export declare function NumberBox({ timing, animated, paddingHorizontal, paddingVertical, children, }: Props): React.JSX.Element;
export {};
//# sourceMappingURL=NumberBox.d.ts.map