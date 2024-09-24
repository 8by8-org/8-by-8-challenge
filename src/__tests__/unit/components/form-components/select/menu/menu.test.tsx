import { Select } from '@/components/form-components/select';
import {
  render,
  screen,
  cleanup,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import userEvent, { UserEvent } from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Field } from 'fully-formed';
import { mockScrollMethods } from '@/utils/test/mock-scroll-methods';
import * as scrollUtils from '../../../../../../components/form-components/select/menu/utils/scroll';
import * as touchScreenUtils from '../../../../../../components/form-components/select/menu/utils/touchscreen';

jest.mock(
  '../../../../../../components/form-components/select/menu/utils/scroll',
  () => ({
    __esModule: true,
    ...jest.requireActual(
      '../../../../../../components/form-components/select/menu/utils/scroll',
    ),
  }),
);

jest.mock(
  '../../../../../../components/form-components/select/menu/utils/touchscreen',
  () => ({
    __esModule: true,
    ...jest.requireActual(
      '../../../../../../components/form-components/select/menu/utils/touchscreen',
    ),
  }),
);

describe('Menu', () => {
  let user: UserEvent;

  beforeEach(() => {
    mockScrollMethods();
    user = userEvent.setup();
  });

  afterEach(cleanup);

  it(`sets the value of the field when the user clicks on an option in the 
  menu.`, async () => {
    const favoriteColor = new Field({
      name: 'favoriteColor',
      defaultValue: '',
    });

    const options = [
      {
        text: 'Red',
        value: 'red',
      },
      {
        text: 'Green',
        value: 'green',
      },
      {
        text: 'Blue',
        value: 'blue',
      },
    ];

    render(
      <Select label="Favorite Color" field={favoriteColor} options={options} />,
    );

    const combobox = screen.getByRole('combobox');
    await user.click(combobox);

    const optionElements = screen.getAllByRole('option');
    await user.click(optionElements[2]);

    expect(favoriteColor.state.value).toBe(options[2].value);
  });

  it(`sets the value of the field and restores focus to the combobox when the 
  user presses Enter on an option in the menu.`, async () => {
    const favoriteColor = new Field({
      name: 'favoriteColor',
      defaultValue: '',
    });

    const options = [
      {
        text: 'Red',
        value: 'red',
      },
      {
        text: 'Green',
        value: 'green',
      },
      {
        text: 'Blue',
        value: 'blue',
      },
    ];

    render(
      <Select label="Favorite Color" field={favoriteColor} options={options} />,
    );

    const combobox = screen.getByRole('combobox');
    act(() => combobox.focus());
    await user.keyboard('g');
    await user.keyboard('{Enter}');

    expect(favoriteColor.state.value).toBe(options[1].value);
    expect(combobox).toHaveFocus();
  });

  it(`sets the value of the field and restores focus to the combobox when the 
  user presses Tab on an option in the menu.`, async () => {
    const favoriteColor = new Field({
      name: 'favoriteColor',
      defaultValue: '',
    });

    const options = [
      {
        text: 'Red',
        value: 'red',
      },
      {
        text: 'Green',
        value: 'green',
      },
      {
        text: 'Blue',
        value: 'blue',
      },
    ];

    render(
      <Select label="Favorite Color" field={favoriteColor} options={options} />,
    );

    const combobox = screen.getByRole('combobox');
    act(() => combobox.focus());
    await user.keyboard('g');
    await user.keyboard('{Tab}');

    expect(favoriteColor.state.value).toBe(options[1].value);
    expect(combobox).toHaveFocus();
  });

  it(`closes the menu and restores focus to the combobox without changing the 
  value of the field when the user presses the Escape key while an option is 
  selected.`, async () => {
    const favoriteColor = new Field({
      name: 'favoriteColor',
      defaultValue: '',
    });

    render(
      <Select
        label="Favorite Color"
        field={new Field({ name: 'favoriteColor', defaultValue: '' })}
        options={[
          {
            text: 'Red',
            value: 'red',
          },
          {
            text: 'Green',
            value: 'green',
          },
          {
            text: 'Blue',
            value: 'blue',
          },
        ]}
      />,
    );

    const menuContainer = document.getElementsByClassName('menu_container')[0];
    expect(menuContainer.classList).toContain('hidden');

    const combobox = screen.getByRole('combobox');
    await user.click(combobox);

    const menuOptions = screen.getAllByRole('option');
    expect(menuOptions[0]).toHaveFocus();

    await user.keyboard('{Escape}');
    expect(favoriteColor.state.value).toBe('');
  });

  it(`navigates to the next option in the menu when the user presses the 
  ArrowDown key while an option is in focus, stopping on the last option if 
  the user continues to press the ArrowDown key.`, async () => {
    const options = [
      {
        text: 'Red',
        value: 'red',
      },
      {
        text: 'Green',
        value: 'green',
      },
      {
        text: 'Blue',
        value: 'blue',
      },
      {
        text: 'Yellow',
        value: 'yellow',
      },
      {
        text: 'Purple',
        value: 'purple',
      },
      {
        text: 'Orange',
        value: 'orange',
      },
    ];

    render(
      <Select
        label="Favorite Color"
        field={new Field({ name: 'favoriteColor', defaultValue: '' })}
        options={options}
      />,
    );

    const combobox = screen.getByRole('combobox');
    const menuOptions = screen.getAllByRole('option');
    act(() => combobox.focus());

    for (let i = 0; i <= options.length + 10; i++) {
      await user.keyboard('{ArrowDown}');
      const focusedOptionIndex = Math.min(i, options.length - 1);
      expect(menuOptions[focusedOptionIndex]).toHaveFocus();
    }
  });

  it(`navigates to the previous option in the menu when the user presses the 
    ArrowUp key while an option is in focus, stopping on the first option if 
    the user continues to press the ArrowUp key.`, async () => {
    const options = [
      {
        text: 'Red',
        value: 'red',
      },
      {
        text: 'Green',
        value: 'green',
      },
      {
        text: 'Blue',
        value: 'blue',
      },
      {
        text: 'Yellow',
        value: 'yellow',
      },
      {
        text: 'Purple',
        value: 'purple',
      },
      {
        text: 'Orange',
        value: 'orange',
      },
    ];

    render(
      <Select
        label="Favorite Color"
        field={new Field({ name: 'favoriteColor', defaultValue: '' })}
        options={options}
      />,
    );

    const combobox = screen.getByRole('combobox');
    const menuOptions = screen.getAllByRole('option');
    act(() => combobox.focus());

    for (let i = options.length - 1; i >= -10; i--) {
      await user.keyboard('{ArrowUp}');
      const focusedOptionIndex = Math.max(i, 0);
      expect(menuOptions[focusedOptionIndex]).toHaveFocus();
    }
  });

  it(`navigates to the first option beginning with a given character when the 
  user presses the corresponding key while any option in the menu has 
  focus.`, async () => {
    const options = [
      {
        text: 'Red',
        value: 'red',
      },
      {
        text: 'Green',
        value: 'green',
      },
      {
        text: 'Blue',
        value: 'blue',
      },
      {
        text: 'Yellow',
        value: 'yellow',
      },
      {
        text: 'Purple',
        value: 'purple',
      },
      {
        text: 'Orange',
        value: 'orange',
      },
    ];

    render(
      <Select
        label="Favorite Color"
        field={new Field({ name: 'favoriteColor', defaultValue: '' })}
        options={options}
      />,
    );

    const combobox = screen.getByRole('combobox');
    const menuOptions = screen.getAllByRole('option');
    act(() => combobox.focus());

    for (let i = 0; i < options.length; i++) {
      await user.keyboard(options[i].value[0]);
      const focusedOptionIndex = i;
      expect(menuOptions[focusedOptionIndex]).toHaveFocus();
    }
  });

  it(`does not focus on an option when the mouseenter event is fired but the 
  use is navigating with the keyboard.`, async () => {
    const options = [
      {
        text: 'Red',
        value: 'red',
      },
      {
        text: 'Green',
        value: 'green',
      },
      {
        text: 'Blue',
        value: 'blue',
      },
    ];

    render(
      <Select
        label="Select an option"
        field={new Field({ name: 'favoriteColor', defaultValue: '' })}
        options={options}
      />,
    );

    const combobox = screen.getByRole('combobox');
    const menuOptions = screen.getAllByRole('option');
    act(() => combobox.focus());
    await user.keyboard(options[0].value[0]);
    expect(menuOptions[0]).toHaveFocus();

    /*
      fire the mouseenter event on the last option while the user is navigating 
      with the keyboard. This can happen when keyboard navigation causes the 
      menu to scroll and the mouse is hovering over the menu. The option focused
      on due to keyboard input should still have focus.
    */
    fireEvent.mouseEnter(menuOptions[2]);
    expect(menuOptions[0]).toHaveFocus();
  });

  it(`hides the scroll up buttom and shows the scroll down button when the
  menu is scrolled and reaches the top.`, async () => {
    let isMenuScrolledToTop = false;
    let isMenuScrolledToBottom = true;

    const isMenuScrollableSpy = jest
      .spyOn(scrollUtils, 'isMenuScrollable')
      .mockImplementation(() => true);

    const isMenuScrolledToTopSpy = jest
      .spyOn(scrollUtils, 'isMenuScrolledToTop')
      .mockImplementation(() => isMenuScrolledToTop);

    const isMenuScrolledToBottomSpy = jest
      .spyOn(scrollUtils, 'isMenuScrolledToBottom')
      .mockImplementation(() => isMenuScrolledToBottom);

    render(
      <Select
        label="Select an option"
        field={new Field({ name: 'favoriteColor', defaultValue: '' })}
        options={[
          {
            text: 'Red',
            value: 'red',
          },
          {
            text: 'Green',
            value: 'green',
          },
          {
            text: 'Blue',
            value: 'blue',
          },
        ]}
      />,
    );

    await user.click(screen.getByRole('combobox'));
    await waitFor(() =>
      expect(screen.queryByAltText('Scroll up')).toBeInTheDocument(),
    );
    expect(screen.queryByAltText('Scroll down')).not.toBeInTheDocument();

    isMenuScrolledToTop = true;
    isMenuScrolledToBottom = false;

    const menu = screen.getByRole('listbox');
    fireEvent.scroll(menu);

    await waitFor(() => {
      expect(screen.queryByAltText('Scroll up')).not.toBeInTheDocument();
      expect(screen.queryByAltText('Scroll down')).toBeInTheDocument();
    });

    isMenuScrollableSpy.mockRestore();
    isMenuScrolledToTopSpy.mockRestore();
    isMenuScrolledToBottomSpy.mockRestore();
  });

  it(`hides the scroll down button and shows the scroll up button when the
  menu is scrolled and reaches the bottom.`, async () => {
    let isMenuScrolledToTop = true;
    let isMenuScrolledToBottom = false;

    const isMenuScrollableSpy = jest
      .spyOn(scrollUtils, 'isMenuScrollable')
      .mockImplementation(() => true);

    const isMenuScrolledToTopSpy = jest
      .spyOn(scrollUtils, 'isMenuScrolledToTop')
      .mockImplementation(() => isMenuScrolledToTop);

    const isMenuScrolledToBottomSpy = jest
      .spyOn(scrollUtils, 'isMenuScrolledToBottom')
      .mockImplementation(() => isMenuScrolledToBottom);

    render(
      <Select
        label="Select an option"
        field={new Field({ name: 'favoriteColor', defaultValue: '' })}
        options={[
          {
            text: 'Red',
            value: 'red',
          },
          {
            text: 'Green',
            value: 'green',
          },
          {
            text: 'Blue',
            value: 'blue',
          },
        ]}
      />,
    );

    await user.click(screen.getByRole('combobox'));
    await waitFor(() =>
      expect(screen.queryByAltText('Scroll down')).toBeInTheDocument(),
    );
    expect(screen.queryByAltText('Scroll up')).not.toBeInTheDocument();

    isMenuScrolledToTop = false;
    isMenuScrolledToBottom = true;

    const menu = screen.getByRole('listbox');
    fireEvent.scroll(menu);

    await waitFor(() => {
      expect(screen.queryByAltText('Scroll down')).not.toBeInTheDocument();
      expect(screen.queryByAltText('Scroll up')).toBeInTheDocument();
    });

    isMenuScrollableSpy.mockRestore();
    isMenuScrolledToTopSpy.mockRestore();
    isMenuScrolledToBottomSpy.mockRestore();
  });

  it(`shows both scroll buttons when the menu is scrolled without reaching the
  top or bottom.`, async () => {
    let isMenuScrolledToTop = true;

    const isMenuScrollableSpy = jest
      .spyOn(scrollUtils, 'isMenuScrollable')
      .mockImplementation(() => true);

    const isMenuScrolledToTopSpy = jest
      .spyOn(scrollUtils, 'isMenuScrolledToTop')
      .mockImplementation(() => isMenuScrolledToTop);

    const isMenuScrolledToBottomSpy = jest
      .spyOn(scrollUtils, 'isMenuScrolledToBottom')
      .mockImplementation(() => false);

    render(
      <Select
        label="Select an option"
        field={new Field({ name: 'favoriteColor', defaultValue: '' })}
        options={[
          {
            text: 'Red',
            value: 'red',
          },
          {
            text: 'Green',
            value: 'green',
          },
          {
            text: 'Blue',
            value: 'blue',
          },
        ]}
      />,
    );

    await user.click(screen.getByRole('combobox'));
    await waitFor(() =>
      expect(screen.queryByAltText('Scroll down')).toBeInTheDocument(),
    );
    expect(screen.queryByAltText('Scroll up')).not.toBeInTheDocument();

    isMenuScrolledToTop = false;

    const menu = screen.getByRole('listbox');
    fireEvent.scroll(menu);

    await waitFor(() => {
      expect(screen.queryByAltText('Scroll up')).toBeInTheDocument();
    });
    expect(screen.queryByAltText('Scroll down')).toBeInTheDocument();

    isMenuScrollableSpy.mockRestore();
    isMenuScrolledToTopSpy.mockRestore();
    isMenuScrolledToBottomSpy.mockRestore();
  });

  it(`calls startScrollingUp when the mouse enters the scroll up button and the 
  user is not navigating with the keyboard. stopScrolling is then called when 
  the mouse leaves the button.`, async () => {
    const startScrollingUpSpy = jest
      .spyOn(scrollUtils, 'startScrollingUp')
      .mockImplementation(jest.fn());

    const stopScrollingSpy = jest
      .spyOn(scrollUtils, 'stopScrolling')
      .mockImplementation(jest.fn());

    const isMenuScrollableSpy = jest
      .spyOn(scrollUtils, 'isMenuScrollable')
      .mockImplementation(() => true);

    const isMenuScrolledToTopSpy = jest
      .spyOn(scrollUtils, 'isMenuScrolledToTop')
      .mockImplementation(() => false);

    const isMenuScrolledToBottomSpy = jest
      .spyOn(scrollUtils, 'isMenuScrolledToBottom')
      .mockImplementation(() => false);

    render(
      <Select
        label="Select an option"
        field={new Field({ name: 'favoriteColor', defaultValue: '' })}
        options={[
          {
            text: 'Red',
            value: 'red',
          },
          {
            text: 'Green',
            value: 'green',
          },
          {
            text: 'Blue',
            value: 'blue',
          },
        ]}
      />,
    );

    await user.click(screen.getByRole('combobox'));
    await waitFor(() =>
      expect(screen.queryByAltText('Scroll up')).toBeInTheDocument(),
    );

    const scrollUpButton = screen.getByAltText('Scroll up');
    fireEvent.mouseEnter(scrollUpButton);
    expect(startScrollingUpSpy).toHaveBeenCalledTimes(1);

    fireEvent.mouseLeave(scrollUpButton);
    expect(stopScrollingSpy).toHaveBeenCalledTimes(1);

    startScrollingUpSpy.mockRestore();
    stopScrollingSpy.mockRestore();
    isMenuScrollableSpy.mockRestore();
    isMenuScrolledToTopSpy.mockRestore();
    isMenuScrolledToBottomSpy.mockRestore();
  });

  it(`does not call startScrollingUp when the mouse enters the
  scroll up button and the user is navigating with the keyboard.`, async () => {
    const startScrollingUpSpy = jest
      .spyOn(scrollUtils, 'startScrollingUp')
      .mockImplementation(jest.fn());

    const isMenuScrollableSpy = jest
      .spyOn(scrollUtils, 'isMenuScrollable')
      .mockImplementation(() => true);

    const isMenuScrolledToTopSpy = jest
      .spyOn(scrollUtils, 'isMenuScrolledToTop')
      .mockImplementation(() => false);

    const isMenuScrolledToBottomSpy = jest
      .spyOn(scrollUtils, 'isMenuScrolledToBottom')
      .mockImplementation(() => false);

    render(
      <Select
        label="Select an option"
        field={new Field({ name: 'favoriteColor', defaultValue: '' })}
        options={[
          {
            text: 'Red',
            value: 'red',
          },
          {
            text: 'Green',
            value: 'green',
          },
          {
            text: 'Blue',
            value: 'blue',
          },
        ]}
      />,
    );

    const combobox = screen.getByRole('combobox');
    act(() => combobox.focus());
    await user.keyboard('{Enter}');
    await waitFor(() =>
      expect(screen.queryByAltText('Scroll up')).toBeInTheDocument(),
    );

    const scrollUpButton = screen.getByAltText('Scroll up');
    fireEvent.mouseEnter(scrollUpButton);

    expect(startScrollingUpSpy).not.toHaveBeenCalled();

    startScrollingUpSpy.mockRestore();
    isMenuScrollableSpy.mockRestore();
    isMenuScrolledToTopSpy.mockRestore();
    isMenuScrolledToBottomSpy.mockRestore();
  });

  it(`calls startScrollingUp when the mousedown event of the scroll up button is 
  fired, and then calls stopScrolling when the mouseup event is 
  fired.`, async () => {
    const startScrollingUpSpy = jest
      .spyOn(scrollUtils, 'startScrollingUp')
      .mockImplementation(jest.fn());

    const stopScrollingSpy = jest
      .spyOn(scrollUtils, 'stopScrolling')
      .mockImplementation(jest.fn());

    const isMenuScrollableSpy = jest
      .spyOn(scrollUtils, 'isMenuScrollable')
      .mockImplementation(() => true);

    const isMenuScrolledToTopSpy = jest
      .spyOn(scrollUtils, 'isMenuScrolledToTop')
      .mockImplementation(() => false);

    const isMenuScrolledToBottomSpy = jest
      .spyOn(scrollUtils, 'isMenuScrolledToBottom')
      .mockImplementation(() => false);

    render(
      <Select
        label="Select an option"
        field={new Field({ name: 'favoriteColor', defaultValue: '' })}
        options={[
          {
            text: 'Red',
            value: 'red',
          },
          {
            text: 'Green',
            value: 'green',
          },
          {
            text: 'Blue',
            value: 'blue',
          },
        ]}
      />,
    );

    await user.click(screen.getByRole('combobox'));
    await waitFor(() =>
      expect(screen.queryByAltText('Scroll up')).toBeInTheDocument(),
    );

    const scrollUpButton = screen.getByAltText('Scroll up');
    fireEvent.mouseDown(scrollUpButton);
    expect(startScrollingUpSpy).toHaveBeenCalledTimes(1);

    fireEvent.mouseUp(scrollUpButton);
    expect(stopScrollingSpy).toHaveBeenCalledTimes(1);

    startScrollingUpSpy.mockRestore();
    stopScrollingSpy.mockRestore();
    isMenuScrollableSpy.mockRestore();
    isMenuScrolledToTopSpy.mockRestore();
    isMenuScrolledToBottomSpy.mockRestore();
  });

  it(`calls startScrollingUp when the touchstart event of the scroll up button 
  is fired, and then calls stopScrolling when the touchend event is 
  fired.`, async () => {
    const startScrollingUpSpy = jest
      .spyOn(scrollUtils, 'startScrollingUp')
      .mockImplementation(jest.fn());

    const stopScrollingSpy = jest
      .spyOn(scrollUtils, 'stopScrolling')
      .mockImplementation(jest.fn());

    const isMenuScrollableSpy = jest
      .spyOn(scrollUtils, 'isMenuScrollable')
      .mockImplementation(() => true);

    const isMenuScrolledToTopSpy = jest
      .spyOn(scrollUtils, 'isMenuScrolledToTop')
      .mockImplementation(() => false);

    const isMenuScrolledToBottomSpy = jest
      .spyOn(scrollUtils, 'isMenuScrolledToBottom')
      .mockImplementation(() => false);

    render(
      <Select
        label="Select an option"
        field={new Field({ name: 'favoriteColor', defaultValue: '' })}
        options={[
          {
            text: 'Red',
            value: 'red',
          },
          {
            text: 'Green',
            value: 'green',
          },
          {
            text: 'Blue',
            value: 'blue',
          },
        ]}
      />,
    );

    await user.click(screen.getByRole('combobox'));
    await waitFor(() =>
      expect(screen.queryByAltText('Scroll up')).toBeInTheDocument(),
    );

    const scrollUpButton = screen.getByAltText('Scroll up');
    fireEvent.touchStart(scrollUpButton);
    expect(startScrollingUpSpy).toHaveBeenCalledTimes(1);

    fireEvent.touchEnd(scrollUpButton);
    expect(stopScrollingSpy).toHaveBeenCalledTimes(1);

    startScrollingUpSpy.mockRestore();
    stopScrollingSpy.mockRestore();
    isMenuScrollableSpy.mockRestore();
    isMenuScrolledToTopSpy.mockRestore();
    isMenuScrolledToBottomSpy.mockRestore();
  });

  it(`calls startScrollingUp when the touchstart event of the scroll up button 
  is fired, and then calls stopScrolling when the touchcancel event is 
  fired.`, async () => {
    const startScrollingUpSpy = jest
      .spyOn(scrollUtils, 'startScrollingUp')
      .mockImplementation(jest.fn());

    const stopScrollingSpy = jest
      .spyOn(scrollUtils, 'stopScrolling')
      .mockImplementation(jest.fn());

    const isMenuScrollableSpy = jest
      .spyOn(scrollUtils, 'isMenuScrollable')
      .mockImplementation(() => true);

    const isMenuScrolledToTopSpy = jest
      .spyOn(scrollUtils, 'isMenuScrolledToTop')
      .mockImplementation(() => false);

    const isMenuScrolledToBottomSpy = jest
      .spyOn(scrollUtils, 'isMenuScrolledToBottom')
      .mockImplementation(() => false);

    render(
      <Select
        label="Select an option"
        field={new Field({ name: 'favoriteColor', defaultValue: '' })}
        options={[
          {
            text: 'Red',
            value: 'red',
          },
          {
            text: 'Green',
            value: 'green',
          },
          {
            text: 'Blue',
            value: 'blue',
          },
        ]}
      />,
    );

    await user.click(screen.getByRole('combobox'));
    await waitFor(() =>
      expect(screen.queryByAltText('Scroll up')).toBeInTheDocument(),
    );

    const scrollUpButton = screen.getByAltText('Scroll up');
    fireEvent.touchStart(scrollUpButton);
    expect(startScrollingUpSpy).toHaveBeenCalledTimes(1);

    fireEvent.touchCancel(scrollUpButton);
    expect(stopScrollingSpy).toHaveBeenCalledTimes(1);

    startScrollingUpSpy.mockRestore();
    stopScrollingSpy.mockRestore();
    isMenuScrollableSpy.mockRestore();
    isMenuScrolledToTopSpy.mockRestore();
    isMenuScrolledToBottomSpy.mockRestore();
  });

  it(`calls startScrollingUp when the touchstart event of the scroll up button 
  is fired, and then calls stopScrolling when the touchmove event fires and the 
  touch coordinates have moved outside of the button.`, async () => {
    let hasTouchPointExitedButton = false;

    const hasTouchPointExitedButtonSpy = jest
      .spyOn(touchScreenUtils, 'hasTouchPointExitedButton')
      .mockImplementation(() => hasTouchPointExitedButton);

    const startScrollingUpSpy = jest
      .spyOn(scrollUtils, 'startScrollingUp')
      .mockImplementation(jest.fn());

    const stopScrollingSpy = jest
      .spyOn(scrollUtils, 'stopScrolling')
      .mockImplementation(jest.fn());

    const isMenuScrollableSpy = jest
      .spyOn(scrollUtils, 'isMenuScrollable')
      .mockImplementation(() => true);

    const isMenuScrolledToTopSpy = jest
      .spyOn(scrollUtils, 'isMenuScrolledToTop')
      .mockImplementation(() => false);

    const isMenuScrolledToBottomSpy = jest
      .spyOn(scrollUtils, 'isMenuScrolledToBottom')
      .mockImplementation(() => false);

    render(
      <Select
        label="Select an option"
        field={new Field({ name: 'favoriteColor', defaultValue: '' })}
        options={[
          {
            text: 'Red',
            value: 'red',
          },
          {
            text: 'Green',
            value: 'green',
          },
          {
            text: 'Blue',
            value: 'blue',
          },
        ]}
      />,
    );

    await user.click(screen.getByRole('combobox'));
    await waitFor(() =>
      expect(screen.queryByAltText('Scroll up')).toBeInTheDocument(),
    );

    const scrollUpButton = screen.getByAltText('Scroll up');
    fireEvent.touchStart(scrollUpButton);
    expect(startScrollingUpSpy).toHaveBeenCalledTimes(1);

    fireEvent.touchMove(scrollUpButton);
    expect(stopScrollingSpy).not.toHaveBeenCalled();

    hasTouchPointExitedButton = true;
    fireEvent.touchMove(scrollUpButton);
    expect(stopScrollingSpy).toHaveBeenCalledTimes(1);

    hasTouchPointExitedButtonSpy.mockRestore();
    startScrollingUpSpy.mockRestore();
    stopScrollingSpy.mockRestore();
    isMenuScrollableSpy.mockRestore();
    isMenuScrolledToTopSpy.mockRestore();
    isMenuScrolledToBottomSpy.mockRestore();
  });

  it(`calls startScrollingDown when the mouse enters the scroll down button and 
  the user is not navigating with the keyboard. stopScrolling is then called 
  when the mouse leaves the button.`, async () => {
    const startScrollingDownSpy = jest
      .spyOn(scrollUtils, 'startScrollingDown')
      .mockImplementation(jest.fn());

    const stopScrollingSpy = jest
      .spyOn(scrollUtils, 'stopScrolling')
      .mockImplementation(jest.fn());

    const isMenuScrollableSpy = jest
      .spyOn(scrollUtils, 'isMenuScrollable')
      .mockImplementation(() => true);

    const isMenuScrolledToTopSpy = jest
      .spyOn(scrollUtils, 'isMenuScrolledToTop')
      .mockImplementation(() => false);

    const isMenuScrolledToBottomSpy = jest
      .spyOn(scrollUtils, 'isMenuScrolledToBottom')
      .mockImplementation(() => false);

    render(
      <Select
        label="Select an option"
        field={new Field({ name: 'favoriteColor', defaultValue: '' })}
        options={[
          {
            text: 'Red',
            value: 'red',
          },
          {
            text: 'Green',
            value: 'green',
          },
          {
            text: 'Blue',
            value: 'blue',
          },
        ]}
      />,
    );

    await user.click(screen.getByRole('combobox'));
    await waitFor(() =>
      expect(screen.queryByAltText('Scroll down')).toBeInTheDocument(),
    );

    const scrollDownButton = screen.getByAltText('Scroll down');
    fireEvent.mouseEnter(scrollDownButton);
    expect(startScrollingDownSpy).toHaveBeenCalledTimes(1);

    fireEvent.mouseLeave(scrollDownButton);
    expect(stopScrollingSpy).toHaveBeenCalledTimes(1);

    startScrollingDownSpy.mockRestore();
    stopScrollingSpy.mockRestore();
    isMenuScrollableSpy.mockRestore();
    isMenuScrolledToTopSpy.mockRestore();
    isMenuScrolledToBottomSpy.mockRestore();
  });

  it(`does not call startScrollingDown when the mouse enters the
  scroll down button and the user is navigating with the keyboard.`, async () => {
    const startScrollingDownSpy = jest
      .spyOn(scrollUtils, 'startScrollingDown')
      .mockImplementation(jest.fn());

    const isMenuScrollableSpy = jest
      .spyOn(scrollUtils, 'isMenuScrollable')
      .mockImplementation(() => true);

    const isMenuScrolledToTopSpy = jest
      .spyOn(scrollUtils, 'isMenuScrolledToTop')
      .mockImplementation(() => false);

    const isMenuScrolledToBottomSpy = jest
      .spyOn(scrollUtils, 'isMenuScrolledToBottom')
      .mockImplementation(() => false);

    render(
      <Select
        label="Select an option"
        field={new Field({ name: 'favoriteColor', defaultValue: '' })}
        options={[
          {
            text: 'Red',
            value: 'red',
          },
          {
            text: 'Green',
            value: 'green',
          },
          {
            text: 'Blue',
            value: 'blue',
          },
        ]}
      />,
    );

    const combobox = screen.getByRole('combobox');
    act(() => combobox.focus());
    await user.keyboard('{Enter}');
    await waitFor(() =>
      expect(screen.queryByAltText('Scroll down')).toBeInTheDocument(),
    );

    const scrollDownButton = screen.getByAltText('Scroll down');
    fireEvent.mouseEnter(scrollDownButton);

    expect(startScrollingDownSpy).not.toHaveBeenCalled();

    startScrollingDownSpy.mockRestore();
    isMenuScrollableSpy.mockRestore();
    isMenuScrolledToTopSpy.mockRestore();
    isMenuScrolledToBottomSpy.mockRestore();
  });

  it(`calls startScrollingUp when the mousedown event of the scroll down 
  button is fired, and then calls stopScrolling when the mouseup event is 
  fired.`, async () => {
    const startScrollingDownSpy = jest
      .spyOn(scrollUtils, 'startScrollingDown')
      .mockImplementation(jest.fn());

    const stopScrollingSpy = jest
      .spyOn(scrollUtils, 'stopScrolling')
      .mockImplementation(jest.fn());

    const isMenuScrollableSpy = jest
      .spyOn(scrollUtils, 'isMenuScrollable')
      .mockImplementation(() => true);

    const isMenuScrolledToTopSpy = jest
      .spyOn(scrollUtils, 'isMenuScrolledToTop')
      .mockImplementation(() => false);

    const isMenuScrolledToBottomSpy = jest
      .spyOn(scrollUtils, 'isMenuScrolledToBottom')
      .mockImplementation(() => false);

    render(
      <Select
        label="Select an option"
        field={new Field({ name: 'favoriteColor', defaultValue: '' })}
        options={[
          {
            text: 'Red',
            value: 'red',
          },
          {
            text: 'Green',
            value: 'green',
          },
          {
            text: 'Blue',
            value: 'blue',
          },
        ]}
      />,
    );

    await user.click(screen.getByRole('combobox'));
    await waitFor(() =>
      expect(screen.queryByAltText('Scroll down')).toBeInTheDocument(),
    );

    const scrollDownButton = screen.getByAltText('Scroll down');
    fireEvent.mouseDown(scrollDownButton);
    expect(startScrollingDownSpy).toHaveBeenCalledTimes(1);

    fireEvent.mouseUp(scrollDownButton);
    expect(stopScrollingSpy).toHaveBeenCalledTimes(1);

    startScrollingDownSpy.mockRestore();
    stopScrollingSpy.mockRestore();
    isMenuScrollableSpy.mockRestore();
    isMenuScrolledToTopSpy.mockRestore();
    isMenuScrolledToBottomSpy.mockRestore();
  });

  it(`calls startScrollingDown when the touchstart event of the scroll down 
  button is fired, and then calls stopScrolling when the touchend event is 
  fired.`, async () => {
    const startScrollingDownSpy = jest
      .spyOn(scrollUtils, 'startScrollingDown')
      .mockImplementation(jest.fn());

    const stopScrollingSpy = jest
      .spyOn(scrollUtils, 'stopScrolling')
      .mockImplementation(jest.fn());

    const isMenuScrollableSpy = jest
      .spyOn(scrollUtils, 'isMenuScrollable')
      .mockImplementation(() => true);

    const isMenuScrolledToTopSpy = jest
      .spyOn(scrollUtils, 'isMenuScrolledToTop')
      .mockImplementation(() => false);

    const isMenuScrolledToBottomSpy = jest
      .spyOn(scrollUtils, 'isMenuScrolledToBottom')
      .mockImplementation(() => false);

    render(
      <Select
        label="Select an option"
        field={new Field({ name: 'favoriteColor', defaultValue: '' })}
        options={[
          {
            text: 'Red',
            value: 'red',
          },
          {
            text: 'Green',
            value: 'green',
          },
          {
            text: 'Blue',
            value: 'blue',
          },
        ]}
      />,
    );

    await user.click(screen.getByRole('combobox'));
    await waitFor(() =>
      expect(screen.queryByAltText('Scroll down')).toBeInTheDocument(),
    );

    const scrollDownButton = screen.getByAltText('Scroll down');
    fireEvent.touchStart(scrollDownButton);
    expect(startScrollingDownSpy).toHaveBeenCalledTimes(1);

    fireEvent.touchEnd(scrollDownButton);
    expect(stopScrollingSpy).toHaveBeenCalledTimes(1);

    startScrollingDownSpy.mockRestore();
    stopScrollingSpy.mockRestore();
    isMenuScrollableSpy.mockRestore();
    isMenuScrolledToTopSpy.mockRestore();
    isMenuScrolledToBottomSpy.mockRestore();
  });

  it(`calls startScrollingDown when the touchstart event of the scroll down 
  button is fired, and then calls stopScrolling when the touchcancel event is 
  fired.`, async () => {
    const startScrollingDownSpy = jest
      .spyOn(scrollUtils, 'startScrollingDown')
      .mockImplementation(jest.fn());

    const stopScrollingSpy = jest
      .spyOn(scrollUtils, 'stopScrolling')
      .mockImplementation(jest.fn());

    const isMenuScrollableSpy = jest
      .spyOn(scrollUtils, 'isMenuScrollable')
      .mockImplementation(() => true);

    const isMenuScrolledToTopSpy = jest
      .spyOn(scrollUtils, 'isMenuScrolledToTop')
      .mockImplementation(() => false);

    const isMenuScrolledToBottomSpy = jest
      .spyOn(scrollUtils, 'isMenuScrolledToBottom')
      .mockImplementation(() => false);

    render(
      <Select
        label="Select an option"
        field={new Field({ name: 'favoriteColor', defaultValue: '' })}
        options={[
          {
            text: 'Red',
            value: 'red',
          },
          {
            text: 'Green',
            value: 'green',
          },
          {
            text: 'Blue',
            value: 'blue',
          },
        ]}
      />,
    );

    await user.click(screen.getByRole('combobox'));
    await waitFor(() =>
      expect(screen.queryByAltText('Scroll down')).toBeInTheDocument(),
    );

    const scrollDownButton = screen.getByAltText('Scroll down');
    fireEvent.touchStart(scrollDownButton);
    expect(startScrollingDownSpy).toHaveBeenCalledTimes(1);

    fireEvent.touchCancel(scrollDownButton);
    expect(stopScrollingSpy).toHaveBeenCalledTimes(1);

    startScrollingDownSpy.mockRestore();
    stopScrollingSpy.mockRestore();
    isMenuScrollableSpy.mockRestore();
    isMenuScrolledToTopSpy.mockRestore();
    isMenuScrolledToBottomSpy.mockRestore();
  });

  it(`calls startScrollingDown when the touchstart event of the scroll down 
  button is fired, and then calls stopScrolling when the touchmove event fires 
  and the touch coordinates have moved outside of the button.`, async () => {
    let hasTouchPointExitedButton = false;

    const hasTouchPointExitedButtonSpy = jest
      .spyOn(touchScreenUtils, 'hasTouchPointExitedButton')
      .mockImplementation(() => hasTouchPointExitedButton);

    const startScrollingDownSpy = jest
      .spyOn(scrollUtils, 'startScrollingDown')
      .mockImplementation(jest.fn());

    const stopScrollingSpy = jest
      .spyOn(scrollUtils, 'stopScrolling')
      .mockImplementation(jest.fn());

    const isMenuScrollableSpy = jest
      .spyOn(scrollUtils, 'isMenuScrollable')
      .mockImplementation(() => true);

    const isMenuScrolledToTopSpy = jest
      .spyOn(scrollUtils, 'isMenuScrolledToTop')
      .mockImplementation(() => false);

    const isMenuScrolledToBottomSpy = jest
      .spyOn(scrollUtils, 'isMenuScrolledToBottom')
      .mockImplementation(() => false);

    render(
      <Select
        label="Select an option"
        field={new Field({ name: 'favoriteColor', defaultValue: '' })}
        options={[
          {
            text: 'Red',
            value: 'red',
          },
          {
            text: 'Green',
            value: 'green',
          },
          {
            text: 'Blue',
            value: 'blue',
          },
        ]}
      />,
    );

    await user.click(screen.getByRole('combobox'));
    await waitFor(() =>
      expect(screen.queryByAltText('Scroll down')).toBeInTheDocument(),
    );

    const scrollDownButton = screen.getByAltText('Scroll down');
    fireEvent.touchStart(scrollDownButton);
    expect(startScrollingDownSpy).toHaveBeenCalledTimes(1);

    fireEvent.touchMove(scrollDownButton);
    expect(stopScrollingSpy).not.toHaveBeenCalled();

    hasTouchPointExitedButton = true;
    fireEvent.touchMove(scrollDownButton);
    expect(stopScrollingSpy).toHaveBeenCalledTimes(1);

    hasTouchPointExitedButtonSpy.mockRestore();
    startScrollingDownSpy.mockRestore();
    stopScrollingSpy.mockRestore();
    isMenuScrollableSpy.mockRestore();
    isMenuScrolledToTopSpy.mockRestore();
    isMenuScrolledToBottomSpy.mockRestore();
  });
});
