import React from 'react';
import { View } from 'react-native';
import { useFlow } from '../context';
import { styles } from '../styles';
import type { KeyedDigitPart, KeyedNumberPart } from '../types';
import { Digit } from './Digit';
import { Symbol } from './Symbol';

type Props = {
  parts: KeyedNumberPart[];
  /** Sections inside the mask already get padding from the masked wrapper. */
  masked?: boolean;
  testID?: string;
};

const isDigit = (part: KeyedNumberPart): part is KeyedDigitPart =>
  part.type === 'integer' || part.type === 'fraction';

/** A run of keyed parts. Assistive tech reads the root label instead of these glyphs. */
export function Section({ parts, masked = false, testID }: Props) {
  const flow = useFlow();
  const symbolPadding = masked ? flow.mask.halfMaskHeight : flow.mask.maskHeight;

  return (
    <View
      style={styles.section}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {parts.map((part) => {
        const partTestID = testID ? `${testID}-part-${part.key}` : undefined;
        return isDigit(part) ? (
          <Digit key={part.key} part={part} testID={partTestID} />
        ) : (
          <Symbol key={part.key} part={part} paddingVertical={symbolPadding} testID={partTestID} />
        );
      })}
    </View>
  );
}
