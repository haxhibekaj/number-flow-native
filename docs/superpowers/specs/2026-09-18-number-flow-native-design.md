# number-flow-native — design spec

Date: 2026-09-18
Status: implemented (v0.1.0)

## Goal

A React Native + Expo recreation of [NumberFlow](https://github.com/barvian/number-flow):
a component that formats a number with `Intl.NumberFormat` and animates
transitions between values by spinning each digit like an odometer, fading
symbols in and out, and sliding the layout as digits are added or removed.

Pure JS/TS, no native code, so it runs in Expo Go and in any bare RN app.

## Decisions (made autonomously, flag if wrong)

| Decision | Choice | Why |
|---|---|---|
| Package name | `number-flow-native` | `react-native-number-flow` and `rn-number-flow` are taken on npm. |
| Animation engine | `react-native-reanimated` (peer, >=3.6) | Bundled with Expo, UI-thread timing, layout/entering/exiting animations replace the FLIP measurement pass the web version needs. |
| Layout shifts | Reanimated layout animations (`LinearTransition`, `FadeIn`, `FadeOut`) | Web NumberFlow measures before/after and animates deltas. RN has no sync layout reads, but Reanimated does the same job declaratively. |
| Digit widths | `fontVariant: ['tabular-nums']` by default | Digit columns share one width so we never measure per-glyph widths. Overridable via `style`. |
| Build | `tsc` → `lib/` (JS + d.ts); `react-native` field points at `src/` | Metro compiles TS from source; bundlers/TS get `lib/`. No Bob/Babel build pipeline needed. |
| Tests | Jest with `@react-native/jest-preset` + `@testing-library/react-native` 14 (async API) + Reanimated's `setUpTests()` and the `react-native-worklets/jest/resolver` | One runner for pure logic and component tests. |
| Dev dependency versions | Pinned to Expo SDK 57's expectations (RN 0.86.3, React 19.2.3, Reanimated 4.5.1, Worklets 0.10.1) | With pnpm's hoisted linker the example and the library share one tree, and `expo install --check` must pass. |
| Package manager | pnpm with `node-linker=hoisted` | Matches the original repo; hoisted linker is required for Metro. |
| Example app | `example/` Expo workspace package | Verifies Expo compatibility from day one. |

## Public API

```tsx
import NumberFlow, { continuous, useCanAnimate, linearEasing } from 'number-flow-native'

<NumberFlow
  value={1234.5}                 // number | string
  locales="en-US"                // Intl.LocalesArgument
  format={{ style: 'currency', currency: 'USD' }} // Intl.NumberFormatOptions minus scientific/engineering
  prefix="~" suffix="/mo"
  trend={(prev, next) => Math.sign(next - prev)}  // number | fn; +1 up, -1 down, 0 per-digit
  digits={{ 1: { max: 5 } }}     // per-position digit config, e.g. 59 -> 00 for a clock
  transformTiming={{ duration: 900, easing }}     // layout moves, fallback for spin
  spinTiming={{ duration: 900, easing }}          // digit spins
  opacityTiming={{ duration: 450, easing }}       // fades
  animated                       // false = snap, and finish in-flight animations
  respectMotionPreference        // honor the OS reduce-motion setting (default true)
  plugins={[continuous]}
  onAnimationsStart={() => {}}
  onAnimationsFinish={() => {}}
  style={{ fontSize: 32 }}       // TextStyle applied to every glyph
  containerStyle={{}}            // ViewStyle on the root row
/>
```

`Timing = { duration: number; easing?: EasingFunction }` where `EasingFunction` is
a Reanimated easing worklet. `linearEasing([...points])` reproduces the web
default `linear(...)` spring-ish curve.

Not ported (no equivalent need in RN, documented as deviations):
`NumberFlowGroup`, `isolate`, `willChange`, SSR helpers, CSP `styles`, CSS
`::part` styling. Removed digits fade out at their last value instead of
spinning to 0 first.

## Architecture

```
src/
  index.ts                  public exports
  types.ts                  Props, Timing, Trend, Digits, Plugin
  formatter.ts              formatToData: Intl parts -> keyed parts (ported)
  formatter-fallback.ts     char-class parser when formatToParts is missing
  delta.ts                  getDigitDelta: trend + wraparound (ported)
  offset.ts                 wrapOffset: which slot each glyph occupies in a column
  easing.ts                 linearEasing + default timings
  plugins/continuous.ts     "pass through intermediate numbers" plugin (ported)
  hooks/useFormatter.ts     cached Intl.NumberFormat per locales+format
  hooks/useAnimationsLifecycle.ts  start/finish events from an in-flight counter
  components/NumberFlow.tsx root: computes data, trend, plugin state; renders sections
  components/Section.tsx    row of keyed parts with layout animation
  components/Digit.tsx      one column: shared value `position`, glyph stack
  components/DigitGlyph.tsx one glyph in the column with its animated translateY
  components/Symbol.tsx     non-digit part; cross-fades when its text changes
```

### Data flow

1. `useFormatter` memoizes an `Intl.NumberFormat` keyed on JSON of locales+format.
2. `formatToData(value, formatter, prefix, suffix)` → `{ pre, integer, fraction, post, valueAsString, value }`.
   Integer digits are keyed right-to-left (`integer:0` = ones digit) so adding a
   leading digit keeps every existing column stable. Digit parts carry `pos`
   (0 = ones, 1 = tens, -1 = tenths...).
3. On `data` change, `NumberFlow` computes `trend` (prop or function of prev/next value),
   runs each plugin's `onUpdate` to get per-plugin state, and passes a `FlowContext`
   down through React context: `{ trend, digits, timings, animated, plugins, pluginState, lifecycle }`.
4. Each `Digit` keeps a logical target (`ref`) and a Reanimated shared value
   `position`. On value change it computes `delta` (`plugins → getDigitDelta`) and
   animates `position` to `target + delta` with `withTiming(spinTiming)`. Interruptions
   accumulate naturally because `withTiming` starts from the current animated position.
5. Each `DigitGlyph` `n` derives its slot with `wrapOffset(n, position, length)` ∈ [-length/2, length/2)
   and renders `translateY = clamp(offset, -1, 1) * height`, hidden when `|offset| >= 1`.
   `height` comes from the column's `onLayout`. The column clips with `overflow: hidden`.
6. Sections wrap parts in `Animated.View` with `layout={LinearTransition}` so added
   and removed columns slide siblings; new parts use `entering={FadeIn}`, removed use
   `exiting={FadeOut}`. New digits mount at 0 and spin up to their value when animated.
7. `Symbol` keys its inner `Animated.Text` by value so `+` → `-` cross-fades.

### Reduced motion & animated=false

`computedAnimated = animated && (!respectMotionPreference || !useReducedMotion())`.
When false: `position.value` is set directly, layout/entering/exiting props are
omitted, and in-flight timings are cancelled. `useCanAnimate({ respectMotionPreference })`
exposes the same check.

### Accessibility

Root `View` gets `accessibilityRole="text"` and `accessibilityLabel={valueAsString}`;
children are hidden from assistive tech.

### Error handling

- `value` that is not a finite number or numeric string → throws a descriptive `TypeError` at the boundary.
- `Intl.NumberFormat` construction errors (bad locale/options) propagate with the original message.
- Missing `formatToParts` (very old Hermes) → fallback parser, no crash.
- `digits[pos].max` outside 1..9 → `RangeError`.

### Testing

- Unit: formatter keys/pos/prefix/suffix/sign merge, fallback parser, delta wrap logic,
  wrapOffset, linearEasing, continuous plugin, lifecycle counter.
- Component: renders label, updates on value change, adds/removes columns, `animated=false`
  snaps, `onAnimationsFinish` fires after timers advance.
- Coverage threshold 80% enforced in `jest.config.js`.

## Implementation plan (executed in order, TDD each step)

1. Scaffold: package.json, tsconfig, jest, babel, license, spec. ✔
2. `formatter.ts` (+ fallback) with tests. ✔
3. `delta.ts`, `offset.ts`, `easing.ts` with tests. ✔
4. `plugins/continuous.ts` with tests. ✔
5. `types.ts`, context, `useAnimationsLifecycle` with tests. ✔
6. `Digit`/`DigitGlyph`/`Symbol`/`Section`/`NumberFlow` with component tests. ✔
7. `index.ts`, README, `example/` Expo app, typecheck + build. ✔

Verification on 2026-09-18: 61 Jest tests pass at 97.9% statement coverage,
`tsc` clean for library and example, `expo install --check` clean, and
`expo export --platform ios` bundles the example (962 modules) to Hermes bytecode.

Not yet verified: running on a device or simulator. Layout animations,
`overflow: hidden` clipping of the digit columns, and the `onLayout` height
measurement need a visual check in the example app.
