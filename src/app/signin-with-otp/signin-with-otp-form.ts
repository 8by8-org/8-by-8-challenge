import {
  Field,
  StringValidators,
  FormTemplate,
  FormFactory,
} from 'fully-formed';

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
  ] as const;
}

export const SignInWithOTPForm = FormFactory.createForm(SignInWithOTPTemplate);
