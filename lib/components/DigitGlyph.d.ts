import React from 'react';
import type { StyleProp, TextStyle } from 'react-native';
import { type SharedValue } from 'react-native-reanimated';
type Props = {
    n: number;
    length: number;
    position: SharedValue<number>;
    height: SharedValue<number>;
    /** The glyph that stays in normal flow to give the column its size. */
    isSizer: boolean;
    /** Vertical padding on each glyph, half the mask height, as on the web. */
    paddingVertical: number;
    baseTextStyle: TextStyle;
    textStyle: StyleProp<TextStyle>;
    testID?: string;
};
/** One number in a digit column, translated vertically by its distance from the current position. */
export declare const DigitGlyph: React.MemoExoticComponent<({ n, length, position, height, isSizer, paddingVertical, baseTextStyle, textStyle, testID, }: Props) => React.JSX.Element>;
export {};
//# sourceMappingURL=DigitGlyph.d.ts.map