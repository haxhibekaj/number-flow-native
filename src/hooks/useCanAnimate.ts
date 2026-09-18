import { useReducedMotion } from 'react-native-reanimated';

type Options = { respectMotionPreference?: boolean };

/** Whether NumberFlow will animate, taking the OS reduce-motion setting into account. */
export function useCanAnimate({ respectMotionPreference = true }: Options = {}): boolean {
  const prefersReducedMotion = useReducedMotion();
  return !respectMotionPreference || !prefersReducedMotion;
}
