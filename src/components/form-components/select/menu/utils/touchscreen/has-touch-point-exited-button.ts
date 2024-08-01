import type { RefObject, Touch } from 'react';

/**
 * Returns true if the location of the `touchPoint` it received is outside
 * the button with the `buttonRef` it received. Also returns `true` if the
 * button is no longer rendered.
 *
 * @param touchPoint - A {@link Touch}.
 * @param buttonRef - A {@link RefObject} that has been provided to a button.
 *
 * @returns - A `boolean` indicating whether or not the `touchPoint` is outside
 * the button.
 */
export function hasTouchPointExitedButton(
  touchPoint: Touch,
  buttonRef: RefObject<HTMLButtonElement>,
) {
  if (!buttonRef.current) return true;

  const buttonRect = buttonRef.current.getBoundingClientRect();

  return (
    touchPoint.clientX < buttonRect.left ||
    touchPoint.clientX > buttonRect.right ||
    touchPoint.clientY < buttonRect.top ||
    touchPoint.clientY > buttonRect.bottom
  );
}
