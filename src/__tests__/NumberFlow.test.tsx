import React from 'react';
import { act, fireEvent, render, screen, within } from '@testing-library/react-native';
import { getAnimatedStyle as getAnimatedStyleUntyped } from 'react-native-reanimated';
import NumberFlow from '../components/NumberFlow';
import { continuous } from '../plugins/continuous';

// Reanimated's real useReducedMotion holds no React state, so the mock adds a
// real hook: calling it conditionally must break React's hook ordering.
const mockReducedMotion = { value: false };
jest.mock('react-native-reanimated', () => {
  const ReactForMock = require('react');
  return {
    __esModule: true,
    ...jest.requireActual('react-native-reanimated'),
    useReducedMotion: () => {
      ReactForMock.useState(null);
      return mockReducedMotion.value;
    },
  };
});

type AnimatedStyle = { opacity: number; transform: { translateY: number }[] };
// Reanimated's type for this helper is the web stub; the native Jest version returns the style.
const getAnimatedStyle = getAnimatedStyleUntyped as unknown as (component: unknown) => AnimatedStyle;

const partId = (key: string) => `flow-part-${key}`;
const glyphId = (key: string, n: number) => `flow-part-${key}-glyph-${n}`;
const COLUMN_HEIGHT = 40;

const layoutColumn = (key: string) =>
  fireEvent(screen.getByTestId(partId(key)), 'layout', {
    nativeEvent: { layout: { x: 0, y: 0, width: 20, height: COLUMN_HEIGHT } },
  });

describe('NumberFlow', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockReducedMotion.value = false;
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  test('exposes the formatted value as the accessibility label', async () => {
    await render(<NumberFlow value={1234.5} testID="flow" />);

    expect(screen.getByTestId('flow').props.accessibilityLabel).toBe('1,234.5');
  });

  test('renders one column per digit with ten glyphs each', async () => {
    await render(<NumberFlow value={42} testID="flow" />);

    expect(screen.getByTestId(partId('integer:1'))).toBeTruthy();
    expect(screen.getByTestId(partId('integer:0'))).toBeTruthy();
    expect(screen.getAllByTestId(/flow-part-integer:0-glyph-/)).toHaveLength(10);
  });

  test('renders prefix, suffix and formatted symbols as parts', async () => {
    await render(
      <NumberFlow
        value={12}
        prefix="~"
        suffix="/mo"
        format={{ style: 'currency', currency: 'USD' }}
        testID="flow"
      />
    );

    expect(within(screen.getByTestId(partId('prefix:0'))).getByText('~')).toBeTruthy();
    expect(within(screen.getByTestId(partId('currency:0'))).getByText('$')).toBeTruthy();
    expect(within(screen.getByTestId(partId('suffix:0'))).getByText('/mo')).toBeTruthy();
  });

  test('sizes a column from digits max', async () => {
    await render(<NumberFlow value={5} digits={{ 0: { max: 5 } }} testID="flow" />);

    expect(screen.getAllByTestId(/flow-part-integer:0-glyph-/)).toHaveLength(6);
  });

  test('throws for an invalid digits max', async () => {
    const silence = jest.spyOn(console, 'error').mockImplementation(() => {});

    await expect(render(<NumberFlow value={5} digits={{ 0: { max: 12 } }} />)).rejects.toThrow(RangeError);

    silence.mockRestore();
  });

  test('throws for a non-numeric value', async () => {
    const silence = jest.spyOn(console, 'error').mockImplementation(() => {});

    await expect(render(<NumberFlow value="abc" />)).rejects.toThrow(TypeError);

    silence.mockRestore();
  });

  test('keeps the ones column mounted and adds a column when the value grows a digit', async () => {
    const { rerender } = await render(<NumberFlow value={99} testID="flow" />);
    const ones = screen.getByTestId(partId('integer:0'));

    await rerender(<NumberFlow value={100} testID="flow" />);

    expect(screen.getByTestId(partId('integer:2'))).toBeTruthy();
    expect(screen.getByTestId(partId('integer:0'))).toBe(ones);
  });

  test('removes the sign symbol when the value becomes positive', async () => {
    const { rerender } = await render(<NumberFlow value={-5} testID="flow" />);
    expect(screen.getByTestId(partId('sign:0'))).toBeTruthy();

    await rerender(<NumberFlow value={5} testID="flow" />);

    expect(screen.queryByTestId(partId('sign:0'))).toBeNull();
  });

  test('keeps the sign part and swaps its text when the sign flips', async () => {
    const format = { signDisplay: 'always' as const };
    const { rerender } = await render(<NumberFlow value={5} format={format} testID="flow" />);

    await rerender(<NumberFlow value={-5} format={format} testID="flow" />);

    expect(within(screen.getByTestId(partId('sign:0'))).getByText('-')).toBeTruthy();
  });

  test('snaps glyphs into place without animating when animated is false', async () => {
    const { rerender } = await render(<NumberFlow value={3} animated={false} testID="flow" />);
    await layoutColumn('integer:0');

    await rerender(<NumberFlow value={4} animated={false} testID="flow" />);
    // Style propagation is per frame even when the value itself is set synchronously.
    await act(() => {
      jest.advanceTimersByTime(16);
    });

    expect(getAnimatedStyle(screen.getByTestId(glyphId('integer:0', 4)))).toMatchObject({
      opacity: 1,
      transform: [{ translateY: 0 }],
    });
    expect(getAnimatedStyle(screen.getByTestId(glyphId('integer:0', 3)))).toMatchObject({
      opacity: 0,
      transform: [{ translateY: -COLUMN_HEIGHT }],
    });
  });

  test('spins the ones column to the new value over the spin duration', async () => {
    const { rerender } = await render(<NumberFlow value={3} testID="flow" />);
    await layoutColumn('integer:0');

    await rerender(<NumberFlow value={4} testID="flow" />);
    await act(() => {
      jest.advanceTimersByTime(16);
    });
    const midway = getAnimatedStyle(screen.getByTestId(glyphId('integer:0', 4)));
    expect(midway.transform[0]?.translateY).toBeGreaterThan(0);

    await act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(getAnimatedStyle(screen.getByTestId(glyphId('integer:0', 4)))).toMatchObject({
      opacity: 1,
      transform: [{ translateY: 0 }],
    });
  });

  test('spins downward when the trend is negative', async () => {
    const { rerender } = await render(<NumberFlow value={4} testID="flow" />);
    await layoutColumn('integer:0');

    await rerender(<NumberFlow value={3} testID="flow" />);
    await act(() => {
      jest.advanceTimersByTime(16);
    });

    const midway = getAnimatedStyle(screen.getByTestId(glyphId('integer:0', 3)));
    expect(midway.transform[0]?.translateY).toBeLessThan(0);
  });

  test('starts new digits at zero and spins them to their value', async () => {
    const { rerender } = await render(<NumberFlow value={9} testID="flow" />);

    await rerender(<NumberFlow value={19} testID="flow" />);
    await layoutColumn('integer:1');
    await act(() => {
      jest.advanceTimersByTime(16);
    });

    const zero = getAnimatedStyle(screen.getByTestId(glyphId('integer:1', 0)));
    expect(zero.opacity).toBeGreaterThan(0);

    await act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(getAnimatedStyle(screen.getByTestId(glyphId('integer:1', 1)))).toMatchObject({
      opacity: 1,
      transform: [{ translateY: 0 }],
    });
  });

  test('calls onAnimationsStart and onAnimationsFinish around an animated update', async () => {
    const onAnimationsStart = jest.fn();
    const onAnimationsFinish = jest.fn();
    const { rerender } = await render(
      <NumberFlow value={1} onAnimationsStart={onAnimationsStart} onAnimationsFinish={onAnimationsFinish} />
    );

    await rerender(
      <NumberFlow value={2} onAnimationsStart={onAnimationsStart} onAnimationsFinish={onAnimationsFinish} />
    );
    expect(onAnimationsStart).toHaveBeenCalledTimes(1);
    expect(onAnimationsFinish).not.toHaveBeenCalled();

    await act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(onAnimationsFinish).toHaveBeenCalledTimes(1);
  });

  test('does not fire animation events when animated is false', async () => {
    const onAnimationsStart = jest.fn();
    const { rerender } = await render(<NumberFlow value={1} animated={false} onAnimationsStart={onAnimationsStart} />);

    await rerender(<NumberFlow value={2} animated={false} onAnimationsStart={onAnimationsStart} />);

    expect(onAnimationsStart).not.toHaveBeenCalled();
  });

  test('can toggle animated on and off across renders', async () => {
    const onAnimationsStart = jest.fn();
    const { rerender } = await render(
      <NumberFlow value={1} animated={false} onAnimationsStart={onAnimationsStart} />
    );

    await rerender(<NumberFlow value={2} animated onAnimationsStart={onAnimationsStart} />);
    await rerender(<NumberFlow value={3} animated onAnimationsStart={onAnimationsStart} />);
    await rerender(<NumberFlow value={4} animated={false} onAnimationsStart={onAnimationsStart} />);

    expect(onAnimationsStart).toHaveBeenCalledTimes(1);
  });

  test('does not animate when the system prefers reduced motion', async () => {
    mockReducedMotion.value = true;
    const onAnimationsStart = jest.fn();
    const { rerender } = await render(<NumberFlow value={1} onAnimationsStart={onAnimationsStart} />);

    await rerender(<NumberFlow value={2} onAnimationsStart={onAnimationsStart} />);

    expect(onAnimationsStart).not.toHaveBeenCalled();
  });

  test('ignores reduced motion when respectMotionPreference is false', async () => {
    mockReducedMotion.value = true;
    const onAnimationsStart = jest.fn();
    const { rerender } = await render(
      <NumberFlow value={1} respectMotionPreference={false} onAnimationsStart={onAnimationsStart} />
    );

    await rerender(<NumberFlow value={2} respectMotionPreference={false} onAnimationsStart={onAnimationsStart} />);

    expect(onAnimationsStart).toHaveBeenCalledTimes(1);
  });

  test('lets the continuous plugin spin unchanged lower digits a full turn', async () => {
    const { rerender } = await render(<NumberFlow value={10} plugins={[continuous]} testID="flow" />);
    await layoutColumn('integer:0');

    await rerender(<NumberFlow value={20} plugins={[continuous]} testID="flow" />);
    await act(() => {
      jest.advanceTimersByTime(300);
    });

    // Mid-spin the ones column has left its resting slot even though it is still 0.
    const midway = getAnimatedStyle(screen.getByTestId(glyphId('integer:0', 0)));
    expect(midway.transform[0]?.translateY).not.toBe(0);
  });
});
