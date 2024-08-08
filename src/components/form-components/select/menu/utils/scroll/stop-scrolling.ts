import type { MutableRefObject } from 'react';

/**
 * Calls `clearInterval` with `scrollInterval.current` if it is defined.
 */
export function stopScrolling(
  scrollInterval: MutableRefObject<ReturnType<typeof setInterval> | undefined>,
) {
  if (scrollInterval.current) {
    clearInterval(scrollInterval.current);
  }
}
