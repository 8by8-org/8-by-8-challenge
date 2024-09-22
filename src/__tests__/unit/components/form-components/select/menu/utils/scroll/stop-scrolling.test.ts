import {
  stopScrolling,
  startScrollingDown,
} from '@/components/form-components/select/menu/utils';
import { Builder } from 'builder-pattern';
import { MutableRefObject, RefObject } from 'react';

describe('stopScrolling', () => {
  let menuRef: RefObject<HTMLMenuElement>;
  let scrollInterval: MutableRefObject<
    ReturnType<typeof setInterval> | undefined
  >;

  beforeEach(() => {
    menuRef = {
      current: Builder<HTMLMenuElement>()
        .clientHeight(50)
        .scrollHeight(100)
        .scrollTop(0)
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

  it('stops the menu from scrolling.', () => {
    const spy = jest.spyOn(globalThis, 'clearInterval');
    startScrollingDown({ menuRef, scrollInterval });
    stopScrolling(scrollInterval);
    expect(spy).toHaveBeenCalledWith(scrollInterval.current);
  });
});
