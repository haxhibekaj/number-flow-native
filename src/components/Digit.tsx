import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import Animated, { cancelAnimation, useSharedValue, withTiming } from 'react-native-reanimated';
import { useFlow, type FlowContextValue } from '../context';
import { getDigitDelta } from '../delta';
import { getColumnLength } from '../digits';
import { styles } from '../styles';
import type { DigitInfo, KeyedDigitPart } from '../types';
import { DigitGlyph } from './DigitGlyph';

type Props = {
  part: KeyedDigitPart;
  testID?: string;
};

type DigitState = {
  /** Last value this column was asked to show. */
  value: number;
  /** Unbounded logical position; glyphs wrap it modulo the column length. */
  target: number;
  /** The flow revision this column last processed. */
  revision: object;
};

const resolveDelta = (
  flow: FlowContextValue,
  value: number,
  prev: number,
  digit: DigitInfo
): number => {
  for (const [index, plugin] of flow.plugins.entries()) {
    const delta = plugin.getDelta?.(value, prev, digit, {
      trend: flow.trend,
      state: flow.pluginState[index],
    });
    if (delta != null) return delta;
  }
  return getDigitDelta({ value, prev, trend: flow.trend, length: digit.length });
};

/** A single digit column that spins through its glyphs to reach each new value. */
export function Digit({ part, testID }: Props) {
  const flow = useFlow();
  const length = getColumnLength(flow.digits, part.pos);

  // Digits added mid-flight start at 0 and spin up to their value, as on the web.
  const startsAtZero = flow.animateIn && flow.animated;
  const initial = startsAtZero ? 0 : part.value;
  const position = useSharedValue(initial);
  const height = useSharedValue(0);
  const state = useRef<DigitState>({ value: initial, target: initial, revision: flow.revision });

  useEffect(() => {
    const { value: prev, target, revision } = state.current;
    // Re-run once per value update, even for unchanged digits: plugins such as
    // `continuous` may still want to spin them.
    if (revision === flow.revision && prev === part.value) return;

    const delta = resolveDelta(flow, part.value, prev, { pos: part.pos, length });
    const nextTarget = target + delta;
    state.current = { value: part.value, target: nextTarget, revision: flow.revision };
    if (delta === 0) return;

    if (!flow.animated) {
      cancelAnimation(position);
      position.value = nextTarget;
      return;
    }
    // withTiming starts from wherever the column currently is, so interrupted
    // spins accumulate instead of jumping.
    position.value = withTiming(nextTarget, {
      duration: flow.spinTiming.duration,
      easing: flow.spinTiming.easing,
    });
  }, [flow, length, part.pos, part.value, position]);

  // Turning animations off finishes any in-flight spin.
  useEffect(() => {
    if (flow.animated) return;
    cancelAnimation(position);
    position.value = state.current.target;
  }, [flow.animated, position]);

  const glyphs = useMemo(() => Array.from({ length }, (_, n) => n), [length]);

  const onLayout = useCallback(
    (event: LayoutChangeEvent) => {
      height.value = event.nativeEvent.layout.height;
    },
    [height]
  );

  return (
    <Animated.View
      testID={testID}
      style={styles.column}
      onLayout={onLayout}
      layout={flow.createLayout()}
      entering={flow.animateIn ? flow.createEnter() : undefined}
      exiting={flow.createExit()}
    >
      {glyphs.map((n) => (
        <DigitGlyph
          key={n}
          n={n}
          length={length}
          position={position}
          height={height}
          isSizer={n === 0}
          paddingVertical={flow.mask.halfMaskHeight}
          baseTextStyle={flow.baseTextStyle}
          textStyle={flow.textStyle}
          testID={testID ? `${testID}-glyph-${n}` : undefined}
        />
      ))}
    </Animated.View>
  );
}
