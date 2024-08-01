import { isMenuScrolledToTop } from './is-menu-scrolled-to-top';
import type { RefObject, MutableRefObject } from 'react';

interface StartScrollingUpParams {
  menuRef: RefObject<HTMLMenuElement>;
  scrollInterval: MutableRefObject<ReturnType<typeof setInterval> | undefined>;
}

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
