import { PhoneInput } from '@/components/form-components/phone-input';
import {
  render,
  screen,
  cleanup,
  act,
  waitFor,
  fireEvent,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import { Field, type FieldOfType } from 'fully-formed';

describe('PhoneInput', () => {
  let user: UserEvent;
  let phoneNumber: FieldOfType<string>;
  const placeholder = '(555) 555-5555';
  const className = 'testClassName';

  beforeEach(() => {
    user = userEvent.setup();
    phoneNumber = new Field({
      name: 'phoneNumber',
      defaultValue: '',
      validatorTemplates: [
        {
          predicate: value => /^\d{10}$/.test(value),
        },
      ],
    });
    render(
      <PhoneInput
        field={phoneNumber}
        placeholder={placeholder}
        className={className}
      />,
    );
  });

  afterEach(cleanup);

  it('renders', () => {
    const input = screen.queryByPlaceholderText(placeholder);
    expect(input).toBeInTheDocument();
  });

  it('accepts numerical input', async () => {
    const input = screen.getByPlaceholderText(placeholder) as HTMLInputElement;

    await user.type(input, '1');
    expect(input.value).toBe('1');
  });

  it('does not accept non-numeric input', async () => {
    const input = screen.getByPlaceholderText(placeholder) as HTMLInputElement;

    await user.click(input);
    await user.paste(
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ`~!@#$%^&*()-_=+[[{{]};:\'"\\|,<.>/?😀',
    );
    expect(input.value).toBe('');
  });

  it('formats input correctly', async () => {
    const input = screen.getByPlaceholderText(placeholder) as HTMLInputElement;

    const expected = [
      '0',
      '01',
      '012',
      '(012) 3',
      '(012) 34',
      '(012) 345',
      '(012) 345-6',
      '(012) 345-67',
      '(012) 345-678',
      '(012) 345-6789',
    ];

    for (let i = 0; i < expected.length; i++) {
      await user.type(input, i.toString());
      expect(input.value).toBe(expected[i]);
    }
  });
  it('does not accept further input when the max input is reached', async () => {
    const input = screen.getByPlaceholderText(placeholder) as HTMLInputElement;

    await user.click(input);
    await user.paste('01234567899999999999999');
    expect(input.value).toBe('(012) 345-6789');

    await user.type(input, '1');
    expect(input.value).toBe('(012) 345-6789');
  });

  it('removes non-digits from input and then formats the digits', async () => {
    const text = `The phone number is (012) 345-6789`;

    const input = screen.getByPlaceholderText(placeholder) as HTMLInputElement;

    await user.click(input);
    await user.paste(text);
    expect(input.value).toBe('(012) 345-6789');
  });

  it('deletes content backward while preserving correct formatting', async () => {
    const input = screen.getByPlaceholderText(placeholder) as HTMLInputElement;
    await user.click(input);
    await user.paste('0123456789');

    const expected = [
      '',
      '0',
      '01',
      '012',
      '(012) 3',
      '(012) 34',
      '(012) 345',
      '(012) 345-6',
      '(012) 345-67',
      '(012) 345-678',
    ];

    for (let i = 9; i >= 0; i--) {
      await user.type(input, '{Backspace}');
      expect(input.value).toBe(expected[i]);
    }
  });

  it('deletes content forward while preserving correct formatting', async () => {
    const input = screen.getByPlaceholderText(placeholder) as HTMLInputElement;
    await user.click(input);
    await user.paste('0123456789');

    const expected = [
      '(123) 456-789',
      '(234) 567-89',
      '(345) 678-9',
      '(456) 789',
      '(567) 89',
      '(678) 9',
      '789',
      '89',
      '9',
      '',
    ];

    for (let i = 0; i < 10; i++) {
      await user.type(input, '{Delete}', { initialSelectionStart: 0 });
      expect(input.value).toBe(expected[i]);
    }
  });

  it("does not delete any content when only '(' is selected.", async () => {
    const expected = '(111) 222-3333';
    act(() =>
      phoneNumber.setValue(
        expected
          .split('')
          .filter(c => /\d/.test(c))
          .join(''),
      ),
    );

    const input = screen.getByPlaceholderText(placeholder) as HTMLInputElement;

    await user.type(input, '{Delete}', {
      initialSelectionStart: 0,
      initialSelectionEnd: 1,
    });
    expect(input.value).toBe(expected);

    await user.type(input, '{Backspace}', {
      initialSelectionStart: 0,
      initialSelectionEnd: 1,
    });
    expect(input.value).toBe(expected);
  });

  it("does not delete any content when only ')' is selected.", async () => {
    const expected = '(111) 222-3333';
    act(() =>
      phoneNumber.setValue(
        expected
          .split('')
          .filter(c => /\d/.test(c))
          .join(''),
      ),
    );

    const input = screen.getByPlaceholderText(placeholder) as HTMLInputElement;

    await user.type(input, '{Delete}', {
      initialSelectionStart: 4,
      initialSelectionEnd: 5,
    });
    expect(input.value).toBe(expected);

    await user.type(input, '{Backspace}', {
      initialSelectionStart: 4,
      initialSelectionEnd: 5,
    });
    expect(input.value).toBe(expected);
  });

  it("does not delete any content when only ') ' is selected.", async () => {
    const expected = '(111) 222-3333';
    act(() =>
      phoneNumber.setValue(
        expected
          .split('')
          .filter(c => /\d/.test(c))
          .join(''),
      ),
    );

    const input = screen.getByPlaceholderText(placeholder) as HTMLInputElement;

    await user.type(input, '{Delete}', {
      initialSelectionStart: 4,
      initialSelectionEnd: 6,
    });
    expect(input.value).toBe(expected);

    await user.type(input, '{Backspace}', {
      initialSelectionStart: 4,
      initialSelectionEnd: 6,
    });
    expect(input.value).toBe(expected);
  });

  it("does not delete any content when only ' ' is selected.", async () => {
    const expected = '(111) 222-3333';
    act(() =>
      phoneNumber.setValue(
        expected
          .split('')
          .filter(c => /\d/.test(c))
          .join(''),
      ),
    );

    const input = screen.getByPlaceholderText(placeholder) as HTMLInputElement;

    await user.type(input, '{Delete}', {
      initialSelectionStart: 5,
      initialSelectionEnd: 6,
    });
    expect(input.value).toBe(expected);

    await user.type(input, '{Backspace}', {
      initialSelectionStart: 5,
      initialSelectionEnd: 6,
    });
    expect(input.value).toBe(expected);
  });

  it("does not delete any content when only '-' is selected.", async () => {
    const expected = '(111) 222-3333';
    act(() =>
      phoneNumber.setValue(
        expected
          .split('')
          .filter(c => /\d/.test(c))
          .join(''),
      ),
    );

    const input = screen.getByPlaceholderText(placeholder) as HTMLInputElement;

    await user.type(input, '{Delete}', {
      initialSelectionStart: 9,
      initialSelectionEnd: 10,
    });

    expect(input.value).toBe(expected);

    await user.type(input, '{Backspace}', {
      initialSelectionStart: 9,
      initialSelectionEnd: 10,
    });
    expect(input.value).toBe(expected);
  });

  it('replaces the correct digits when a punctuation mark and digits are highlighted.', async () => {
    act(() => phoneNumber.setValue('1112220000'));

    const input = screen.getByPlaceholderText(placeholder) as HTMLInputElement;
    const expected = '(111) 222-3333';

    await user.click(input);
    input.setSelectionRange(9, 14);

    await user.paste('3333');
    expect(input.value).toBe(expected);
  });

  it('moves the cursor past punctuation marks when the arrow keys are used.', async () => {
    act(() => phoneNumber.setValue('1112223333'));

    const input = screen.getByPlaceholderText(placeholder) as HTMLInputElement;

    await user.type(input, '{ArrowLeft}', {
      initialSelectionStart: 11,
    });
    expect(input.selectionStart).toBe(9);

    await user.type(input, '{ArrowRight}', {
      initialSelectionStart: 9,
    });
    expect(input.selectionStart).toBe(11);

    await user.type(input, '{ArrowLeft}', {
      initialSelectionStart: 7,
    });
    expect(input.selectionStart).toBe(4);

    await user.type(input, '{ArrowRight}', {
      initialSelectionStart: 4,
    });
    expect(input.selectionStart).toBe(7);
  });

  it('keeps the cursor in place when the middle of the content is modified.', async () => {
    act(() => phoneNumber.setValue('1112223333'));

    const input = screen.getByPlaceholderText(placeholder) as HTMLInputElement;

    input.setSelectionRange(7, 8);
    act(() =>
      input.dispatchEvent(
        new InputEvent('beforeinput', {
          data: '2',
          inputType: 'insertText',
        }),
      ),
    );
    await waitFor(() => expect(input.selectionStart).toBe(8));

    input.setSelectionRange(7, 8);
    act(() =>
      input.dispatchEvent(
        new InputEvent('beforeinput', {
          data: '9',
          inputType: 'insertText',
        }),
      ),
    );
    await waitFor(() => expect(input.selectionStart).toBe(8));
  });

  it(`does not move the cursor when the right arrow key is pressed and the
  cursor is already at its rightmost position.`, async () => {
    act(() => phoneNumber.setValue('1112223333'));

    const input = screen.getByPlaceholderText(placeholder) as HTMLInputElement;

    await user.type(input, '{ArrowRight}', {
      initialSelectionStart: input.value.length,
      initialSelectionEnd: input.value.length,
    });

    expect(input.selectionStart).toBe(input.value.length);
    expect(input.selectionEnd).toBe(input.value.length);
  });

  it('updates its value when autofilled.', () => {
    const input = screen.getByPlaceholderText(placeholder) as HTMLInputElement;

    fireEvent.change(input, { target: { value: '0123456789' } });
    expect(input.value).toBe('(012) 345-6789');
  });

  it(`adds styles.invalid to the input's classList when the user modifies the
  field and it is invalid.`, async () => {
    const input = screen.getByPlaceholderText(placeholder) as HTMLInputElement;

    expect(input.classList.contains('invalid')).toBe(false);

    await user.type(input, '1');
    await waitFor(() => expect(input.classList.contains('invalid')).toBe(true));
  });

  it(`sets the aria-invalid attribute of the input element to true when the user
  modifies the field and it is invalid.`, async () => {
    const input = screen.getByPlaceholderText(placeholder) as HTMLInputElement;

    expect(input.getAttribute('aria-invalid')).toBe('false');

    await user.type(input, '1');
    await waitFor(() =>
      expect(input.getAttribute('aria-invalid')).toBe('true'),
    );
  });

  it(`adds styles.invalid to the input's classList when the input is blurred and
  the underlying field is invalid.`, async () => {
    const input = screen.getByPlaceholderText(placeholder) as HTMLInputElement;
    expect(input.classList.contains('invalid')).toBe(false);

    await user.click(input);
    act(() => input.blur());
    await waitFor(() => expect(input.classList.contains('invalid')).toBe(true));
  });

  it(`sets the aria-invalid attribute of the input element to true when the
  input is blurred and the underlying field is invalid.`, async () => {
    const input = screen.getByPlaceholderText(placeholder) as HTMLInputElement;
    expect(input.getAttribute('aria-invalid')).toBe('false');

    await user.click(input);
    act(() => input.blur());
    await waitFor(() =>
      expect(input.getAttribute('aria-invalid')).toBe('true'),
    );
  });

  it(`adds styles.invalid to the input's classList when the field is submitted
  while invalid.`, async () => {
    const input = screen.getByPlaceholderText(placeholder) as HTMLInputElement;

    expect(input.classList.contains('invalid')).toBe(false);

    act(() => phoneNumber.setSubmitted());
    await waitFor(() => expect(input.classList.contains('invalid')).toBe(true));
  });

  it(`sets the aria-invalid attribute of the input element to true when the
  field is submitted while invalid.`, async () => {
    const input = screen.getByPlaceholderText(placeholder) as HTMLInputElement;

    expect(input.getAttribute('aria-invalid')).toBe('false');

    act(() => phoneNumber.setSubmitted());
    await waitFor(() =>
      expect(input.getAttribute('aria-invalid')).toBe('true'),
    );
  });

  it(`adds the className it received as a prop to the classList of the input
    element it renders.`, () => {
    const input = screen.getByPlaceholderText(placeholder) as HTMLInputElement;
    expect(input.classList.contains(className)).toBe(true);
  });
});
