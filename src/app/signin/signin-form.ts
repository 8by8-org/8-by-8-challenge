import {
  FormTemplate,
  Field,
  StringValidators,
  FormFactory,
} from 'fully-formed';
import { TurnstileTokenField } from '@/components/form-components/turnstile/turnstile-token-field';

class SignInFormTemplate extends FormTemplate {
  public readonly fields = [
    new Field({
      name: 'email',
      defaultValue: '',
      validators: [
        StringValidators.email({
          invalidMessage: 'Please enter a valid email address.',
        }),
      ],
    }),
    new TurnstileTokenField(),
  ] as const;

  public readonly autoTrim = {
    include: ['email'],
  };
}

export const SignInForm = FormFactory.createForm(SignInFormTemplate);
