import React, { memo, type ReactNode } from 'react';
import { View } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from '../styles';
import type { MaskGeometry } from '../mask';

// Fully transparent black: only the alpha channel matters for a mask, and an
// explicit rgba avoids the premultiplied-color fringing 'transparent' can cause.
const CLEAR = 'rgba(0,0,0,0)';
const OPAQUE = 'rgb(0,0,0)';

const VERTICAL_FADE = [CLEAR, OPAQUE] as const;
const VERTICAL_UNFADE = [OPAQUE, CLEAR] as const;

const HORIZONTAL_START = { x: 0, y: 0.5 };
const HORIZONTAL_END = { x: 1, y: 0.5 };

/**
 * Opaque in the middle, fading to transparent over `size` at both ends. Built
 * from two fixed-size gradients around a solid centre so no measurement is
 * needed to place the gradient stops.
 */
function FadeBands({ size, horizontal }: { size: number; horizontal: boolean }) {
  const band = horizontal ? { width: size } : { height: size };
  const gradientProps = horizontal ? { start: HORIZONTAL_START, end: HORIZONTAL_END } : {};

  return (
    <View style={horizontal ? styles.maskRow : styles.maskColumn}>
      <LinearGradient colors={VERTICAL_FADE} style={band} {...gradientProps} />
      <View style={styles.maskCore} />
      <LinearGradient colors={VERTICAL_UNFADE} style={band} {...gradientProps} />
    </View>
  );
}

type Props = {
  mask: MaskGeometry;
  children: ReactNode;
};

/**
 * Applies NumberFlow's edge fade to the digits. The horizontal and vertical
 * bands are nested so their alphas combine, which also softens the corners the
 * way the web version's radial corner gradients do.
 */
export const NumberMask = memo(function NumberMask({ mask, children }: Props) {
  return (
    <MaskedView
      style={{ marginHorizontal: -mask.maskWidth }}
      maskElement={
        <MaskedView
          style={styles.maskFill}
          maskElement={<FadeBands size={mask.maskWidth} horizontal />}
        >
          <FadeBands size={mask.maskHeight} horizontal={false} />
        </MaskedView>
      }
    >
      {children}
    </MaskedView>
  );
});
