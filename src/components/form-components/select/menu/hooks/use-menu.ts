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
   * A field
   */
  field: FieldOfType<string>;
}

interface MenuControls {
  /**
   * A {@link RefObject} to be provided to the outermost container rendered by
   * the enclosing `Menu` component.
   */
  containerRef: RefObject<HTMLDivElement>;
  /**
   * A {@link RefObject} to be provided to the `<menu>` element rendered by the
   * enclosing `Menu` component.
   */
  menuRef: RefObject<HTMLMenuElement>;
  /**
   * A {@link RefObject} to be provided to a button rendered by the enclosing
   * `Menu` component whose purpose is to scroll the menu up.
   */
  scrollUpButtonRef: RefObject<HTMLButtonElement>;
  /**
   * A {@link RefObject} to be provided to a button rendered by the enclosing
   * `Menu` component whose purpose is to scroll the menu down.
   */
  scrollDownButtonRef: RefObject<HTMLButtonElement>;
  /**
   * A {@link MutableRefObject} of type `boolean` indicating whether the user is
   * using the keyboard to navigate the menu. This can be used to prevent
   * certain mouse events from activating when the user is scrolling through the
   * menu with the keyboard.
   */
  isKeyboardNavigating: MutableRefObject<boolean>;
  /**
   * A React state variable indicating whether the menu is not scrollable or
   * whether it is scrolled to the top, middle or bottom.
   */
  scrollPosition: 'noscroll' | 'top' | 'middle' | 'bottom';
  /**
   * A React setState function that sets the menu's current scroll position.
   */
  setScrollPosition: Dispatch<
    SetStateAction<'noscroll' | 'top' | 'middle' | 'bottom'>
  >;
  /**
   * Opens the menu and focuses on the option at the provided index. If
   * `openWithKeyboard` is true, sets `isKeyboardNavigating.current` to `true`.
   *
   * @param indexOfOptionToReceiveFocus
   * @param openWithKeyboard
   */
  openMenu: (
    indexOfOptionToReceiveFocus: number,
    openWithKeyboard: boolean,
  ) => void;
  /**
   * Closes the menu without returning focus to the element referenced by the
   * `comboboxRef` provided to the `useMenu` hook. Intended to be called when
   * the user clicks outside the `Select` component.
   */
  closeMenu: () => void;
  /**
   * Closes the menu and returns focus to the element referenced by the
   * `comboboxRef` provided to the `useMenu` hook.
   */
  closeMenuAndFocusOnCombobox: () => void;
  /**
   * Opens the menu if closed and closes the menu if opened. When the menu is
   * closed, focus is returned to the element referenced by the `comboboxRef`
   * provided to the `useMenu` hook.
   *
   * @param indexOfOptionToReceiveFocus
   * @param openWithKeyboard
   */
  toggleMenu: (
    indexOfOptionToReceiveFocus: number,
    openWithKeyboard: boolean,
  ) => void;
  /**
   * Handles keyboard input received while an option within the menu is in
   * focus.
   *
   * @param key - The key that was pressed.
   * @param optionIndex - The index of the option that received the keyboard
   * input.
   */
  handleKeyboardInput: (key: string, optionIndex: number) => void;
  /**
   * Focuses on an option within the menu by its index.
   *
   * @param optionIndex
   */
  focusOnOption: (optionIndex: number) => void;
  /**
   * Returns `true` when the height of the content of the menu is greater than
   * the maximum height of the menu.
   *
   * @returns A `boolean` indicating whether or not the menu can be
   * scrolled.
   */
  isMenuScrollable: () => boolean;
  /**
   * Returns `true` when the menu is scrolled all the way to the top.
   *
   * @returns A `boolean` indicating whether or not the menu is scrolled all the
   * way to the top.
   */
  isMenuScrolledToTop: () => boolean;
  /**
   * Returns `true` when the menu is scrolled all the way to the bottom.
   *
   * @returns A `boolean` indicating whether or not the menu is scrolled all the
   * way to the bottom.
   */
  isMenuScrolledToBottom: () => boolean;
  /**
   * Scrolls the menu up until either the top of the menu is reached or
   * `stopScrolling` is called.
   */
  startScrollingUp: () => void;
  /**
   * Scrolls the menu down until either the bottom of the menu is reached or
   * `stopScrolling` is called.
   */
  startScrollingDown: () => void;
  /**
   * Stops the menu from scrolling if `startScrollingUp` or `startScrollingDown`
   * was previously called.
   */
  stopScrolling: () => void;
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
