// Reanimated ships its own Jest helpers that replace the native worklet runtime.
require('react-native-reanimated').setUpTests();

// NumberFlow hides its glyphs from assistive tech (the root carries the label),
// so tests need to see through that to inspect individual parts.
require('@testing-library/react-native').configure({ defaultIncludeHiddenElements: true });
