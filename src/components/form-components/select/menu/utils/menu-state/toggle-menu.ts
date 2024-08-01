import { openMenu } from './open-menu';
import { closeMenuAndFocusOnCombobox } from './close-menu-and-focus-on-combobox';
import type {
  RefObject,
  MutableRefObject,
  Dispatch,
  SetStateAction,
} from 'react';

interface ToggleMenuParams {
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

export function toggleMenu(params: ToggleMenuParams) {
  if (params.containerRef.current?.classList.contains('hidden')) {
    openMenu(params);
  } else {
    closeMenuAndFocusOnCombobox({
      containerRef: params.containerRef,
      comboboxRef: params.comboboxRef,
    });
  }
}
