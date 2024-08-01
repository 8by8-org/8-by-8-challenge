import type { RefObject } from 'react';

export function isMenuScrolledToBottom(menuRef: RefObject<HTMLMenuElement>) {
  return (
    !!menuRef.current &&
    Math.ceil(menuRef.current.scrollHeight - menuRef.current.scrollTop) ===
      menuRef.current.clientHeight
  );
}
