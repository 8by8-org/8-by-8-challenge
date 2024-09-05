import { applyCautionValidityToFormFields } from '@/app/register/addresses/utils/apply-caution-validity-to-form-fields';
import { AddressesForm } from '@/app/register/addresses/addresses-form';
import { AddressErrorTypes } from '@/model/types/addresses/address-error-types';
import { Field, ValidityUtils } from 'fully-formed';
import type { ReviewRecommendedAddressError } from '@/model/types/addresses/review-recommended-address-error';
import type { UnconfirmedComponentsError } from '@/model/types/addresses/unconfirmed-components-error';

describe('applyCautionValiditytoFormFields', () => {
  it(`applies Validity.Caution to all fields that have issues when it receives 
  a ReviewRecommendedAddressError.`, () => {
    const error: ReviewRecommendedAddressError = {
      type: AddressErrorTypes.ReviewRecommendedAddress,
      form: 'homeAddress',
      enteredAddress: {
        streetLine1: {
          value: '1600 Aphmitheater Pwky',
          hasIssue: true,
        },
        city: {
          value: 'Montan View',
          hasIssue: true,
        },
        state: {
          value: 'CA',
          hasIssue: false,
        },
        zip: {
          value: '94043',
          hasIssue: false,
        },
      },
      recommendedAddress: {
        streetLine1: {
          value: '1600 Amphitheatre Pkwy',
          hasIssue: true,
        },
        city: {
          value: 'Mountain View',
          hasIssue: true,
        },
        state: {
          value: 'CA',
          hasIssue: false,
        },
        zip: {
          value: '94043',
          hasIssue: false,
        },
      },
    };

    const form = new AddressesForm(
      new Field({ name: 'zip', defaultValue: '94043' }),
    );

    applyCautionValidityToFormFields(form, [error]);

    expect(
      ValidityUtils.isCaution(form.fields.homeAddress.fields.streetLine1),
    ).toBe(true);
    expect(
      ValidityUtils.isCaution(form.fields.homeAddress.fields.streetLine2),
    ).toBe(false);
    expect(ValidityUtils.isCaution(form.fields.homeAddress.fields.city)).toBe(
      true,
    );
    expect(ValidityUtils.isCaution(form.fields.homeAddress.fields.state)).toBe(
      false,
    );
    expect(ValidityUtils.isCaution(form.fields.homeAddress.fields.zip)).toBe(
      false,
    );
  });

  it(`applies Validity.Caution to all fields that have issues when it receives 
  an UnconfirmedComponentsError.`, () => {
    const error: UnconfirmedComponentsError = {
      type: AddressErrorTypes.UnconfirmedComponents,
      form: 'homeAddress',
      unconfirmedAddressComponents: {
        streetLine1: {
          value: '2930 Pearl St.',
          hasIssue: false,
        },
        streetLine2: {
          value: 'Suite 100',
          hasIssue: true,
        },
        city: {
          value: 'Boulder',
          hasIssue: false,
        },
        state: {
          value: 'CA',
          hasIssue: true,
        },
        zip: {
          value: '80301',
          hasIssue: false,
        },
      },
    };

    const form = new AddressesForm(
      new Field({ name: 'zip', defaultValue: '80301' }),
    );

    applyCautionValidityToFormFields(form, [error]);

    expect(
      ValidityUtils.isCaution(form.fields.homeAddress.fields.streetLine1),
    ).toBe(false);
    expect(
      ValidityUtils.isCaution(form.fields.homeAddress.fields.streetLine2),
    ).toBe(true);
    expect(ValidityUtils.isCaution(form.fields.homeAddress.fields.city)).toBe(
      false,
    );
    expect(ValidityUtils.isCaution(form.fields.homeAddress.fields.state)).toBe(
      true,
    );
    expect(ValidityUtils.isCaution(form.fields.homeAddress.fields.zip)).toBe(
      false,
    );
  });
});
