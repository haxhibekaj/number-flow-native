// Reanimated ships its own Jest helpers that replace the native worklet runtime.
require('react-native-reanimated').setUpTests();

// NumberFlow hides its glyphs from assistive tech (the root carries the label),
// so tests need to see through that to inspect individual parts.
require('@testing-library/react-native').configure({ defaultIncludeHiddenElements: true });

// The mask is two native views; render them as plain Views so tests can still
// query the glyphs underneath them.
jest.mock('@react-native-masked-view/masked-view', () => {
  const { View } = require('react-native');
  return { __esModule: true, default: View };
});

jest.mock('expo-linear-gradient', () => {
  const { View } = require('react-native');
  return { __esModule: true, LinearGradient: View };
});
