import type { RefObject } from 'react';

export function isMenuScrolledToTop(menuRef: RefObject<HTMLMenuElement>) {
  return !!menuRef.current && menuRef.current.scrollTop === 0;
}
