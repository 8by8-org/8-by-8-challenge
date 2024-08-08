import {
  useRef,
  useState,
  useCallback,
  type RefObject,
  type MutableRefObject,
} from 'react';
import * as utils from '../utils';
import type { FieldOfType } from 'fully-formed';
import type { MenuControls } from './menu-controls';
import type { Option } from '../../types/option';

export interface UseMenuParams {
  /**
   * An array of options to be displayed inside the enclosing `Menu` component.
   */
  options: Option[];

  /**
   * A {@link RefObject} received from the parent `Select` component. The
   * `Select` component also passes this ref into a `Combobox` element, where it
   * is assigned to an element with the `combobox` role. The `Menu` component
   * may transfer focus to this element when it is closed.
   */
  comboboxRef: RefObject<HTMLInputElement>;

  /**
   * A {@link Field} whose value can be set by the menu.
   */
  field: FieldOfType<string>;
}

/**
 * Creates React refs, state variables and functions which can be used to
 * control a `Menu` component.
 *
 * @param params - {@link UseMenuParams}
 * @returns An object whose properties fall into one of three categories:
 * - {@link RefObject}s - These should be applied to the elements rendered by
 *   the enclosing `Menu` component in order to facilitate its control.
 * - {@link MutableRefObject}s, state variables and setState functions - Used to
 *   determine the appearance and state of the enclosing `Menu`.
 * - functions - Can be called by event listeners in order to perform actions
 *   such as opening the menu, focusing on a specific option, and more.
 */
export function useMenu({
  options,
  comboboxRef,
  field,
}: UseMenuParams): MenuControls {
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
    isMenuScrollable,
    isMenuScrolledToTop,
    isMenuScrolledToBottom,
    startScrollingUp,
    startScrollingDown,
    stopScrolling,
  };
}
