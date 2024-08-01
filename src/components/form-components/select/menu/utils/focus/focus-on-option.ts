import { correctScrollIfOptionIsHidden } from '../scroll/correct-scroll-if-option-is-hidden';
import type { RefObject } from 'react';

interface FocusOnOptionParams {
  optionIndex: number;
  optionCount: number;
  scrollUpButtonRef: RefObject<HTMLButtonElement>;
  scrollDownButtonRef: RefObject<HTMLButtonElement>;
  menuRef: RefObject<HTMLMenuElement>;
}

export function focusOnOption({
  optionIndex,
  optionCount,
  scrollUpButtonRef,
  scrollDownButtonRef,
  menuRef,
}: FocusOnOptionParams) {
  if (optionIndex < 0 || optionIndex >= optionCount) return;

  const option = menuRef.current?.children[optionIndex] as HTMLElement;

  if (optionIndex === 0) {
    menuRef.current?.scrollTo({ top: 0 });
  } else if (optionIndex === optionCount - 1) {
    menuRef.current?.scrollTo({ top: menuRef.current.scrollHeight });
  } else {
    option.scrollIntoView({
      behavior: 'instant',
      block: 'nearest',
    });
    // make correction if element is hidden by scroll button
    correctScrollIfOptionIsHidden({
      option,
      scrollUpButtonRef,
      scrollDownButtonRef,
      menuRef,
    });
  }

  option.focus({ preventScroll: true });
}
