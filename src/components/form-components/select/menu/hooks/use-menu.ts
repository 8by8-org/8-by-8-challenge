import {
  useRef,
  useState,
  useCallback,
  type RefObject,
  type MutableRefObject,
  type Dispatch,
  type SetStateAction,
} from 'react';
import * as utils from '../utils';
import type { FieldOfType } from 'fully-formed';
import type { Option } from '../../types/option';

interface UseMenuParams {
  options: Option[];
  comboboxRef: RefObject<HTMLInputElement>;
  field: FieldOfType<string>;
}

interface UseMenuReturnType {
  containerRef: RefObject<HTMLDivElement>;
  menuRef: RefObject<HTMLMenuElement>;
  scrollUpButtonRef: RefObject<HTMLButtonElement>;
  scrollDownButtonRef: RefObject<HTMLButtonElement>;
  isKeyboardNavigating: MutableRefObject<boolean>;
  scrollPosition: 'noscroll' | 'top' | 'middle' | 'bottom';
  setScrollPosition: Dispatch<
    SetStateAction<'noscroll' | 'top' | 'middle' | 'bottom'>
  >;
  openMenu: (
    indexOfOptionToReceiveFocus: number,
    openWithKeyboard: boolean,
  ) => void;
  closeMenu: () => void;
  closeMenuAndFocusOnCombobox: () => void;
  toggleMenu: (
    indexOfOptionToReceiveFocus: number,
    openWithKeyboard: boolean,
  ) => void;
  handleKeyboardInput: (key: string, optionIndex: number) => void;
  focusOnOption: (optionIndex: number) => void;
  isMenuScrollable: () => boolean;
  isMenuScrolledToTop: () => boolean;
  isMenuScrolledToBottom: () => boolean;
  startScrollingUp: () => void;
  startScrollingDown: () => void;
  stopScrolling: () => void;
}

export function useMenu({
  options,
  comboboxRef,
  field,
}: UseMenuParams): UseMenuReturnType {
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLMenuElement>(null);
  const scrollUpButtonRef = useRef<HTMLButtonElement>(null);
  const scrollDownButtonRef = useRef<HTMLButtonElement>(null);
  const isKeyboardNavigating = useRef<boolean>(false);
  const scrollInterval = useRef<ReturnType<typeof setInterval>>();
  const [scrollPosition, setScrollPosition] = useState<
    'noscroll' | 'top' | 'middle' | 'bottom'
  >('noscroll');

  const openMenu = useCallback(
    (indexOfOptionToReceiveFocus: number, openWithKeyboard: boolean) => {
      utils.openMenu({
        indexOfOptionToReceiveFocus,
        optionCount: options.length,
        openWithKeyboard,
        containerRef,
        comboboxRef,
        menuRef,
        scrollUpButtonRef,
        scrollDownButtonRef,
        isKeyboardNavigating,
        setScrollPosition,
      });
    },
    [comboboxRef, options.length],
  );

  const closeMenu = useCallback(() => {
    utils.closeMenu(containerRef);
  }, []);

  const closeMenuAndFocusOnCombobox = useCallback(() => {
    utils.closeMenuAndFocusOnCombobox({
      containerRef,
      comboboxRef,
    });
  }, [comboboxRef]);

  const toggleMenu = useCallback(
    (indexOfOptionToReceiveFocus: number, openWithKeyboard: boolean) => {
      utils.toggleMenu({
        indexOfOptionToReceiveFocus,
        optionCount: options.length,
        openWithKeyboard,
        containerRef,
        comboboxRef,
        menuRef,
        scrollUpButtonRef,
        scrollDownButtonRef,
        isKeyboardNavigating,
        setScrollPosition,
      });
    },
    [comboboxRef, options.length],
  );

  const handleKeyboardInput = useCallback(
    (key: string, optionIndex: number) => {
      utils.handleKeyboardInput({
        key,
        optionIndex,
        options,
        comboboxRef,
        containerRef,
        menuRef,
        scrollUpButtonRef,
        scrollDownButtonRef,
        scrollInterval,
        isKeyboardNavigating,
        field,
      });
    },
    [comboboxRef, field, options],
  );

  const focusOnOption = useCallback(
    (optionIndex: number) => {
      utils.focusOnOption({
        optionIndex,
        optionCount: options.length,
        scrollUpButtonRef,
        scrollDownButtonRef,
        menuRef,
      });
    },
    [options.length],
  );

  const isMenuScrollable = useCallback(() => {
    return utils.isMenuScrollable(menuRef);
  }, []);

  const isMenuScrolledToTop = useCallback(() => {
    return utils.isMenuScrolledToTop(menuRef);
  }, []);

  const isMenuScrolledToBottom = useCallback(() => {
    return utils.isMenuScrolledToBottom(menuRef);
  }, []);

  const startScrollingUp = useCallback(() => {
    utils.startScrollingUp({
      menuRef,
      scrollInterval,
    });
  }, []);

  const startScrollingDown = useCallback(() => {
    utils.startScrollingDown({
      menuRef,
      scrollInterval,
    });
  }, []);

  const stopScrolling = useCallback(() => {
    utils.stopScrolling(scrollInterval);
  }, []);

  return {
    containerRef,
    menuRef,
    scrollUpButtonRef,
    scrollDownButtonRef,
    isKeyboardNavigating,
    scrollPosition,
    setScrollPosition,
    openMenu,
    closeMenu,
    closeMenuAndFocusOnCombobox,
    toggleMenu,
    handleKeyboardInput,
    focusOnOption,
    isMenuScrollable,
    isMenuScrolledToTop,
    isMenuScrolledToBottom,
    startScrollingUp,
    startScrollingDown,
    stopScrolling,
  };
}
