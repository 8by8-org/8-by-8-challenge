import type {
  RefObject,
  MutableRefObject,
  Dispatch,
  SetStateAction,
} from 'react';

export interface MenuControls {
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
