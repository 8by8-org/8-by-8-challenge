import { Select } from '@/components/form-components/select';
import { render, screen, cleanup, act, waitFor } from '@testing-library/react';
import userEvent, { UserEvent } from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Field, StringValidators, Group } from 'fully-formed';
import zipState from 'zip-state';
import { mockScrollMethods } from '@/utils/test/mock-scroll-methods';
import { US_STATES_AND_TERRITORIES } from '@/constants/us-states-and-territories';

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
    combobox.focus();
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
    combobox.focus();
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
    combobox.focus();
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
    combobox.focus();
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
    combobox.focus();
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
    combobox.focus();
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
    combobox.focus();
    await user.keyboard('z');
    await waitFor(() =>
      expect(menuContainer.classList).not.toContain('hidden'),
    );
    const focusedOption = screen.getAllByRole('option')[2];
    expect(focusedOption).toHaveFocus();
  });

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
    combobox.focus();
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
    combobox.focus();
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
    combobox.focus();

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
    combobox.focus();

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
    combobox.focus();

    for (let i = 0; i < options.length; i++) {
      await user.keyboard(options[i].value[0]);
      const focusedOptionIndex = i;
      expect(menuOptions[focusedOptionIndex]).toHaveFocus();
    }
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

  it(`displays any messages associated with the field if the field has been 
  blurred.`, async () => {
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

    const combobox = screen.getByRole('combobox');
    await user.click(combobox);
    expect(screen.getByText(invalidMessage).classList).toContain(
      'hidden_message',
    );

    await user.click(document.body);
    expect(screen.getByText(invalidMessage).classList).not.toContain(
      'hidden_message',
    );
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
        options={US_STATES_AND_TERRITORIES.map(abbr => {
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
        options={US_STATES_AND_TERRITORIES.map(abbr => {
          return {
            text: abbr,
            value: abbr,
          };
        })}
      />,
    );

    expect(screen.queryByText(stateAndZipDoNotMatch)).not.toBeInTheDocument();
  });
});
