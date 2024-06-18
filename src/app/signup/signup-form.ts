import { TurnstileTokenField } from '@/components/form-components/turnstile/turnstile-token-field';
import { Avatar } from '@/model/types/avatar';
import {
  FormTemplate,
  Field,
  StringValidators,
  Group,
  FormFactory,
} from 'fully-formed';

class SignUpTemplate extends FormTemplate {
  public readonly fields = [
    new Field({
      name: 'name',
      defaultValue: '',
      validators: [
        StringValidators.required({
          invalidMessage: 'Please enter your name.',
          trimBeforeValidation: true,
        }),
      ],
    }),
    new Field({
      name: 'email',
      defaultValue: '',
      validators: [
        StringValidators.email({
          invalidMessage: 'Please enter a valid email address.',
          trimBeforeValidation: true,
        }),
      ],
    }),
    new Field({
      name: 'confirmEmail',
      defaultValue: '',
      validators: [
        StringValidators.required({
          invalidMessage: 'Please re-enter your email address.',
          trimBeforeValidation: true,
        }),
      ],
      transient: true,
    }),
    new Field<'avatar', Avatar, false>({
      name: 'avatar',
      defaultValue: '0',
    }),
    new TurnstileTokenField(),
  ] as const;

  public readonly groups = [
    new Group({
      name: 'emailGroup',
      members: [this.fields[1], this.fields[2]],
      validatorTemplates: [
        {
          predicate: ({ email, confirmEmail }) => {
            return email.trim() === confirmEmail.trim();
          },
          invalidMessage:
            'Please ensure the re-entered email address matches the email address.',
        },
      ],
    }),
  ] as const;

  public readonly autoTrim = {
    exclude: ['captchaToken'],
  };
}

export const SignUpForm = FormFactory.createForm(SignUpTemplate);
