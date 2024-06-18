import { render, cleanup, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '@/components/form-components/input';
import { Field, StringValidators } from 'fully-formed';

describe('Input', () => {
  afterEach(cleanup);

  it(`renders an input element whose name and id match that of the provided 
  field.`, () => {
    const field = new Field({
      name: 'testField',
      id: 'test-field',
      defaultValue: '',
    });

    render(<Input field={field} type="text" />);

    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.name).toBe('testField');
    expect(input.id).toBe('test-field');
  });

  it(`renders an input element whose value is controlled by the provided 
  field.`, async () => {
    const field = new Field({
      name: 'testField',
      defaultValue: 'test',
    });

    const user = userEvent.setup();
    render(<Input field={field} type="text" />);

    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('test');

    await user.clear(input);
    await waitFor(() => expect(input.value).toBe(''));
    expect(field.state.value).toBe('');

    await user.type(input, 'test');
    await waitFor(() => expect(input.value).toBe('test'));
    expect(field.state.value).toBe('test');
  });

  it(`adds styles.invalid to the input's classList when the user modifies the 
  field and it is invalid.`, async () => {
    const email = new Field({
      name: 'email',
      defaultValue: '',
      validators: [StringValidators.email()],
    });

    const user = userEvent.setup();
    render(<Input field={email} type="email" />);

    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.classList.contains('invalid')).toBe(false);

    await user.type(input, 'u');
    await waitFor(() => expect(input.classList.contains('invalid')).toBe(true));
  });

  it(`sets the aria-invalid attribute of the input element to true when the user
  modifies the field and it is invalid.`, async () => {
    const email = new Field({
      name: 'email',
      defaultValue: '',
      validators: [StringValidators.email()],
    });

    const user = userEvent.setup();
    render(<Input field={email} type="email" />);

    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.getAttribute('aria-invalid')).toBe('false');

    await user.type(input, 'u');
    await waitFor(() =>
      expect(input.getAttribute('aria-invalid')).toBe('true'),
    );
  });

  it(`adds styles.invalid to the input's classList when the input is blurred.`, async () => {
    const email = new Field({
      name: 'email',
      defaultValue: '',
      validators: [StringValidators.email()],
    });

    render(<Input field={email} type="email" />);

    const input = screen.getByRole('textbox') as HTMLInputElement;
    act(() => input.focus());
    expect(input.classList.contains('invalid')).toBe(false);

    act(() => input.blur());
    await waitFor(() => expect(input.classList.contains('invalid')).toBe(true));
  });

  it(`sets the aria-invalid attribute of the input element to true when the 
  input is blurred.`, async () => {
    const email = new Field({
      name: 'email',
      defaultValue: '',
      validators: [StringValidators.email()],
    });

    render(<Input field={email} type="email" />);

    const input = screen.getByRole('textbox') as HTMLInputElement;
    act(() => input.focus());
    expect(input.getAttribute('aria-invalid')).toBe('false');

    act(() => input.blur());
    await waitFor(() =>
      expect(input.getAttribute('aria-invalid')).toBe('true'),
    );
  });

  it(`adds the className it received as a prop to the classList of the input 
  element it renders.`, () => {
    const expectedClassName = 'testClassName';

    render(
      <Input
        field={
          new Field({
            name: '',
            defaultValue: '',
          })
        }
        type="text"
        className={expectedClassName}
      />,
    );

    const input = screen.getByRole('textbox');
    expect(input.classList.contains(expectedClassName)).toBe(true);
  });

  it(`prevents the user from entering additional characters if maxLength has 
  been set.`, async () => {
    const field = new Field({
      name: '',
      defaultValue: '',
    });

    const user = userEvent.setup();

    render(<Input field={field} type="text" maxLength={3} />);

    const input = screen.getByRole('textbox');
    await user.type(input, '123456');

    expect(field.state.value).toBe('123');
  });
});
