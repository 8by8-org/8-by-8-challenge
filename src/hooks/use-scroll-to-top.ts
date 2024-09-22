import { useEffect } from 'react';

/**
 * Scrolls to the top of the screen when the calling component mounts.
 */
export function useScrollToTop() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
}
