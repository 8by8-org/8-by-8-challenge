import { render, screen, cleanup } from '@testing-library/react';
import { Messages } from '@/components/form-components/messages';
import { Field, StringValidators, Group } from 'fully-formed';

describe('Messages', () => {
  it(`Renders Message components for each of its message bearer's messages.`, () => {
    const validEmailMessage = 'Email address is valid.';
    const validEmailGroupMessage = 'The email addresses match.';

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
          validMessage: validEmailMessage,
        }),
      ],
    });

    const emailGroup = new Group({
      name: 'emailGroup',
      members: [email, confirmEmail],
      validatorTemplates: [
        {
          predicate: ({ email, confirmEmail }) => confirmEmail === email,
          validMessage: validEmailGroupMessage,
        },
      ],
    });

    render(<Messages messageBearers={[confirmEmail, emailGroup]} />);

    expect(screen.queryByText(validEmailMessage)).toBeTruthy();
    expect(screen.queryByText(validEmailGroupMessage)).toBeTruthy();
  });

  it(`applies the hidden_message class to all of its messages if its 
  hideMessages prop is true.`, () => {
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

    render(
      <Messages
        messageBearers={[confirmEmail, emailGroup]}
        hideMessages={true}
      />,
    );

    messages.forEach(message => {
      expect(
        screen.getByText(message).classList.contains('hidden_message'),
      ).toBe(true);
    });
  });

  test(`If it received a containerClassName prop, that className is added to 
  the classList of the container it renders.`, () => {
    const containerClassName = 'containerClassName';

    render(
      <Messages messageBearers={[]} containerClassName={containerClassName} />,
    );

    expect(document.getElementsByClassName(containerClassName).length).toBe(1);
  });
});
