import React, { useCallback, type ReactNode } from 'react';
import { View, type LayoutChangeEvent } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { styles } from '../styles';
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
export function NumberBox({
  timing,
  animated,
  paddingHorizontal,
  paddingVertical,
  children,
}: Props) {
  const width = useSharedValue(0);
  const measured = useSharedValue(false);

  const onLayout = useCallback(
    (event: LayoutChangeEvent) => {
      width.value = event.nativeEvent.layout.width;
      measured.value = true;
    },
    [width, measured]
  );

  const boxStyle = useAnimatedStyle(() => {
    // Before the first measurement, fall back to intrinsic sizing so there is
    // no zero-width frame on mount.
    if (!measured.value) return {};
    return { width: animated ? withTiming(width.value, timing) : width.value };
  }, [animated, timing]);

  return (
    <Animated.View style={boxStyle}>
      <View
        style={[styles.measuredRow, { paddingHorizontal, paddingVertical }]}
        onLayout={onLayout}
      >
        {children}
      </View>
    </Animated.View>
  );
}
