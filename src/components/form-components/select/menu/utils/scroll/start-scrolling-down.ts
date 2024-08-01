import { isMenuScrolledToBottom } from './is-menu-scrolled-to-bottom';
import type { RefObject, MutableRefObject } from 'react';

interface StartScrollingDownParams {
  menuRef: RefObject<HTMLMenuElement>;
  scrollInterval: MutableRefObject<ReturnType<typeof setInterval> | undefined>;
}

export function startScrollingDown({
  menuRef,
  scrollInterval,
}: StartScrollingDownParams) {
  if (scrollInterval.current) {
    clearInterval(scrollInterval.current);
  }

  scrollInterval.current = setInterval(() => {
    menuRef.current?.scrollBy(0, 5);

    if (isMenuScrolledToBottom(menuRef) && scrollInterval.current) {
      clearInterval(scrollInterval.current);
    }
  }, 10);
}
