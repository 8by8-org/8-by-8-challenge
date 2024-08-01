import type { RefObject, Touch } from 'react';

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
