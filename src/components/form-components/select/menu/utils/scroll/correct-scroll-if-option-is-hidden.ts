import { RefObject } from 'react';

interface CorrectScrollIfOptionIsHiddenParams {
  option: HTMLElement;
  scrollUpButtonRef: RefObject<HTMLButtonElement>;
  scrollDownButtonRef: RefObject<HTMLButtonElement>;
  menuRef: RefObject<HTMLMenuElement>;
}

/**
 * Scrolls a focused option until it is no longer hidden by scroll buttons.
 */
export function correctScrollIfOptionIsHidden({
  option,
  scrollUpButtonRef,
  scrollDownButtonRef,
  menuRef,
}: CorrectScrollIfOptionIsHiddenParams) {
  if (scrollUpButtonRef.current) {
    const scrollUpBottom =
      scrollUpButtonRef.current.getBoundingClientRect().bottom;
    const optionTop = option.getBoundingClientRect().top;

    if (optionTop < scrollUpBottom) {
      const correction = optionTop - scrollUpBottom;
      menuRef.current?.scrollBy(0, correction);
    }
  }

  if (scrollDownButtonRef.current) {
    const scrollDownTop =
      scrollDownButtonRef.current.getBoundingClientRect().top;
    const optionBottom = option.getBoundingClientRect().bottom;

    if (optionBottom > scrollDownTop) {
      const correction = optionBottom - scrollDownTop;
      menuRef.current?.scrollBy(0, correction);
    }
  }
}
