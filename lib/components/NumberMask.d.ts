import React, { type ReactNode } from 'react';
import type { MaskGeometry } from '../mask';
type Props = {
    mask: MaskGeometry;
    children: ReactNode;
};
/**
 * Applies NumberFlow's edge fade to the digits. The horizontal and vertical
 * bands are nested so their alphas combine, which also softens the corners the
 * way the web version's radial corner gradients do.
 */
export declare const NumberMask: React.MemoExoticComponent<({ mask, children }: Props) => React.JSX.Element>;
export {};
//# sourceMappingURL=NumberMask.d.ts.map