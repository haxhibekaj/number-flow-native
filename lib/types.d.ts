import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
/** Intl part types with the plus and minus signs merged into a single `sign` type. */
export type NumberPartType = Exclude<Intl.NumberFormatPartTypes, 'minusSign' | 'plusSign'> | 'sign' | 'prefix' | 'suffix';
export type NumberPartKey = string;
export type KeyedDigitPart = {
    type: 'integer' | 'fraction';
    value: number;
    key: NumberPartKey;
    /** Position relative to the decimal point: 0 = ones, 1 = tens, -1 = tenths. */
    pos: number;
};
export type KeyedSymbolPart = {
    type: Exclude<NumberPartType, 'integer' | 'fraction'>;
    value: string;
    key: NumberPartKey;
};
export type KeyedNumberPart = KeyedDigitPart | KeyedSymbolPart;
export type Data = {
    pre: KeyedNumberPart[];
    integer: KeyedNumberPart[];
    fraction: KeyedNumberPart[];
    post: KeyedNumberPart[];
    valueAsString: string;
    value: number;
};
export type Value = number | string;
export type Format = Omit<Intl.NumberFormatOptions, 'notation'> & {
    notation?: Exclude<Intl.NumberFormatOptions['notation'], 'scientific' | 'engineering'>;
};
/**
 * Direction the digits should spin. `+1` always up, `-1` always down, `0` per digit.
 * A function receives the previous and next numeric values.
 */
export type Trend = number | ((oldValue: number, value: number) => number);
export type DigitOptions = {
    max?: number;
};
/** Per-position digit configuration, e.g. `{ 1: { max: 5 } }` for a 0-59 clock display. */
export type Digits = Record<number, DigitOptions>;
export type EasingFunction = (t: number) => number;
export type Timing = {
    duration: number;
    easing?: EasingFunction;
};
export type ResolvedTiming = Required<Timing>;
export type DigitInfo = {
    pos: number;
    length: number;
};
export type PluginUpdateContext = {
    trend: number;
};
export type PluginDeltaContext<S> = {
    trend: number;
    state: S;
};
export interface Plugin<S = unknown> {
    /** Called once per value change; the returned state is passed back to `getDelta`. */
    onUpdate?: (data: Data, prev: Data, ctx: PluginUpdateContext) => S;
    /** Return a spin delta for a digit, or `undefined` to defer to the default logic. */
    getDelta?: (value: number, prev: number, digit: DigitInfo, ctx: PluginDeltaContext<S>) => number | undefined;
}
export type AnimationProps = {
    /** Timing for layout moves and, unless `spinTiming` is set, digit spins. */
    transformTiming?: Timing;
    /** Timing for digit spins. Falls back to `transformTiming`. */
    spinTiming?: Timing;
    /** Timing for fading characters in and out. */
    opacityTiming?: Timing;
    /** Set to `false` to disable all animations and snap to the new value. */
    animated?: boolean;
    /** Honor the OS "reduce motion" setting. Defaults to `true`. */
    respectMotionPreference?: boolean;
    trend?: Trend;
    digits?: Digits;
    plugins?: Plugin<any>[];
    onAnimationsStart?: () => void;
    onAnimationsFinish?: () => void;
};
export type NumberFlowProps = AnimationProps & {
    value: Value;
    locales?: Intl.LocalesArgument;
    format?: Format;
    prefix?: string;
    suffix?: string;
    /** Text style applied to every glyph. Defaults include `fontVariant: ['tabular-nums']`. */
    style?: StyleProp<TextStyle>;
    /** Style for the root row container. */
    containerStyle?: StyleProp<ViewStyle>;
    /** Height of the top and bottom fade, in points. Defaults to `0.25em`. 0 disables it. */
    maskHeight?: number;
    /** Width of the left and right fade, in points. Defaults to `0.5em`. 0 disables it. */
    maskWidth?: number;
    testID?: string;
};
//# sourceMappingURL=types.d.ts.map