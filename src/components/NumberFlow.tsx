import React, { useEffect, useMemo, useRef, useState } from 'react';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import { FlowContext, type FlowContextValue } from '../context';
import { formatToData } from '../formatter';
import { useAnimationsLifecycle } from '../hooks/useAnimationsLifecycle';
import { useCanAnimate } from '../hooks/useCanAnimate';
import { useFormatter } from '../hooks/useFormatter';
import { styles } from '../styles';
import { longestDuration, resolveTimings } from '../timing';
import type { Data, NumberFlowProps, Plugin, Trend } from '../types';
import { Section } from './Section';

const DEFAULT_TREND: Trend = (oldValue, value) => Math.sign(value - oldValue);
const NO_PLUGINS: Plugin<any>[] = [];

type History = { prev: Data; current: Data };

/** Tracks the previous `data` using React's adjust-state-on-render pattern. */
const usePreviousData = (data: Data): Data => {
  const [history, setHistory] = useState<History>({ prev: data, current: data });
  if (history.current !== data) {
    setHistory({ prev: history.current, current: data });
    return history.current;
  }
  return history.prev;
};

const useIsMounted = (): boolean => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);
  return isMounted;
};

export default function NumberFlow({
  value,
  locales,
  format,
  prefix,
  suffix,
  style,
  containerStyle,
  testID,
  transformTiming,
  spinTiming,
  opacityTiming,
  animated = true,
  respectMotionPreference = true,
  trend = DEFAULT_TREND,
  digits,
  plugins = NO_PLUGINS,
  onAnimationsStart,
  onAnimationsFinish,
}: NumberFlowProps) {
  const formatter = useFormatter(locales, format);
  const data = useMemo(
    () => formatToData(value, formatter, prefix, suffix),
    [value, formatter, prefix, suffix]
  );
  const prevData = usePreviousData(data);

  const computedTrend = useMemo(
    () => (typeof trend === 'function' ? trend(prevData.value, data.value) : trend),
    [trend, prevData.value, data.value]
  );
  const canAnimate = useCanAnimate({ respectMotionPreference });
  const computedAnimated = animated && canAnimate;
  const animateIn = useIsMounted();

  const timings = useMemo(
    () => resolveTimings({ transformTiming, spinTiming, opacityTiming }),
    [transformTiming, spinTiming, opacityTiming]
  );

  const lifecycle = useAnimationsLifecycle({
    duration: longestDuration(timings),
    onAnimationsStart,
    onAnimationsFinish,
  });

  const notifiedFor = useRef<Data>(data);
  useEffect(() => {
    if (!computedAnimated || notifiedFor.current === data) return;
    notifiedFor.current = data;
    if (prevData.valueAsString === data.valueAsString) return;
    lifecycle.notifyUpdate();
  }, [computedAnimated, data, prevData, lifecycle]);

  useEffect(() => {
    if (!computedAnimated) lifecycle.finishNow();
  }, [computedAnimated, lifecycle]);

  const pluginState = useMemo(
    () => plugins.map((plugin) => plugin.onUpdate?.(data, prevData, { trend: computedTrend })),
    [plugins, data, prevData, computedTrend]
  );

  const flow = useMemo<FlowContextValue>(() => {
    const { transform, spin, opacity } = timings;
    return {
      animated: computedAnimated,
      animateIn,
      revision: data,
      trend: computedTrend,
      digits,
      plugins,
      pluginState,
      spinTiming: spin,
      layoutAnimation: computedAnimated
        ? LinearTransition.duration(transform.duration).easing(transform.easing)
        : undefined,
      enterAnimation: computedAnimated
        ? FadeIn.duration(opacity.duration).easing(opacity.easing)
        : undefined,
      exitAnimation: computedAnimated
        ? FadeOut.duration(opacity.duration).easing(opacity.easing)
        : undefined,
      textStyle: style,
    };
  }, [timings, computedAnimated, animateIn, data, computedTrend, digits, plugins, pluginState, style]);

  return (
    <Animated.View
      testID={testID}
      accessible
      accessibilityRole="text"
      accessibilityLabel={data.valueAsString}
      style={[styles.root, containerStyle]}
      layout={flow.layoutAnimation}
    >
      <FlowContext.Provider value={flow}>
        <Section parts={data.pre} testID={testID} />
        <Section parts={data.integer} testID={testID} />
        <Section parts={data.fraction} testID={testID} />
        <Section parts={data.post} testID={testID} />
      </FlowContext.Provider>
    </Animated.View>
  );
}
