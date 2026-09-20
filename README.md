# number-flow-native

An animated number component for React Native and Expo. A recreation of
[NumberFlow](https://number-flow.barvian.me) by Maxwell Barvian, rebuilt on
[Reanimated](https://docs.swmansion.com/react-native-reanimated/).

Digits spin like an odometer, symbols cross-fade, and the layout slides as
digits are added or removed. Pure JS/TS, no native code, works in Expo Go.

## Install

This package is published from a private GitHub repository, not npm. Install the
peer dependencies with Expo so they match your SDK, then add the package itself
pinned to a tag:

```sh
npx expo install react-native-reanimated react-native-worklets \
  @react-native-masked-view/masked-view expo-linear-gradient

pnpm add github:haxhibekaj/number-flow-native#v0.1.0
```

Pin a tag or a commit SHA rather than a branch. Git dependencies are not
immutable, so a branch reference silently changes under you.

Access needs a credential that can read the private repository. The GitHub CLI
configures one for local work. For CI or EAS Build, expose a token or a
deploy key at install time.

The built output is committed to the repository, so no build runs on install.

Bare React Native: install the same packages with your package manager and
follow the Reanimated install guide (Babel plugin + pod install).

Peer requirements: React 18+, React Native 0.73+, Reanimated 3.6+ (4.x on
Expo SDK 53+). The masked view and linear gradient render the edge fade and are
required; both are bundled with Expo Go.

## Usage

```tsx
import NumberFlow from 'number-flow-native';

function Price({ value }: { value: number }) {
  return (
    <NumberFlow
      value={value}
      format={{ style: 'currency', currency: 'USD', trailingZeroDisplay: 'stripIfInteger' }}
      suffix="/mo"
      style={{ fontSize: 40, fontWeight: '600' }}
    />
  );
}
```

`NumberFlow` animates whenever `value` changes.

## Props

| Prop                                       | Type                               | Default                         | Description                                                                                                                    |
| ------------------------------------------ | ---------------------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `value`                                    | `number \| string`                 |                                 | The number to show. Strings keep full precision.                                                                               |
| `locales`                                  | `Intl.LocalesArgument`             | device                          | Locale(s) for formatting.                                                                                                      |
| `format`                                   | `Intl.NumberFormatOptions`         |                                 | Formatting options. `scientific` and `engineering` notation aren't supported.                                                  |
| `prefix` / `suffix`                        | `string`                           |                                 | Custom text before or after the number.                                                                                        |
| `trend`                                    | `number \| (prev, next) => number` | `Math.sign(next - prev)`        | `+1` digits always spin up, `-1` always down, `0` each digit picks its own direction.                                          |
| `digits`                                   | `Record<number, { max?: number }>` |                                 | Per-position digit config. For `342.5` the positions are `2, 1, 0, -1`. `{ 1: { max: 5 } }` makes a 0–59 clock wrap `59 → 00`. |
| `transformTiming`                          | `{ duration, easing? }`            | `900ms`, spring-like            | Timing for layout moves and, unless `spinTiming` is set, digit spins.                                                          |
| `spinTiming`                               | `{ duration, easing? }`            | `transformTiming`               | Timing for digit spins.                                                                                                        |
| `opacityTiming`                            | `{ duration, easing? }`            | `450ms`, ease-out               | Timing for fades.                                                                                                              |
| `animated`                                 | `boolean`                          | `true`                          | `false` snaps to the new value and finishes any running animation.                                                             |
| `respectMotionPreference`                  | `boolean`                          | `true`                          | Skip animations when the OS "reduce motion" setting is on.                                                                     |
| `plugins`                                  | `Plugin[]`                         |                                 | See [`continuous`](#continuous).                                                                                               |
| `onAnimationsStart` / `onAnimationsFinish` | `() => void`                       |                                 | Fired once per burst of updates.                                                                                               |
| `style`                                    | `TextStyle`                        | `fontVariant: ['tabular-nums']` | Applied to every glyph.                                                                                                        |
| `containerStyle`                           | `ViewStyle`                        |                                 | Applied to the root row.                                                                                                       |
| `maskHeight`                               | `number`                           | `0.25em`                        | Height of the top and bottom fade. `0` disables it.                                                                            |
| `maskWidth`                                | `number`                           | `0.5em`                         | Width of the left and right fade. `0` disables it.                                                                             |

Easing functions must be Reanimated worklets: anything from `Easing`, or
`linearEasing([...])` which reproduces CSS `linear()` curves:

```tsx
import NumberFlow, { linearEasing } from 'number-flow-native';
import { Easing } from 'react-native-reanimated';

<NumberFlow
  value={value}
  transformTiming={{ duration: 750, easing: linearEasing([0, 0.6, 0.9, 1.02, 1]) }}
  opacityTiming={{ duration: 350, easing: Easing.out(Easing.ease) }}
/>;
```

### `continuous`

Makes transitions pass through the numbers in between, e.g. `19 → 21` spins
the ones digit a full turn instead of taking the shortest path.

```tsx
import NumberFlow, { continuous } from 'number-flow-native';

<NumberFlow value={value} plugins={[continuous]} />;
```

### `useCanAnimate`

```tsx
import { useCanAnimate } from 'number-flow-native';

const canAnimate = useCanAnimate({ respectMotionPreference: true });
```

## Line height

Digits are laid out with `lineHeight` equal to `fontSize`, matching the web
version's `line-height: 1`. This is what fixes how far a digit travels per step,
so a spin covers the same distance it does on the web. Set `lineHeight` in
`style` to override it, and expect the motion to change with it.

## Bare React Native

`expo-linear-gradient` draws the fade and depends on `expo-modules-core`. In an
app without Expo, install the Expo modules first:

```sh
npx install-expo-modules@latest
```

Everything else in this package is plain JavaScript and needs no native code of
its own.

## Platform support

Verified on iOS and Android. The per-digit spin, the edge fade and the width
animation were checked from screen recordings on an iPhone simulator, and the
package was confirmed to build and run on an Android emulator.

Note that `Intl` differs between the two, which changes formatting but not
animation. See below.

## Intl support

Formatting comes from `Intl.NumberFormat`, so what you get depends on the ICU
data in your JavaScript engine, not on this library. Some React Native engines
ship a reduced Intl. Measured in Expo Go: Android has full ICU, while iOS is
missing `formatToParts` entirely and ignores `notation: 'compact'`,
`signDisplay` and `minimumIntegerDigits`.

When `formatToParts` is unavailable this library falls back to parsing the
formatted string, so digits, grouping, the decimal separator and the sign still
animate correctly. For full parity with the web, add a polyfill:

```sh
npx expo install @formatjs/intl-numberformat
```

```ts
import '@formatjs/intl-numberformat/polyfill';
import '@formatjs/intl-numberformat/locale-data/en';
```

## Accessibility

The root view is announced as a single text element with the fully formatted
value as its label. Individual glyphs are hidden from assistive technology.

## Differences from the web version

- Horizontal motion uses Reanimated layout animations plus an animated container width, rather than the web's measured FLIP transforms. Digits stay grouped through a width change, but the two are not frame-identical.
- Removed digits fade out at their last value rather than spinning to 0 first.
- Digit columns default to tabular figures so every column shares one width. Pass your own `fontVariant` in `style` to override.
- The edge fade is a masked view with two linear gradients whose alphas combine. The web uses four extra radial gradients to soften the corners; the combined alphas approximate them.
- `NumberFlowGroup`, `isolate`, `willChange`, SSR helpers and CSS `::part` styling have no RN equivalent and are not included.
- `onAnimationsFinish` fires after the longest configured timing elapses with no further updates.

## Development

```sh
pnpm install
pnpm test            # jest, 80% coverage threshold
pnpm typecheck
pnpm build           # emits lib/
cd example && pnpm start
```

## License

MIT. NumberFlow is © Maxwell Barvian, MIT licensed.
