import { ValidityUtils } from 'fully-formed';
import type { AddressesForm } from '../addresses-form';
import type { HomeAddressForm } from '../home-address/home-address-form';
import type { AddressForm } from '../address-confirmation-modal/types/address-form';

export function getFirstNonValidInputId(
  form: InstanceType<typeof AddressesForm>,
): string | null {
  const { homeAddress, mailingAddress, previousAddress } = form.fields;

  const firstNonValidHomeAddressFieldId =
    getFirstNonValidHomeAddressFieldId(homeAddress);
  if (firstNonValidHomeAddressFieldId) return firstNonValidHomeAddressFieldId;

  const firstNonValidMailingAddressId =
    !mailingAddress.state.exclude &&
    getFirstNonValidAddressFormFieldId(mailingAddress);
  if (firstNonValidMailingAddressId) return firstNonValidMailingAddressId;

  const firstNonValidPreviousAddressId =
    !previousAddress.state.exclude &&
    getFirstNonValidAddressFormFieldId(previousAddress);
  if (firstNonValidPreviousAddressId) return firstNonValidPreviousAddressId;

  return null;
}

function getFirstNonValidHomeAddressFieldId(
  homeAddressForm: InstanceType<typeof HomeAddressForm>,
): string | undefined {
  if (!ValidityUtils.isValid(homeAddressForm.fields.streetLine1)) {
    return homeAddressForm.fields.streetLine1.id;
  }

  if (!ValidityUtils.isValid(homeAddressForm.fields.streetLine2)) {
    return homeAddressForm.fields.streetLine2.id;
  }

  if (!ValidityUtils.isValid(homeAddressForm.fields.city)) {
    return homeAddressForm.fields.city.id;
  }

  if (!ValidityUtils.isValid(homeAddressForm.fields.zip)) {
    return homeAddressForm.fields.zip.id;
  }

  if (!ValidityUtils.isValid(homeAddressForm.fields.state)) {
    return homeAddressForm.fields.state.id;
  }

  if (!ValidityUtils.isValid(homeAddressForm.fields.phone)) {
    return homeAddressForm.fields.phone.id;
  }

  if (!ValidityUtils.isValid(homeAddressForm.fields.phoneType)) {
    return homeAddressForm.fields.phoneType.id;
  }
}

function getFirstNonValidAddressFormFieldId(
  addressForm: AddressForm,
): string | undefined {
  if (!ValidityUtils.isValid(addressForm.fields.streetLine1)) {
    return addressForm.fields.streetLine1.id;
  }

  if (!ValidityUtils.isValid(addressForm.fields.streetLine2)) {
    return addressForm.fields.streetLine2.id;
  }

  if (!ValidityUtils.isValid(addressForm.fields.city)) {
    return addressForm.fields.city.id;
  }

  if (!ValidityUtils.isValid(addressForm.fields.zip)) {
    return addressForm.fields.zip.id;
  }

  if (!ValidityUtils.isValid(addressForm.fields.state)) {
    return addressForm.fields.state.id;
  }
}
