import { isMenuScrolledToTop } from '@/components/form-components/select/menu/utils';
import { Builder } from 'builder-pattern';

describe('isMenuScrolledToTop', () => {
  it('returns true if the menu is scrolled to the top.', () => {
    const menuRef = {
      current: Builder<HTMLMenuElement>().scrollTop(0).build(),
    };

    expect(isMenuScrolledToTop(menuRef)).toBe(true);
  });

  it('returns false if the menu not scrolled to the top.', () => {
    const menuRef = {
      current: Builder<HTMLMenuElement>().scrollTop(50).build(),
    };

    while (menuRef.current.scrollTop > 0) {
      expect(isMenuScrolledToTop(menuRef)).toBe(false);
      menuRef.current.scrollTop--;
    }
  });
});
