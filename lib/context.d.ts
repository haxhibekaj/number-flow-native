import type { ComponentProps } from 'react';
import type { StyleProp, TextStyle } from 'react-native';
import type Animated from 'react-native-reanimated';
import type { MaskGeometry } from './mask';
import type { Digits, Plugin, ResolvedTiming } from './types';
type AnimatedViewProps = ComponentProps<typeof Animated.View>;
export type FlowContextValue = {
    /** Whether updates animate, after applying `animated` and the reduce-motion preference. */
    animated: boolean;
    /** False during the very first render so existing parts don't fade or spin in. */
    animateIn: boolean;
    /** Identity of the current formatted data; changes exactly once per value update. */
    revision: object;
    trend: number;
    digits: Digits | undefined;
    plugins: Plugin<any>[];
    /** Per-plugin state returned by `onUpdate`, aligned with `plugins`. */
    pluginState: unknown[];
    spinTiming: ResolvedTiming;
    /**
     * Factories, not shared instances: Reanimated's builders are mutable
     * (`.duration()` returns `this`), so handing the same object to every digit
     * lets them clobber each other's config.
     */
    createLayout: () => AnimatedViewProps['layout'];
    createEnter: () => AnimatedViewProps['entering'];
    createExit: () => AnimatedViewProps['exiting'];
    /** Defaults applied before the caller's `style`, so they stay overridable. */
    baseTextStyle: TextStyle;
    textStyle: StyleProp<TextStyle>;
    mask: MaskGeometry;
};
export declare const FlowContext: import("react").Context<FlowContextValue | null>;
export declare function useFlow(): FlowContextValue;
export {};
//# sourceMappingURL=context.d.ts.map