import { Select } from '@/components/form-components/select';
import {
  render,
  screen,
  cleanup,
  act,
  fireEvent,
  waitFor,
} from '@testing-library/react';
import userEvent, { UserEvent } from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Field, StringValidators, Group, Validity } from 'fully-formed';
import { mockScrollMethods } from '@/utils/test/mock-scroll-methods';
import * as scrollUtils from '../../../../../components/form-components/select/menu/utils/scroll';
import * as useMenuModule from '../../../../../components/form-components/select/menu/hooks/use-menu';
import zipState from 'zip-state';
import { US_STATE_ABBREVIATIONS } from '@/constants/us-state-abbreviations';

/*
  The individual modules within utils must be mocked so that when they are 
  spied on and replaced with a mock implementation, the other functions in 
  utils call the mock implementations.
*/
jest.mock(
  '../../../../../components/form-components/select/menu/utils/scroll',
  () => ({
    __esModule: true,
    ...jest.requireActual(
      '../../../../../components/form-components/select/menu/utils/scroll',
    ),
  }),
);

jest.mock(
  '../../../../../components/form-components/select/menu/hooks/use-menu',
  () => ({
    __esModule: true,
    ...jest.requireActual(
      '../../../../../components/form-components/select/menu/hooks/use-menu',
    ),
  }),
);

describe('Select', () => {
  let user: UserEvent;

  beforeEach(() => {
    mockScrollMethods();
    user = userEvent.setup();
  });

  afterEach(cleanup);

  it('renders.', () => {
    render(
      <Select
        label="Select an option"
        field={new Field({ name: 'testField', defaultValue: '' })}
        options={[]}
      />,
    );

    expect(screen.queryByRole('combobox')).toBeInTheDocument();
  });

  it(`opens the menu and focuses on the first option when the user clicks the 
  combobox while the menu is closed and no option has been selected.`, async () => {
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

    await waitFor(() =>
      expect(menuContainer.classList).not.toContain('hidden'),
    );

    const focusedOption = screen.getAllByRole('option')[0];
    expect(focusedOption).toHaveFocus();
  });

  it(`opens the menu and focuses on the currently selected option when the user
  clicks the combobox while the menu is closed.`, async () => {
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
        label="Favorite Color"
        field={
          new Field({ name: 'favoriteColor', defaultValue: options[1].value })
        }
        options={options}
      />,
    );

    const menuContainer = document.getElementsByClassName('menu_container')[0];
    expect(menuContainer.classList).toContain('hidden');

    const combobox = screen.getByRole('combobox');
    await user.click(combobox);
    await waitFor(() =>
      expect(menuContainer.classList).not.toContain('hidden'),
    );

    const focusedOption = screen.getAllByRole('option')[1];
    expect(focusedOption).toHaveFocus();
  });

  it(`closes the menu when the user clicks the combobox while the menu is
  open.`, async () => {
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
    const combobox = screen.getByRole('combobox');

    await user.click(combobox);
    await waitFor(() =>
      expect(menuContainer.classList).not.toContain('hidden'),
    );

    await user.click(combobox);
    await waitFor(() => expect(menuContainer.classList).toContain('hidden'));
  });

  it(`closes the menu when the user clicks outside of the select 
  component.`, async () => {
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
    const combobox = screen.getByRole('combobox');

    await user.click(combobox);
    await waitFor(() =>
      expect(menuContainer.classList).not.toContain('hidden'),
    );

    await user.click(document.body);
    await waitFor(() => expect(menuContainer.classList).toContain('hidden'));
  });

  it(`opens the menu to the first option when the user presses the Enter key 
  while the combobox has focus and no option has been selected.`, async () => {
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
    act(() => combobox.focus());
    await user.keyboard('{Enter}');

    await waitFor(() =>
      expect(menuContainer.classList).not.toContain('hidden'),
    );

    const focusedOption = screen.getAllByRole('option')[0];
    expect(focusedOption).toHaveFocus();
  });

  it(`opens the menu to the selected option when the user presses the Enter key 
  while the combobox has focus and an option has been selected.`, async () => {
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
        label="Favorite Color"
        field={
          new Field({ name: 'favoriteColor', defaultValue: options[1].value })
        }
        options={options}
      />,
    );

    const menuContainer = document.getElementsByClassName('menu_container')[0];
    expect(menuContainer.classList).toContain('hidden');

    const combobox = screen.getByRole('combobox');
    act(() => combobox.focus());
    await user.keyboard('{Enter}');

    await waitFor(() =>
      expect(menuContainer.classList).not.toContain('hidden'),
    );

    const focusedOption = screen.getAllByRole('option')[1];
    expect(focusedOption).toHaveFocus();
  });

  it(`opens the menu to the first option when the user presses the ArrowDown key 
  while the combobox has focus.`, async () => {
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
    act(() => combobox.focus());
    await user.keyboard('{ArrowDown}');

    await waitFor(() =>
      expect(menuContainer.classList).not.toContain('hidden'),
    );

    const focusedOption = screen.getAllByRole('option')[0];
    expect(focusedOption).toHaveFocus();
  });

  it(`opens the menu to the last option when the user presses the ArrowUp key 
  while the combobox has focus.`, async () => {
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
        label="Favorite Color"
        field={new Field({ name: 'favoriteColor', defaultValue: '' })}
        options={options}
      />,
    );

    const menuContainer = document.getElementsByClassName('menu_container')[0];
    expect(menuContainer.classList).toContain('hidden');

    const combobox = screen.getByRole('combobox');
    act(() => combobox.focus());
    await user.keyboard('{ArrowUp}');

    await waitFor(() =>
      expect(menuContainer.classList).not.toContain('hidden'),
    );

    const focusedOption = screen.getAllByRole('option')[options.length - 1];
    expect(focusedOption).toHaveFocus();
  });

  it(`opens the menu to the first option beginning with a given printable 
  character when the corresponding key is pressed and the combobox has 
  focus, regardless of case.`, async () => {
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
        label="Favorite Color"
        field={new Field({ name: 'favoriteColor', defaultValue: '' })}
        options={options}
      />,
    );

    const menuContainer = document.getElementsByClassName('menu_container')[0];
    expect(menuContainer.classList).toContain('hidden');

    // options[1] should be selected when G is typed (regardless of case)
    // First, try uppercase G
    const combobox = screen.getByRole('combobox');
    act(() => combobox.focus());
    await user.keyboard('G');
    await waitFor(() =>
      expect(menuContainer.classList).not.toContain('hidden'),
    );
    const focusedOption = screen.getAllByRole('option')[1];
    expect(focusedOption).toHaveFocus();

    // close the menu without selecting an option
    await user.keyboard('{Escape}');
    await waitFor(() => expect(menuContainer.classList).toContain('hidden'));
    expect(screen.getByRole('combobox')).toHaveFocus();

    // open the menu with lowercase g
    await user.keyboard('g');
    await waitFor(() =>
      expect(menuContainer.classList).not.toContain('hidden'),
    );
    expect(focusedOption).toHaveFocus();
  });

  it(`opens the menu to the first option when the user presses a key 
  corresponding to a printable character, but no such option exists beginning 
  with that character and no option has been selected.`, async () => {
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
    act(() => combobox.focus());
    await user.keyboard('z');
    await waitFor(() =>
      expect(menuContainer.classList).not.toContain('hidden'),
    );
    const focusedOption = screen.getAllByRole('option')[0];
    expect(focusedOption).toHaveFocus();
  });

  it(`opens the menu to the selected option when the user presses a key 
  corresponding to a printable character, but no such option exists beginning 
  with that character and an option has been selected.`, async () => {
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
        label="Favorite Color"
        field={
          new Field({ name: 'favoriteColor', defaultValue: options[2].value })
        }
        options={options}
      />,
    );

    const menuContainer = document.getElementsByClassName('menu_container')[0];
    expect(menuContainer.classList).toContain('hidden');
    const combobox = screen.getByRole('combobox');
    act(() => combobox.focus());
    await user.keyboard('z');
    await waitFor(() =>
      expect(menuContainer.classList).not.toContain('hidden'),
    );
    const focusedOption = screen.getAllByRole('option')[2];
    expect(focusedOption).toHaveFocus();
  });

  it(`adds any classNames it receives to the classList of the outer 
  container.`, () => {
    const className = 'test';

    render(
      <Select
        label="Favorite Color"
        field={new Field({ name: 'testField', defaultValue: '' })}
        options={[]}
        className={className}
      />,
    );

    const outerContainer = document.getElementsByClassName('select')[0];
    expect(outerContainer.classList).toContain(className);
  });

  it(`renders any messages associated with the field if the field has been
  modified.`, async () => {
    const validMessage = 'Thank you for selecting an option.';
    const invalidMessage = 'Please select an option.';

    const requiredField = new Field({
      name: 'requiredField',
      defaultValue: '',
      validators: [
        StringValidators.required({
          validMessage,
          invalidMessage,
        }),
      ],
    });

    render(
      <Select
        label="Select an option"
        field={requiredField}
        options={[
          {
            text: 'Option 1',
            value: 'option 1',
          },
        ]}
      />,
    );

    expect(screen.queryByText(invalidMessage)).toBeInTheDocument();
    expect(screen.getByText(invalidMessage).classList).toContain(
      'hidden_message',
    );
    expect(screen.queryByText(validMessage)).not.toBeInTheDocument();

    const combobox = screen.getByRole('combobox');
    await user.click(combobox);

    const options = screen.getAllByRole('option');
    await user.click(options[0]);

    await waitFor(() =>
      expect(screen.queryByText(invalidMessage)).not.toBeInTheDocument(),
    );
    expect(screen.queryByText(validMessage)).toBeInTheDocument();
    expect(screen.getByText(validMessage).classList).not.toContain(
      'hidden_message',
    );
  });

  it(`displays any messages associated with the field if the field has been 
  submitted.`, async () => {
    const invalidMessage = 'Please select an option.';

    const requiredField = new Field({
      name: 'requiredField',
      defaultValue: '',
      validators: [
        StringValidators.required({
          invalidMessage,
        }),
      ],
    });

    render(
      <Select label="Select an option" field={requiredField} options={[]} />,
    );

    expect(screen.getByText(invalidMessage).classList).toContain(
      'hidden_message',
    );

    act(() => requiredField.setSubmitted());
    await waitFor(() =>
      expect(screen.getByText(invalidMessage).classList).not.toContain(
        'hidden_message',
      ),
    );
  });

  it(`renders any messages associated with groups it receives if displayMessages
  is true in the corresponding GroupConfigObject. The messages are hidden until 
  the field is blurred, modified, or submitted.`, async () => {
    const stateAndZipDoNotMatch = 'The state and zip code do not match.';

    const zip = new Field({
      name: 'zip',
      defaultValue: '19022', // PA zip code
    });

    const state = new Field({
      name: 'state',
      defaultValue: 'CA',
    });

    const zipCodeAndState = new Group({
      name: 'zipCodeAndState',
      members: [zip, state],
      validatorTemplates: [
        {
          predicate: ({ zip, state }) => {
            return zipState(zip) === state;
          },
          invalidMessage: stateAndZipDoNotMatch,
        },
      ],
    });

    render(
      <Select
        label="State"
        field={state}
        groups={[
          {
            group: zipCodeAndState,
            displayMessages: true,
          },
        ]}
        options={Object.values(US_STATE_ABBREVIATIONS).map(abbr => {
          return {
            text: abbr,
            value: abbr,
          };
        })}
      />,
    );

    expect(screen.queryByText(stateAndZipDoNotMatch)).toBeInTheDocument();
    expect(screen.getByText(stateAndZipDoNotMatch).classList).toContain(
      'hidden_message',
    );

    act(() => state.blur());

    await waitFor(() =>
      expect(screen.getByText(stateAndZipDoNotMatch).classList).not.toContain(
        'hidden_message',
      ),
    );
  });

  it(`does not render any messages associated with groups it receives that have
  displayMessages set to false in their GroupConfigObject.`, () => {
    const stateAndZipDoNotMatch = 'The state and zip code do not match.';

    const zip = new Field({
      name: 'zip',
      defaultValue: '19022', // PA zip code
    });

    const state = new Field({
      name: 'state',
      defaultValue: 'CA',
    });

    const zipCodeAndState = new Group({
      name: 'zipCodeAndState',
      members: [zip, state],
      validatorTemplates: [
        {
          predicate: ({ zip, state }) => {
            return zipState(zip) === state;
          },
          invalidMessage: stateAndZipDoNotMatch,
        },
      ],
    });

    render(
      <Select
        label="State"
        field={state}
        groups={[
          {
            group: zipCodeAndState,
            displayMessages: false,
          },
        ]}
        options={Object.values(US_STATE_ABBREVIATIONS).map(abbr => {
          return {
            text: abbr,
            value: abbr,
          };
        })}
      />,
    );

    expect(screen.queryByText(stateAndZipDoNotMatch)).not.toBeInTheDocument();
  });

  it(`hides the menu's scroll buttons when the screen is resized and the menu 
  is no longer scrollable.`, async () => {
    let isMenuScrollable = true;

    const isMenuScrollableSpy = jest
      .spyOn(scrollUtils, 'isMenuScrollable')
      .mockImplementation(() => isMenuScrollable);

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
    expect(screen.queryByAltText('Scroll down')).toBeInTheDocument();

    isMenuScrollable = false;
    fireEvent.resize(window);

    await waitFor(() => {
      expect(screen.queryByAltText('Scroll up')).not.toBeInTheDocument();
      expect(screen.queryByAltText('Scroll down')).not.toBeInTheDocument();
    });

    isMenuScrollableSpy.mockRestore();
    isMenuScrolledToTopSpy.mockRestore();
    isMenuScrolledToBottomSpy.mockRestore();
  });

  it(`hides the scroll up button and shows the scroll down button when the
  screen is resized, the menu is scrollable, and the menu is scrolled to the
  top.`, async () => {
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
    fireEvent.resize(window);

    await waitFor(() => {
      expect(screen.queryByAltText('Scroll up')).not.toBeInTheDocument();
      expect(screen.queryByAltText('Scroll down')).toBeInTheDocument();
    });

    isMenuScrollableSpy.mockRestore();
    isMenuScrolledToTopSpy.mockRestore();
    isMenuScrolledToBottomSpy.mockRestore();
  });

  it(`hides the scroll down button and shows the scroll up button when the
  screen is resized, the menu is scrollable, and the menu is scrolled to the
  bottom.`, async () => {
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
    fireEvent.resize(window);

    await waitFor(() => {
      expect(screen.queryByAltText('Scroll down')).not.toBeInTheDocument();
      expect(screen.queryByAltText('Scroll up')).toBeInTheDocument();
    });

    isMenuScrollableSpy.mockRestore();
    isMenuScrolledToTopSpy.mockRestore();
    isMenuScrolledToBottomSpy.mockRestore();
  });

  it(`shows both scroll buttons when the menu is resized, the menu is scrollable,
  and the menu is scrolled neither to the top nor the bottom.`, async () => {
    let isMenuScrollable = false;

    const isMenuScrollableSpy = jest
      .spyOn(scrollUtils, 'isMenuScrollable')
      .mockImplementation(() => isMenuScrollable);

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
      expect(screen.queryByAltText('Scroll up')).not.toBeInTheDocument(),
    );
    expect(screen.queryByAltText('Scroll down')).not.toBeInTheDocument();

    isMenuScrollable = true;
    fireEvent.resize(window);

    await waitFor(() => {
      expect(screen.queryByAltText('Scroll up')).toBeInTheDocument();
      expect(screen.queryByAltText('Scroll down')).toBeInTheDocument();
    });

    isMenuScrollableSpy.mockRestore();
    isMenuScrolledToTopSpy.mockRestore();
    isMenuScrolledToBottomSpy.mockRestore();
  });

  it(`sets MenuControls.isKeyboardNavigating.current to false when the user
  moves the mouse.`, async () => {
    const isKeyboardNavigating = {
      current: true,
    };

    const { useMenu } = useMenuModule;

    const useMenuSpy = jest
      .spyOn(useMenuModule, 'useMenu')
      .mockImplementationOnce((params: useMenuModule.UseMenuParams) => {
        return {
          ...useMenu(params),
          isKeyboardNavigating,
        };
      });

    render(
      <Select
        label="Select an option"
        field={new Field({ name: 'testField', defaultValue: '' })}
        options={[]}
      />,
    );

    const combobox = screen.getByRole('combobox');
    act(() => combobox.focus());
    await user.keyboard('{Enter}');

    expect(isKeyboardNavigating.current).toBe(true);

    fireEvent.mouseMove(document);
    expect(isKeyboardNavigating.current).toBe(false);

    useMenuSpy.mockRestore();
  });

  it(`displays a warning icon when the field's validity is Validity.Caution and 
  the field has been blurred.`, () => {
    const field = new Field({
      name: 'testField',
      defaultValue: '',
      validators: [
        {
          validate: () => ({
            validity: Validity.Caution,
          }),
        },
      ],
    });

    render(<Select label="Select an option" field={field} options={[]} />);

    expect(screen.queryByAltText(/warning icon/i)).not.toBeInTheDocument();

    act(() => field.blur());
    expect(screen.queryByAltText(/warning icon/i)).toBeInTheDocument();
  });

  it(`displays a warning icon when the field's validity is Validity.Caution and 
  the field has been modified.`, async () => {
    const field = new Field({
      name: 'testField',
      defaultValue: '',
      validators: [
        {
          validate: () => ({
            validity: Validity.Caution,
          }),
        },
      ],
    });

    render(
      <Select
        label="Select an option"
        field={field}
        options={[{ value: 'a', text: 'Option A' }]}
      />,
    );

    expect(screen.queryByAltText(/warning icon/i)).not.toBeInTheDocument();

    const combobox = screen.getByRole('combobox');
    await user.click(combobox);

    const options = screen.getAllByRole('option');
    await user.click(options[0]);
    expect(screen.queryByAltText(/warning icon/i)).toBeInTheDocument();
  });

  it(`displays a warning icon when the field's validity is Validity.Caution and 
  the field has been submitted.`, () => {
    const field = new Field({
      name: 'testField',
      defaultValue: '',
      validators: [
        {
          validate: () => ({
            validity: Validity.Caution,
          }),
        },
      ],
    });

    render(<Select label="Select an option" field={field} options={[]} />);

    expect(screen.queryByAltText(/warning icon/i)).not.toBeInTheDocument();

    act(() => field.setSubmitted());
    expect(screen.queryByAltText(/warning icon/i)).toBeInTheDocument();
  });
});
