import type { RefObject } from 'react';

/**
 * Returns `true` when the height of the content of the menu is greater than
 * the maximum height of the menu.
 *
 * @returns A `boolean` indicating whether or not the menu can be
 * scrolled.
 */
export function isMenuScrollable(menuRef: RefObject<HTMLMenuElement>) {
  return (
    !!menuRef.current &&
    menuRef.current.scrollHeight > menuRef.current.clientHeight
  );
}
