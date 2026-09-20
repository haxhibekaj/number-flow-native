import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  /**
   * The digits inside the mask. `alignSelf` keeps this row at its natural width
   * even while the box animating around it is a different size.
   */
  measuredRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    alignSelf: 'flex-start',
  },
  column: {},
  text: {
    fontVariant: ['tabular-nums'],
  },
  stackedGlyph: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  maskFill: { flex: 1 },
  maskColumn: { flex: 1 },
  maskRow: { flex: 1, flexDirection: 'row' },
  maskCore: { flex: 1, backgroundColor: 'rgb(0,0,0)' },
});
