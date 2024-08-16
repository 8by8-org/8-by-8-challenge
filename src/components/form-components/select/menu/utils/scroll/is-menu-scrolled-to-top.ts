import type { RefObject } from 'react';

/**
 * Returns `true` when the menu is scrolled all the way to the top.
 *
 * @returns A `boolean` indicating whether or not the menu is scrolled all the
 * way to the top.
 */
export function isMenuScrolledToTop(menuRef: RefObject<HTMLMenuElement>) {
  return !!menuRef.current && menuRef.current.scrollTop === 0;
}
