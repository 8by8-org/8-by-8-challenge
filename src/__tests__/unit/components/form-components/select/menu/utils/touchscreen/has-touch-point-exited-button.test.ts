import { hasTouchPointExitedButton } from '@/components/form-components/select/menu/utils';
import { Builder } from 'builder-pattern';
import type { RefObject, Touch } from 'react';

describe('hasTouchPointExitedButton', () => {
  const buttonRect: DOMRect = {
    top: 50,
    bottom: 100,
    left: 50,
    right: 150,
    height: 50,
    width: 100,
    x: 50,
    y: 50,
    toJSON() {
      return this;
    },
  };

  let buttonRef: RefObject<HTMLButtonElement> = {
    current: Builder<HTMLButtonElement>()
      .getBoundingClientRect(() => {
        return buttonRect;
      })
      .build(),
  };

  it('returns false if the touch point is inside the button.', () => {
    const topLeft = Builder<Touch>()
      .clientX(buttonRect.left)
      .clientY(buttonRect.top)
      .build();

    const topRight = Builder<Touch>()
      .clientX(buttonRect.right)
      .clientY(buttonRect.top)
      .build();

    const bottomLeft = Builder<Touch>()
      .clientX(buttonRect.left)
      .clientY(buttonRect.bottom)
      .build();

    const bottomRight = Builder<Touch>()
      .clientX(buttonRect.right)
      .clientY(buttonRect.bottom)
      .build();

    const middle = Builder<Touch>()
      .clientX((buttonRect.right - buttonRect.left) / 2 + buttonRect.left)
      .clientY((buttonRect.bottom - buttonRect.top) / 2 + buttonRect.top)
      .build();

    const touchPoints = [topLeft, topRight, bottomLeft, bottomRight, middle];

    for (const touchPoint of touchPoints) {
      expect(hasTouchPointExitedButton(touchPoint, buttonRef)).toBe(false);
    }
  });

  it('returns true if the touch point is outside the button.', () => {
    const tooFarLeft = Builder<Touch>()
      .clientX(buttonRect.left - 1)
      .clientY((buttonRect.bottom - buttonRect.top) / 2 + buttonRect.top)
      .build();

    const tooFarRight = Builder<Touch>()
      .clientX(buttonRect.right + 1)
      .clientY((buttonRect.bottom - buttonRect.top) / 2 + buttonRect.top)
      .build();

    const tooFarUp = Builder<Touch>()
      .clientX((buttonRect.right - buttonRect.left) / 2 + buttonRect.left)
      .clientY(buttonRect.top - 1)
      .build();

    const tooFarDown = Builder<Touch>()
      .clientX((buttonRect.right - buttonRect.left) / 2 + buttonRect.left)
      .clientY(buttonRect.bottom + 1)
      .build();

    const touchPoints = [tooFarLeft, tooFarRight, tooFarUp, tooFarDown];

    for (const touchPoint of touchPoints) {
      expect(hasTouchPointExitedButton(touchPoint, buttonRef)).toBe(true);
    }
  });

  it('returns true if the current value of the button ref is null.', () => {
    const touchPoint = Builder<Touch>().clientX(0).clientY(0).build();

    buttonRef = {
      current: null,
    };

    expect(hasTouchPointExitedButton(touchPoint, buttonRef)).toBe(true);
  });
});
