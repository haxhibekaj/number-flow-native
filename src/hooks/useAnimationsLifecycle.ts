import { useCallback, useEffect, useMemo, useRef } from 'react';

type Options = {
  /** How long after the last update the animations are considered finished. */
  duration: number;
  onAnimationsStart?: () => void;
  onAnimationsFinish?: () => void;
};

export type AnimationsLifecycle = {
  /** Call when an animated update begins. Starts or extends the in-flight window. */
  notifyUpdate: () => void;
  /** Ends the in-flight window immediately, e.g. when `animated` flips to false. */
  finishNow: () => void;
};

/**
 * Emits a single start event when animations begin and a single finish event
 * once no update has arrived for `duration` ms, mirroring NumberFlow's
 * `animationsstart` / `animationsfinish` events.
 */
export function useAnimationsLifecycle({
  duration,
  onAnimationsStart,
  onAnimationsFinish,
}: Options): AnimationsLifecycle {
  const callbacks = useRef({ onAnimationsStart, onAnimationsFinish });
  useEffect(() => {
    callbacks.current = { onAnimationsStart, onAnimationsFinish };
  }, [onAnimationsStart, onAnimationsFinish]);

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const finish = useCallback(() => {
    timer.current = null;
    callbacks.current.onAnimationsFinish?.();
  }, []);

  const notifyUpdate = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
    } else {
      callbacks.current.onAnimationsStart?.();
    }
    timer.current = setTimeout(finish, duration);
  }, [duration, finish]);

  const finishNow = useCallback(() => {
    if (!timer.current) return;
    clearTimeout(timer.current);
    finish();
  }, [finish]);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );

  return useMemo(() => ({ notifyUpdate, finishNow }), [notifyUpdate, finishNow]);
}
