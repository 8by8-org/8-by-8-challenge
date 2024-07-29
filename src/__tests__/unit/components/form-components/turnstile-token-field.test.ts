import { TurnstileTokenField } from '@/components/form-components/turnstile/turnstile-token-field';

describe('TurnstileTokenField', () => {
  test(`When setSubmitted() is called, the submitted property of its state 
  becomes true.`, () => {
    const field = new TurnstileTokenField();
    expect(field.state.submitted).toBe(false);

    field.setSubmitted();
    expect(field.state.submitted).toBe(true);
  });
});
