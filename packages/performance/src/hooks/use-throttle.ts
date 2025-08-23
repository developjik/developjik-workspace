import { useRef, useCallback } from 'react';

/**
 * Throttle hook that limits the rate at which a function can fire
 * @param callback - The callback function to throttle
 * @param limit - The limit in milliseconds
 * @returns The throttled callback
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  limit: number
): T {
  const inThrottle = useRef<boolean>(false);
  const lastResult = useRef<ReturnType<T>>();

  const throttledCallback = useCallback(
    (...args: Parameters<T>) => {
      if (!inThrottle.current) {
        lastResult.current = callback(...args);
        inThrottle.current = true;
        setTimeout(() => {
          inThrottle.current = false;
        }, limit);
      }
      return lastResult.current;
    },
    [callback, limit]
  ) as T;

  return throttledCallback;
}

/**
 * Leading throttle hook that executes immediately on first call
 * @param callback - The callback function to throttle
 * @param limit - The limit in milliseconds
 * @returns The throttled callback
 */
export function useLeadingThrottle<T extends (...args: any[]) => any>(
  callback: T,
  limit: number
): T {
  const lastRan = useRef<number>(0);

  const throttledCallback = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastRan.current >= limit) {
        lastRan.current = now;
        return callback(...args);
      }
    },
    [callback, limit]
  ) as T;

  return throttledCallback;
}