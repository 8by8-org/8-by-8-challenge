import type { RefObject } from 'react';

/**
 * Returns `true` when the menu is scrolled all the way to the bottom.
 *
 * @returns A `boolean` indicating whether or not the menu is scrolled all the
 * way to the bottom.
 */
export function isMenuScrolledToBottom(menuRef: RefObject<HTMLMenuElement>) {
  return (
    !!menuRef.current &&
    Math.ceil(menuRef.current.scrollHeight - menuRef.current.scrollTop) ===
      menuRef.current.clientHeight
  );
}
