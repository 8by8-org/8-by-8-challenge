import type { RefObject } from 'react';

export function closeMenu(containerRef: RefObject<HTMLDivElement>) {
  containerRef.current?.classList.add('hidden');
}
