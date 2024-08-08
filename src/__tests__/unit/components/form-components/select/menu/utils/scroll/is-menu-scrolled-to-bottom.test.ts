import { isMenuScrolledToBottom } from '@/components/form-components/select/menu/utils';
import { Builder } from 'builder-pattern';

describe('isMenuScrolledToBottom', () => {
  it('returns true if the menu is scrolled to the bottom.', () => {
    const menuRef = {
      current: Builder<HTMLMenuElement>()
        .clientHeight(50)
        .scrollHeight(100)
        .scrollTop(50)
        .build(),
    };

    expect(isMenuScrolledToBottom(menuRef)).toBe(true);
  });

  it('returns false if the menu not scrolled to the bottom.', () => {
    const menuRef = {
      current: Builder<HTMLMenuElement>()
        .clientHeight(0)
        .scrollHeight(50)
        .scrollTop(0)
        .build(),
    };

    while (menuRef.current.scrollTop < 50) {
      expect(isMenuScrolledToBottom(menuRef)).toBe(false);
      menuRef.current.scrollTop++;
    }
  });
});
