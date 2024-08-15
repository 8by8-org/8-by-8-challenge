import { isMenuScrollable } from '@/components/form-components/select/menu/utils';
import { Builder } from 'builder-pattern';

describe('isMenuScrollable', () => {
  it('returns true if the menu is scrollable.', () => {
    const menuRef = {
      current: Builder<HTMLMenuElement>()
        .clientHeight(50)
        .scrollHeight(100)
        .build(),
    };

    expect(isMenuScrollable(menuRef)).toBe(true);
  });

  it('returns false if the menu not scrollable.', () => {
    const menuRef = {
      current: Builder<HTMLMenuElement>()
        .clientHeight(50)
        .scrollHeight(50)
        .build(),
    };

    expect(isMenuScrollable(menuRef)).toBe(false);
  });
});
