import { getFirstNonValidInputId } from '@/app/register/eligibility/utils/get-first-non-valid-input-id';
import { EligibilityForm } from '@/app/register/eligibility/eligibility-form';

describe('getFirstNonValidInputId', () => {
  it(`returns the id of the first non-valid field, or null if all fields are 
  valid.`, () => {
    const form = new EligibilityForm('user@example.com');
    expect(getFirstNonValidInputId(form)).toBe(form.fields.zip.id);

    form.fields.zip.setValue('12345');
    expect(getFirstNonValidInputId(form)).toBe(form.fields.dob.id);

    form.fields.dob.setValue('1990-01-01');
    expect(getFirstNonValidInputId(form)).toBe(form.fields.eighteenPlus.id);

    form.fields.eighteenPlus.setValue(true);
    expect(getFirstNonValidInputId(form)).toBe(form.fields.isCitizen.id);

    form.fields.isCitizen.setValue(true);
    expect(getFirstNonValidInputId(form)).toBeNull();
  });
});
