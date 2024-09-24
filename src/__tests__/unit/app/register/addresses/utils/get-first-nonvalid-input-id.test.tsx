import { getFirstNonValidInputId } from '@/app/register/addresses/utils/get-first-nonvalid-input-id';
import { AddressesForm } from '@/app/register/addresses/addresses-form';
import { Field } from 'fully-formed';
import { AddressForm } from '@/app/register/addresses/address-confirmation-modal/types/address-form';
import { Validity } from 'fully-formed';

describe('getFirstNonValidInputId', () => {
  let addressesForm: InstanceType<typeof AddressesForm>;

  beforeEach(() => {
    const zip = new Field({ name: 'zip', defaultValue: '80301' });
    addressesForm = new AddressesForm(zip);

    // Fill out all required fields
    const address = {
      streetLine1: '2930 Pearl St.',
      streetLine2: 'Suite 100',
      city: 'Boulder',
      zip: '80301',
    };

    for (const form of Object.values(addressesForm.fields)) {
      for (const [field, value] of Object.entries(address)) {
        (form as AddressForm).fields[
          field as keyof AddressForm['fields']
        ].setValue(value);
      }
    }
  });

  it(`returns the id of the first non-valid field or null if all fields are 
  valid.`, () => {
    for (const form of Object.values(addressesForm.fields)) {
      for (const field of Object.values(form.fields)) {
        field.setValidityAndMessages(Validity.Caution, []);
      }
    }

    for (const field of Object.values(
      addressesForm.fields.homeAddress.fields,
    )) {
      expect(getFirstNonValidInputId(addressesForm)).toBe(field.id);
      field.setValidityAndMessages(Validity.Valid, []);
    }

    expect(getFirstNonValidInputId(addressesForm)).toBe(null);

    addressesForm.fields.mailingAddress.setExclude(false);

    for (const field of Object.values(
      addressesForm.fields.mailingAddress.fields,
    )) {
      expect(getFirstNonValidInputId(addressesForm)).toBe(field.id);
      field.setValidityAndMessages(Validity.Valid, []);
    }

    expect(getFirstNonValidInputId(addressesForm)).toBe(null);

    addressesForm.fields.previousAddress.setExclude(false);

    for (const field of Object.values(
      addressesForm.fields.previousAddress.fields,
    )) {
      expect(getFirstNonValidInputId(addressesForm)).toBe(field.id);
      field.setValidityAndMessages(Validity.Valid, []);
    }

    expect(getFirstNonValidInputId(addressesForm)).toBe(null);
  });

  it('returns null if an unexpected field is not valid.', () => {
    addressesForm.fields.homeAddress.fields.phoneType.setValidityAndMessages(
      Validity.Invalid,
      [],
    );
  });
});
