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
  column: {
    overflow: 'hidden',
  },
  text: {
    fontVariant: ['tabular-nums'],
  },
  stackedGlyph: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
