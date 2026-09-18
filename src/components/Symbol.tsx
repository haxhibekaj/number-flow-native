import React from 'react';
import Animated from 'react-native-reanimated';
import { useFlow } from '../context';
import { styles } from '../styles';
import type { KeyedSymbolPart } from '../types';

type Props = {
  part: KeyedSymbolPart;
  testID?: string;
};

/** A non-digit character (sign, separator, currency, prefix...). Cross-fades when its text changes. */
export function Symbol({ part, testID }: Props) {
  const flow = useFlow();

  return (
    <Animated.View testID={testID} layout={flow.layoutAnimation} exiting={flow.exitAnimation}>
      <Animated.Text
        key={part.value}
        style={[styles.text, flow.textStyle]}
        entering={flow.animateIn ? flow.enterAnimation : undefined}
        exiting={flow.exitAnimation}
      >
        {part.value}
      </Animated.Text>
    </Animated.View>
  );
}
