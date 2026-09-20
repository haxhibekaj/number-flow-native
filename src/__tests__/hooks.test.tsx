import { act, renderHook } from '@testing-library/react-native';
import { useReducedMotion } from 'react-native-reanimated';
import { useFormatter } from '../hooks/useFormatter';
import type { Format } from '../types';
import { useAnimationsLifecycle } from '../hooks/useAnimationsLifecycle';
import { useCanAnimate } from '../hooks/useCanAnimate';

jest.mock('react-native-reanimated', () => ({
  __esModule: true,
  ...jest.requireActual('react-native-reanimated'),
  useReducedMotion: jest.fn(() => false),
}));

describe('useFormatter', () => {
  test('returns the same formatter for structurally equal options', async () => {
    const { result, rerender } = await renderHook(
      ({ format }: { format: Format }) => useFormatter('en-US', format),
      { initialProps: { format: { style: 'percent' } } }
    );
    const first = result.current;

    await rerender({ format: { style: 'percent' } });

    expect(result.current).toBe(first);
  });

  test('returns a new formatter when options change', async () => {
    const { result, rerender } = await renderHook(
      ({ format }: { format: Format }) => useFormatter('en-US', format),
      { initialProps: { format: { style: 'percent' } } }
    );
    const first = result.current;

    await rerender({ format: { style: 'decimal' } });

    expect(result.current).not.toBe(first);
    expect(result.current.format(0.5)).toBe('0.5');
  });
});

describe('useAnimationsLifecycle', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  test('fires start once per burst and finish after the duration elapses', async () => {
    const onStart = jest.fn();
    const onFinish = jest.fn();
    const { result } = await renderHook(() =>
      useAnimationsLifecycle({
        duration: 500,
        onAnimationsStart: onStart,
        onAnimationsFinish: onFinish,
      })
    );

    await act(() => {
      result.current.notifyUpdate();
      result.current.notifyUpdate();
    });
    expect(onStart).toHaveBeenCalledTimes(1);

    await act(() => {
      jest.advanceTimersByTime(499);
    });
    expect(onFinish).not.toHaveBeenCalled();

    await act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(onFinish).toHaveBeenCalledTimes(1);
  });

  test('extends the finish deadline when a new update arrives mid-flight', async () => {
    const onFinish = jest.fn();
    const { result } = await renderHook(() =>
      useAnimationsLifecycle({ duration: 500, onAnimationsFinish: onFinish })
    );

    await act(() => result.current.notifyUpdate());
    await act(() => jest.advanceTimersByTime(400));
    await act(() => result.current.notifyUpdate());
    await act(() => jest.advanceTimersByTime(400));
    expect(onFinish).not.toHaveBeenCalled();

    await act(() => jest.advanceTimersByTime(100));
    expect(onFinish).toHaveBeenCalledTimes(1);
  });

  test('finishNow fires finish immediately only when animations are in flight', async () => {
    const onFinish = jest.fn();
    const { result } = await renderHook(() =>
      useAnimationsLifecycle({ duration: 500, onAnimationsFinish: onFinish })
    );

    await act(() => result.current.finishNow());
    expect(onFinish).not.toHaveBeenCalled();

    await act(() => result.current.notifyUpdate());
    await act(() => result.current.finishNow());
    expect(onFinish).toHaveBeenCalledTimes(1);

    await act(() => jest.advanceTimersByTime(1000));
    expect(onFinish).toHaveBeenCalledTimes(1);
  });

  test('uses the latest callbacks without re-subscribing', async () => {
    const first = jest.fn();
    const second = jest.fn();
    const { result, rerender } = await renderHook(
      ({ cb }: { cb: () => void }) =>
        useAnimationsLifecycle({ duration: 100, onAnimationsFinish: cb }),
      { initialProps: { cb: first } }
    );

    await act(() => result.current.notifyUpdate());
    await rerender({ cb: second });
    await act(() => jest.advanceTimersByTime(100));

    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
  });
});

describe('useCanAnimate', () => {
  test('is true when the system does not prefer reduced motion', async () => {
    jest.mocked(useReducedMotion).mockReturnValue(false);
    const { result } = await renderHook(() => useCanAnimate());

    expect(result.current).toBe(true);
  });

  test('is false under reduced motion unless the preference is ignored', async () => {
    jest.mocked(useReducedMotion).mockReturnValue(true);
    const respecting = await renderHook(() => useCanAnimate());
    const ignoring = await renderHook(() => useCanAnimate({ respectMotionPreference: false }));

    expect(respecting.result.current).toBe(false);
    expect(ignoring.result.current).toBe(true);
  });
});
