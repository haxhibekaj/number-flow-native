import React from 'react';
import type { KeyedSymbolPart } from '../types';
type Props = {
    part: KeyedSymbolPart;
    /** Symbols sit outside the mask, so they pad by the full mask height to
     * match where the masked digits' text begins. */
    paddingVertical: number;
    testID?: string;
};
/** A non-digit character (sign, separator, currency, prefix...). Cross-fades when its text changes. */
export declare function Symbol({ part, paddingVertical, testID }: Props): React.JSX.Element;
export {};
//# sourceMappingURL=Symbol.d.ts.map