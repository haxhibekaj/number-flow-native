# number-flow-native

An animated number component for React Native and Expo. A recreation of
[NumberFlow](https://number-flow.barvian.me) by Maxwell Barvian, rebuilt on
[Reanimated](https://docs.swmansion.com/react-native-reanimated/).

Digits spin like an odometer, symbols cross-fade, and the layout slides as
digits are added or removed. Pure JS/TS, no native code, works in Expo Go.

## Install

```sh
npx expo install number-flow-native react-native-reanimated react-native-worklets
```

Bare React Native: `npm i number-flow-native react-native-reanimated react-native-worklets`
and follow the Reanimated install guide (Babel plugin + pod install).

Peer requirements: React 18+, React Native 0.73+, Reanimated 3.6+ (4.x on
Expo SDK 53+).

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

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `number \| string` | | The number to show. Strings keep full precision. |
| `locales` | `Intl.LocalesArgument` | device | Locale(s) for formatting. |
| `format` | `Intl.NumberFormatOptions` | | Formatting options. `scientific` and `engineering` notation aren't supported. |
| `prefix` / `suffix` | `string` | | Custom text before or after the number. |
| `trend` | `number \| (prev, next) => number` | `Math.sign(next - prev)` | `+1` digits always spin up, `-1` always down, `0` each digit picks its own direction. |
| `digits` | `Record<number, { max?: number }>` | | Per-position digit config. For `342.5` the positions are `2, 1, 0, -1`. `{ 1: { max: 5 } }` makes a 0–59 clock wrap `59 → 00`. |
| `transformTiming` | `{ duration, easing? }` | `900ms`, spring-like | Timing for layout moves and, unless `spinTiming` is set, digit spins. |
| `spinTiming` | `{ duration, easing? }` | `transformTiming` | Timing for digit spins. |
| `opacityTiming` | `{ duration, easing? }` | `450ms`, ease-out | Timing for fades. |
| `animated` | `boolean` | `true` | `false` snaps to the new value and finishes any running animation. |
| `respectMotionPreference` | `boolean` | `true` | Skip animations when the OS "reduce motion" setting is on. |
| `plugins` | `Plugin[]` | | See [`continuous`](#continuous). |
| `onAnimationsStart` / `onAnimationsFinish` | `() => void` | | Fired once per burst of updates. |
| `style` | `TextStyle` | `fontVariant: ['tabular-nums']` | Applied to every glyph. |
| `containerStyle` | `ViewStyle` | | Applied to the root row. |

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

## Accessibility

The root view is announced as a single text element with the fully formatted
value as its label. Individual glyphs are hidden from assistive technology.

## Differences from the web version

- Layout transitions use Reanimated layout animations instead of measured FLIP transforms.
- Removed digits fade out at their last value rather than spinning to 0 first.
- Digit columns default to tabular figures so every column shares one width. Pass your own `fontVariant` in `style` to override.
- No gradient mask at the top and bottom of digit columns yet; columns clip with `overflow: hidden`.
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
