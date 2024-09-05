import { getFirstNonValidInputId } from '@/app/register/other-details/get-first-non-valid-input-id';
import { OtherDetailsForm } from '@/app/register/other-details/other-details-form';

describe('getFirstNonValidInputId', () => {
  it(`returns the id of the first non-valid field and null if all fields are 
  valid.`, () => {
    const form = new OtherDetailsForm();
    expect(getFirstNonValidInputId(form)).toBe(form.fields.party.id);

    form.fields.party.setValue('democratic');
    expect(getFirstNonValidInputId(form)).toBe(form.fields.race.id);

    form.fields.party.setValue('other');
    expect(getFirstNonValidInputId(form)).toBe(form.fields.otherParty.id);

    form.fields.otherParty.setValue('Some other party');
    expect(getFirstNonValidInputId(form)).toBe(form.fields.race.id);

    form.fields.race.setValue('Decline to state');
    expect(getFirstNonValidInputId(form)).toBe(form.fields.id.id);

    form.fields.id.setValue('1234');
    expect(getFirstNonValidInputId(form)).toBe(null);
  });
});
