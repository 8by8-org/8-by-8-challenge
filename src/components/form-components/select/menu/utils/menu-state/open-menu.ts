import { focusOnOption } from '../focus';
import { isMenuScrollable } from '../scroll';
import { isMenuScrolledToTop } from '../scroll';
import { isMenuScrolledToBottom } from '../scroll';
import type {
  RefObject,
  MutableRefObject,
  Dispatch,
  SetStateAction,
} from 'react';

interface OpenMenuParams {
  indexOfOptionToReceiveFocus: number;
  optionCount: number;
  openWithKeyboard: boolean;
  containerRef: RefObject<HTMLDivElement>;
  comboboxRef: RefObject<HTMLInputElement>;
  menuRef: RefObject<HTMLMenuElement>;
  scrollUpButtonRef: RefObject<HTMLButtonElement>;
  scrollDownButtonRef: RefObject<HTMLButtonElement>;
  isKeyboardNavigating: MutableRefObject<boolean>;
  setScrollPosition: Dispatch<
    SetStateAction<'noscroll' | 'top' | 'middle' | 'bottom'>
  >;
}

/**
 * Opens the menu and focuses on the option at the provided index. If
 * `openWithKeyboard` is true, sets `isKeyboardNavigating.current` to `true`.
 */
export function openMenu({
  indexOfOptionToReceiveFocus,
  optionCount,
  openWithKeyboard,
  containerRef,
  comboboxRef,
  menuRef,
  scrollUpButtonRef,
  scrollDownButtonRef,
  isKeyboardNavigating,
  setScrollPosition,
}: OpenMenuParams) {
  if (containerRef.current && menuRef.current) {
    if (openWithKeyboard) {
      isKeyboardNavigating.current = true;
    }

    containerRef.current.classList.remove('hidden');

    focusOnOption({
      optionIndex: indexOfOptionToReceiveFocus,
      optionCount: optionCount,
      scrollUpButtonRef,
      scrollDownButtonRef,
      menuRef,
    });

    if (isMenuScrollable(menuRef)) {
      if (isMenuScrolledToTop(menuRef)) {
        setScrollPosition('top');
      } else if (isMenuScrolledToBottom(menuRef)) {
        setScrollPosition('bottom');
      } else {
        setScrollPosition('middle');
      }
    }

    comboboxRef.current?.setAttribute('aria-expanded', 'true');
  }
}
