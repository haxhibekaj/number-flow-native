import React from 'react';
import { View } from 'react-native';
import { styles } from '../styles';
import type { KeyedDigitPart, KeyedNumberPart } from '../types';
import { Digit } from './Digit';
import { Symbol } from './Symbol';

type Props = {
  parts: KeyedNumberPart[];
  testID?: string;
};

const isDigit = (part: KeyedNumberPart): part is KeyedDigitPart =>
  part.type === 'integer' || part.type === 'fraction';

/** A run of keyed parts. Assistive tech reads the root label instead of these glyphs. */
export function Section({ parts, testID }: Props) {
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
          <Symbol key={part.key} part={part} testID={partTestID} />
        );
      })}
    </View>
  );
}
