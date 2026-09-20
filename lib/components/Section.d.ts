import React from 'react';
import type { KeyedNumberPart } from '../types';
type Props = {
    parts: KeyedNumberPart[];
    /** Sections inside the mask already get padding from the masked wrapper. */
    masked?: boolean;
    testID?: string;
};
/** A run of keyed parts. Assistive tech reads the root label instead of these glyphs. */
export declare function Section({ parts, masked, testID }: Props): React.JSX.Element;
export {};
//# sourceMappingURL=Section.d.ts.map