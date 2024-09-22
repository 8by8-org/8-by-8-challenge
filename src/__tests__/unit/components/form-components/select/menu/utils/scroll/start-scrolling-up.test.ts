import { startScrollingUp } from '@/components/form-components/select/menu/utils';
import { Builder } from 'builder-pattern';
import { MutableRefObject, RefObject } from 'react';

describe('startScrollingUp', () => {
  let menuRef: RefObject<HTMLMenuElement>;
  let scrollInterval: MutableRefObject<
    ReturnType<typeof setInterval> | undefined
  >;

  beforeEach(() => {
    menuRef = {
      current: Builder<HTMLMenuElement>()
        .clientHeight(50)
        .scrollHeight(100)
        .scrollTop(50)
        .scrollLeft(0)
        .scrollBy(((x: number, y: number) => {
          menuRef.current!.scrollLeft += x;
          menuRef.current!.scrollTop += y;
        }) as HTMLMenuElement['scrollBy'])
        .build(),
    };

    scrollInterval = {
      current: undefined,
    };

    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('scrolls the menu up until it reaches the top.', () => {
    startScrollingUp({ menuRef, scrollInterval });

    jest.advanceTimersByTime(10000);

    expect(menuRef.current!.scrollTop).toBe(0);
  });

  it('stops scrolling before starting.', () => {
    const spy = jest.spyOn(globalThis, 'clearInterval');

    startScrollingUp({ menuRef, scrollInterval });
    const firstInterval = scrollInterval.current;

    startScrollingUp({ menuRef, scrollInterval });
    expect(spy).toHaveBeenCalledWith(firstInterval);
  });
});
