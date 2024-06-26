import {
  Field,
  StringValidators,
  FormTemplate,
  FormFactory,
} from 'fully-formed';
import { TurnstileTokenField } from '@/components/form-components/turnstile/turnstile-token-field';

class SignInWithOTPTemplate extends FormTemplate {
  public readonly fields = [
    new Field({
      name: 'otp',
      defaultValue: '',
      validators: [
        StringValidators.required({
          invalidMessage: 'Please enter the one-time passcode we sent you.',
        }),
      ],
    }),
    new TurnstileTokenField(),
  ] as const;
}

export const SignInWithOTPForm = FormFactory.createForm(SignInWithOTPTemplate);
