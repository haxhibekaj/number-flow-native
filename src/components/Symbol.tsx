import React from 'react';
import Animated from 'react-native-reanimated';
import { useFlow } from '../context';
import { styles } from '../styles';
import type { KeyedSymbolPart } from '../types';

type Props = {
  part: KeyedSymbolPart;
  /** Symbols sit outside the mask, so they pad by the full mask height to
   * match where the masked digits' text begins. */
  paddingVertical: number;
  testID?: string;
};

/** A non-digit character (sign, separator, currency, prefix...). Cross-fades when its text changes. */
export function Symbol({ part, paddingVertical, testID }: Props) {
  const flow = useFlow();

  return (
    <Animated.View testID={testID} layout={flow.createLayout()} exiting={flow.createExit()}>
      <Animated.Text
        key={part.value}
        style={[styles.text, flow.baseTextStyle, flow.textStyle, { paddingVertical }]}
        entering={flow.animateIn ? flow.createEnter() : undefined}
        exiting={flow.createExit()}
      >
        {part.value}
      </Animated.Text>
    </Animated.View>
  );
}
