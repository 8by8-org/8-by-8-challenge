import type { MutableRefObject } from 'react';

export function stopScrolling(
  scrollInterval: MutableRefObject<ReturnType<typeof setInterval> | undefined>,
) {
  if (scrollInterval.current) {
    clearInterval(scrollInterval.current);
  }
}
