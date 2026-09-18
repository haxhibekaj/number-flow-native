import { createContext, useContext } from 'react';
import type { ComponentProps } from 'react';
import type { StyleProp, TextStyle } from 'react-native';
import type Animated from 'react-native-reanimated';
import type { Digits, Plugin, ResolvedTiming } from './types';

type AnimatedViewProps = ComponentProps<typeof Animated.View>;

export type FlowContextValue = {
  /** Whether updates animate, after applying `animated` and the reduce-motion preference. */
  animated: boolean;
  /** False during the very first render so existing parts don't fade or spin in. */
  animateIn: boolean;
  /** Identity of the current formatted data; changes exactly once per value update. */
  revision: object;
  trend: number;
  digits: Digits | undefined;
  plugins: Plugin<any>[];
  /** Per-plugin state returned by `onUpdate`, aligned with `plugins`. */
  pluginState: unknown[];
  spinTiming: ResolvedTiming;
  layoutAnimation: AnimatedViewProps['layout'];
  enterAnimation: AnimatedViewProps['entering'];
  exitAnimation: AnimatedViewProps['exiting'];
  textStyle: StyleProp<TextStyle>;
};

export const FlowContext = createContext<FlowContextValue | null>(null);

export function useFlow(): FlowContextValue {
  const value = useContext(FlowContext);
  if (!value) {
    throw new Error('NumberFlow internals must be rendered inside <NumberFlow>');
  }
  return value;
}
