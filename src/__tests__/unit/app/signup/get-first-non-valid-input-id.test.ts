import { SignUpForm } from '@/app/signup/signup-form';
import { getFirstNonValidInputId } from '@/app/signup/get-first-non-valid-input-id';

describe('getFirstNoNValidInputId', () => {
  let form: InstanceType<typeof SignUpForm>;

  beforeEach(() => {
    form = new SignUpForm();
  });

  it('returns "name" if the name field is invalid.', () => {
    expect(getFirstNonValidInputId(form)).toBe(form.fields.name.id);
  });

  it('returns "email" if "name" is valid and "email" is not.', () => {
    form.fields.name.setValue('user');
    expect(getFirstNonValidInputId(form)).toBe(form.fields.email.id);
  });

  it(`returns "confirmEmail" if "name" and "email" are valid and "confirmEmail"
  is not.`, () => {
    form.fields.name.setValue('user');
    form.fields.email.setValue('user@example.com');
    expect(getFirstNonValidInputId(form)).toBe(form.fields.confirmEmail.id);
  });

  it(`returns "confirmEmail" if "name," "email," and "confirmEmail" are valid, 
  but the re-entered email address does not match the value of "email."`, () => {
    form.fields.name.setValue('user');
    form.fields.email.setValue('user@example.com');
    form.fields.confirmEmail.setValue('wrongemail@example.com');
    expect(getFirstNonValidInputId(form)).toBe(form.fields.confirmEmail.id);
  });

  it(`returns "turnstile-widget" if all fields except the captchaToken field 
  are valid.`, () => {
    form.fields.name.setValue('user');
    form.fields.email.setValue('user@example.com');
    form.fields.confirmEmail.setValue('user@example.com');
    expect(getFirstNonValidInputId(form)).toBe(form.fields.captchaToken.id);
  });

  it('returns null if all fields are valid.', () => {
    form.fields.name.setValue('user');
    form.fields.email.setValue('user@example.com');
    form.fields.confirmEmail.setValue('user@example.com');
    form.fields.captchaToken.onVerify('');
    expect(getFirstNonValidInputId(form)).toBe(null);
  });
});
