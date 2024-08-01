import { isMenuScrolledToTop } from './is-menu-scrolled-to-top';
import { isMenuScrolledToBottom } from './is-menu-scrolled-to-bottom';
import type { RefObject } from 'react';

export function isMenuScrollable(menuRef: RefObject<HTMLMenuElement>) {
  return !(isMenuScrolledToTop(menuRef) && isMenuScrolledToBottom(menuRef));
}
