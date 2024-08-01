import type { RefObject } from 'react';

/**
 * Closes the menu without returning focus to the element referenced by the
 * provided `comboboxRef`.
 */
export function closeMenu(containerRef: RefObject<HTMLDivElement>) {
  containerRef.current?.classList.add('hidden');
}
