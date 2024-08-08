import { correctScrollIfOptionIsHidden } from '@/components/form-components/select/menu/utils';
import { Builder } from 'builder-pattern';

describe('correctScrollIfOptionIsHidden', () => {
  it(`scrolls the menu by the amount that the option is hidden by the scroll up 
  button, if the option is hidden by the scroll up button.`, () => {
    const optionTop = 0;
    const optionBottom = 20;
    const scrollUpButtonBottom = 10;
    const scrollDownButtonTop = 100;
    const expectedCorrection = optionTop - scrollUpButtonBottom;

    const option = Builder<HTMLLIElement>()
      .getBoundingClientRect(() => {
        return Builder<DOMRect>().top(optionTop).bottom(optionBottom).build();
      })
      .build();

    const scrollUpButtonRef = {
      current: Builder<HTMLButtonElement>()
        .getBoundingClientRect(() => {
          return Builder<DOMRect>().bottom(scrollUpButtonBottom).build();
        })
        .build(),
    };

    const scrollDownButtonRef = {
      current: Builder<HTMLButtonElement>()
        .getBoundingClientRect(() => {
          return Builder<DOMRect>().top(scrollDownButtonTop).build();
        })
        .build(),
    };

    const menuRef = {
      current: Builder<HTMLMenuElement>().scrollBy(jest.fn()).build(),
    };

    correctScrollIfOptionIsHidden({
      option,
      scrollUpButtonRef,
      scrollDownButtonRef,
      menuRef,
    });

    expect(menuRef.current.scrollBy).toHaveBeenCalledWith(
      0,
      expectedCorrection,
    );
  });

  it(`scrolls the menu by the amount that the option is hidden by the scroll
  down button, if the option is hidden by the scroll down button.`, () => {
    const optionTop = 90;
    const optionBottom = 110;
    const scrollUpButtonBottom = 10;
    const scrollDownButtonTop = 100;
    const expectedCorrection = optionBottom - scrollDownButtonTop;

    const option = Builder<HTMLLIElement>()
      .getBoundingClientRect(() => {
        return Builder<DOMRect>().top(optionTop).bottom(optionBottom).build();
      })
      .build();

    const scrollUpButtonRef = {
      current: Builder<HTMLButtonElement>()
        .getBoundingClientRect(() => {
          return Builder<DOMRect>().bottom(scrollUpButtonBottom).build();
        })
        .build(),
    };

    const scrollDownButtonRef = {
      current: Builder<HTMLButtonElement>()
        .getBoundingClientRect(() => {
          return Builder<DOMRect>().top(scrollDownButtonTop).build();
        })
        .build(),
    };

    const menuRef = {
      current: Builder<HTMLMenuElement>().scrollBy(jest.fn()).build(),
    };

    correctScrollIfOptionIsHidden({
      option,
      scrollUpButtonRef,
      scrollDownButtonRef,
      menuRef,
    });

    expect(menuRef.current.scrollBy).toHaveBeenCalledWith(
      0,
      expectedCorrection,
    );
  });

  it(`does not scroll the menu if the option is not hidden.`, () => {
    const optionTop = 50;
    const optionBottom = 70;
    const scrollUpButtonBottom = 10;
    const scrollDownButtonTop = 100;

    const option = Builder<HTMLLIElement>()
      .getBoundingClientRect(() => {
        return Builder<DOMRect>().top(optionTop).bottom(optionBottom).build();
      })
      .build();

    const scrollUpButtonRef = {
      current: Builder<HTMLButtonElement>()
        .getBoundingClientRect(() => {
          return Builder<DOMRect>().bottom(scrollUpButtonBottom).build();
        })
        .build(),
    };

    const scrollDownButtonRef = {
      current: Builder<HTMLButtonElement>()
        .getBoundingClientRect(() => {
          return Builder<DOMRect>().top(scrollDownButtonTop).build();
        })
        .build(),
    };

    const menuRef = {
      current: Builder<HTMLMenuElement>().scrollBy(jest.fn()).build(),
    };

    correctScrollIfOptionIsHidden({
      option,
      scrollUpButtonRef,
      scrollDownButtonRef,
      menuRef,
    });

    expect(menuRef.current.scrollBy).not.toHaveBeenCalled();
  });
});
