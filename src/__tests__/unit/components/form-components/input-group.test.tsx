import { render, screen, cleanup, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InputGroup } from '@/components/form-components/input-group';
import { Field, Group, StringValidators } from 'fully-formed';

describe('InputGroup', () => {
  afterEach(cleanup);

  it(`renders an input element whose name and id are set to the name and id of 
  the field it received.`, () => {
    const field = new Field({
      name: 'testField',
      defaultValue: '',
    });

    render(
      <InputGroup
        field={field}
        type="text"
        labelVariant="stationary"
        labelContent=""
      />,
    );

    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.name).toBe(field.name);
    expect(input.id).toBe(field.id);
  });

  it(`renders an input element whose aria-describedby attribute is set to the id 
  of the Messages component it renders.`, () => {
    const invalidEmailMessage = 'Please enter a valid email address.';

    const email = new Field({
      name: 'email',
      defaultValue: '',
      validators: [
        StringValidators.email({
          invalidMessage: invalidEmailMessage,
        }),
      ],
    });

    render(
      <InputGroup
        field={email}
        type="text"
        labelVariant="stationary"
        labelContent=""
      />,
    );

    const input = screen.getByRole('textbox') as HTMLInputElement;
    const messagesId = `${email.id}-messages`;
    expect(input.getAttribute('aria-describedby')).toBe(messagesId);

    const messages = document.getElementById(messagesId);
    expect(messages).toBeTruthy();
    expect(messages!.children[0].textContent).toBe(invalidEmailMessage);
  });

  it(`renders a label element whose htmlFor attribute is set to the id of the 
  field it received.`, () => {
    const labelText = 'Test Label';

    const field = new Field({
      name: 'testField',
      defaultValue: '',
    });

    render(
      <InputGroup
        field={field}
        type="text"
        labelVariant="stationary"
        labelContent={labelText}
      />,
    );

    const label = screen.getByText(labelText) as HTMLLabelElement;
    expect(label.htmlFor).toBe(field.id);
  });

  it(`hides messages if user has not modified the input, the input has not 
  been blurred, and the field has not been submitted. Once the user has 
  modified the field, it has been blurred, or it has been submitted, messages 
  are displayed.`, async () => {
    const messages = ['Email address is valid.', 'The email addresses match.'];

    const email = new Field({
      name: 'email',
      defaultValue: 'user@example.com',
      validators: [StringValidators.email()],
    });

    const confirmEmail = new Field({
      name: 'confirmEmail',
      defaultValue: 'user@example.com',
      validators: [
        StringValidators.email({
          validMessage: messages[0],
        }),
      ],
    });

    const emailGroup = new Group({
      name: 'emailGroup',
      members: [email, confirmEmail],
      validatorTemplates: [
        {
          predicate: ({ email, confirmEmail }) => confirmEmail === email,
          validMessage: messages[1],
        },
      ],
    });

    const user = userEvent.setup();
    render(
      <InputGroup
        field={confirmEmail}
        groups={[emailGroup]}
        type="text"
        labelVariant="stationary"
        labelContent=""
      />,
    );

    let messageComponents = messages.map(message => screen.getByText(message));
    expect(
      messageComponents.every(component =>
        component.classList.contains('hidden_message'),
      ),
    ).toBe(true);

    // The messages should remain hidden when the field first receives focus
    const input = screen.getByRole('textbox');
    act(() => input.focus());
    await waitFor(() =>
      expect(
        messageComponents.every(component =>
          component.classList.contains('hidden_message'),
        ),
      ).toBe(true),
    );

    // The messages should become visible once the field is blurred
    act(() => input.blur());
    await waitFor(() =>
      expect(
        messageComponents.some(component =>
          component.classList.contains('hidden_message'),
        ),
      ).toBe(false),
    );

    // The messages should revert to being hidden when the field is reset
    act(() => confirmEmail.reset());
    await waitFor(() =>
      expect(
        messageComponents.every(component =>
          component.classList.contains('hidden_message'),
        ),
      ).toBe(true),
    );

    // The messages should become visible once the user has modified the field
    await user.clear(input);
    await user.type(input, email.state.value);

    messageComponents = messages.map(message => screen.getByText(message));
    expect(messageComponents.length).toBe(2);

    await waitFor(() =>
      expect(
        messageComponents.some(component =>
          component.classList.contains('hidden_message'),
        ),
      ).toBe(false),
    );

    // Reset the field again to hide the messages
    act(() => confirmEmail.reset());
    await waitFor(() =>
      expect(
        messageComponents.every(component =>
          component.classList.contains('hidden_message'),
        ),
      ).toBe(true),
    );

    // The messages should become visible once the field has been submitted
    act(() => confirmEmail.setSubmitted());
    await waitFor(() =>
      expect(
        messageComponents.some(component =>
          component.classList.contains('hidden_message'),
        ),
      ).toBe(false),
    );
  });
});
