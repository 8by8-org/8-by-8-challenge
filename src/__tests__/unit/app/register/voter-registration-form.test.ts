import { VoterRegistrationForm } from '@/app/register/voter-registration-form';
import { Builder } from 'builder-pattern';
import type { User } from '@/model/types/user';

describe('VoterRegistrationForm', () => {
  it("initializes the email field of the eligibility form to the user's email.", () => {
    const user = Builder<User>().email('user@example.com').build();
    const form = new VoterRegistrationForm(user);
    expect(form.fields.eligibility.fields.email.state.value).toBe(user.email);
  });

  it(`initializes the email field of the eligibility form to an empty string if 
  the user is null.`, () => {
    const form = new VoterRegistrationForm(null);
    expect(form.fields.eligibility.fields.email.state.value).toBe('');
  });
});
