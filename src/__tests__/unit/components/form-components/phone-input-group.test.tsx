import { render, screen, cleanup, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { PhoneInputGroup } from '@/components/form-components/phone-input-group';
import { Field, Group, Validity } from 'fully-formed';

describe('PhoneInputGroup', () => {
  afterEach(cleanup);

  it(`renders an input element whose name and id are set to the name and id of 
  the field it received.`, () => {
    const phoneNumber = new Field({
      name: 'phoneNumber',
      defaultValue: '',
    });

    render(
      <PhoneInputGroup
        field={phoneNumber}
        labelVariant="stationary"
        labelContent=""
      />,
    );

    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.name).toBe(phoneNumber.name);
    expect(input.id).toBe(phoneNumber.id);
  });

  it(`renders an input element whose aria-describedby attribute includes the id 
  of the Messages component it renders.`, () => {
    const invalidMessage = 'Please enter a valid phone number.';

    const phoneNumber = new Field({
      name: 'phoneNumber',
      defaultValue: '',
      validatorTemplates: [
        {
          predicate: value => /^\d{10}$/.test(value),
          invalidMessage,
        },
      ],
    });

    render(
      <PhoneInputGroup
        field={phoneNumber}
        labelVariant="stationary"
        labelContent=""
      />,
    );

    const input = screen.getByRole('textbox') as HTMLInputElement;
    const messagesId = `${phoneNumber.id}-messages`;
    expect(input.getAttribute('aria-describedby')).toContain(messagesId);

    const messages = document.getElementById(messagesId);
    expect(messages).toBeTruthy();
    expect(messages!.children[0].textContent).toBe(invalidMessage);
  });

  it(`renders a label element whose htmlFor attribute is set to the id of the 
  field it received.`, () => {
    const labelText = 'Phone number';

    const phoneNumber = new Field({
      name: 'phoneNumber',
      defaultValue: '',
    });

    render(
      <PhoneInputGroup
        field={phoneNumber}
        labelVariant="stationary"
        labelContent={labelText}
      />,
    );

    const label = screen.getByText(labelText) as HTMLLabelElement;
    expect(label.htmlFor).toBe(phoneNumber.id);
  });

  it(`hides messages if user has not modified the input, the input has not 
  been blurred, and the field has not been submitted. Once the user has 
  modified the field, it has been blurred, or it has been submitted, messages 
  are displayed.`, async () => {
    const messages = ['Phone number is valid.', 'The phone numbers match.'];

    const phoneNumber = new Field({
      name: 'phoneNumber',
      defaultValue: '1112223333',
      validatorTemplates: [
        {
          predicate: value => /^\d{10}$/.test(value),
          validMessage: messages[0],
        },
      ],
    });

    const confirmPhoneNumber = new Field({
      name: 'confirmPhoneNumber',
      defaultValue: '1112223333',
      validatorTemplates: [
        {
          predicate: value => /^\d{10}$/.test(value),
          validMessage: messages[0],
        },
      ],
    });

    const phoneGroup = new Group({
      name: 'phoneGroup',
      members: [phoneNumber, confirmPhoneNumber],
      validatorTemplates: [
        {
          predicate: ({ phoneNumber, confirmPhoneNumber }) =>
            phoneNumber === confirmPhoneNumber,
          validMessage: messages[1],
        },
      ],
    });

    const user = userEvent.setup();
    render(
      <PhoneInputGroup
        field={confirmPhoneNumber}
        groups={[phoneGroup]}
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
    act(() => confirmPhoneNumber.reset());
    await waitFor(() =>
      expect(
        messageComponents.every(component =>
          component.classList.contains('hidden_message'),
        ),
      ).toBe(true),
    );

    // The messages should become visible once the user has modified the field
    await user.clear(input);
    await user.type(input, phoneNumber.state.value);
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
    act(() => confirmPhoneNumber.reset());
    await waitFor(() =>
      expect(
        messageComponents.every(component =>
          component.classList.contains('hidden_message'),
        ),
      ).toBe(true),
    );

    // The messages should become visible once the field has been submitted
    act(() => confirmPhoneNumber.setSubmitted());
    await waitFor(() =>
      expect(
        messageComponents.some(component =>
          component.classList.contains('hidden_message'),
        ),
      ).toBe(false),
    );
  });

  it(`displays a warning icon when the field's validity is Validity.Caution and 
  the field has been blurred.`, () => {
    const field = new Field({
      name: 'phone',
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
      <PhoneInputGroup
        field={field}
        labelVariant="floating"
        labelContent="Phone number"
      />,
    );
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
      <PhoneInputGroup
        field={field}
        labelVariant="floating"
        labelContent="Phone number"
      />,
    );

    expect(screen.queryByAltText(/warning icon/i)).not.toBeInTheDocument();

    act(() => field.setValue('0123456789'));
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

    render(
      <PhoneInputGroup
        field={field}
        labelVariant="floating"
        labelContent="Phone number"
      />,
    );

    expect(screen.queryByAltText(/warning icon/i)).not.toBeInTheDocument();

    act(() => field.setSubmitted());
    expect(screen.queryByAltText(/warning icon/i)).toBeInTheDocument();
  });
});
