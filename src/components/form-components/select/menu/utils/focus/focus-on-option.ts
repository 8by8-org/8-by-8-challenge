import { correctScrollIfOptionIsHidden } from '../scroll';
import type { RefObject } from 'react';

interface FocusOnOptionParams {
  optionIndex: number;
  optionCount: number;
  scrollUpButtonRef: RefObject<HTMLButtonElement>;
  scrollDownButtonRef: RefObject<HTMLButtonElement>;
  menuRef: RefObject<HTMLMenuElement>;
}

/**
 * Focuses on an option within the menu by its index.
 *
 * @param params - {@link FocusOnOptionParams}
 * @remarks
 * If the provided index is `0` or `optionCount - 1`, the menu will be scrolled
 * directly to the top or bottom (respectively), guaranteeing that the
 * corresponding scroll button disappears.
 *
 * Otherwise, the option is scrolled into view and then scrolled further until
 * it is no longer hidden by a scroll button.
 */
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

    correctScrollIfOptionIsHidden({
      option,
      scrollUpButtonRef,
      scrollDownButtonRef,
      menuRef,
    });
  }

  option.focus({ preventScroll: true });
}
