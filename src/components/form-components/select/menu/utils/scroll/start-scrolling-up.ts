import { isMenuScrolledToTop } from './is-menu-scrolled-to-top';
import type { RefObject, MutableRefObject } from 'react';

interface StartScrollingUpParams {
  menuRef: RefObject<HTMLMenuElement>;
  scrollInterval: MutableRefObject<ReturnType<typeof setInterval> | undefined>;
}

/**
 * Scrolls the menu up until either the top of the menu is reached or
 * `scrollInterval.current` is cleared.
 */
export function startScrollingUp({
  menuRef,
  scrollInterval,
}: StartScrollingUpParams) {
  if (scrollInterval.current) {
    clearInterval(scrollInterval.current);
  }

  scrollInterval.current = setInterval(() => {
    menuRef.current?.scrollBy(0, -5);

    if (isMenuScrolledToTop(menuRef) && scrollInterval.current) {
      clearInterval(scrollInterval.current);
    }
  }, 10);
}
