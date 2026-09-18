import React, { memo } from 'react';
import type { StyleProp, TextStyle } from 'react-native';
import Animated, { useAnimatedStyle, type SharedValue } from 'react-native-reanimated';
import { wrapOffset } from '../offset';
import { styles } from '../styles';

type Props = {
  n: number;
  length: number;
  position: SharedValue<number>;
  height: SharedValue<number>;
  /** The glyph that stays in normal flow to give the column its size. */
  isSizer: boolean;
  textStyle: StyleProp<TextStyle>;
  testID?: string;
};

/** One number in a digit column, translated vertically by its distance from the current position. */
export const DigitGlyph = memo(function DigitGlyph({
  n,
  length,
  position,
  height,
  isSizer,
  textStyle,
  testID,
}: Props) {
  const animatedStyle = useAnimatedStyle(() => {
    const offset = wrapOffset(n, position.value, length);
    const clamped = Math.max(-1, Math.min(1, offset));
    return {
      opacity: Math.abs(offset) >= 1 ? 0 : 1,
      transform: [{ translateY: clamped * height.value }],
    };
  });

  return (
    <Animated.Text
      testID={testID}
      style={[styles.text, isSizer ? null : styles.stackedGlyph, textStyle, animatedStyle]}
    >
      {n}
    </Animated.Text>
  );
});
