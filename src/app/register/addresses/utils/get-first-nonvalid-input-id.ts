import { AddressesForm } from '../addresses-form';
import { HomeAddressForm } from '../home-address/home-address-form';
import { MailingAddressForm } from '../mailing-address/mailing-address-form';
import { PreviousAddressForm } from '../previous-address/previous-address-form';
import { ValidityUtils } from 'fully-formed';

export function getFirstNonValidInputId(
  form: InstanceType<typeof AddressesForm>,
): string | null {
  const { homeAddress, mailingAddress, previousAddress } = form.fields;

  if (!ValidityUtils.isValid(homeAddress)) {
    return getFirstNonValidHomeAddressFieldId(homeAddress);
  }

  if (!ValidityUtils.isValid(mailingAddress) && !mailingAddress.state.exclude) {
    return getFirstNonValidMailingAddressFieldId(mailingAddress);
  }

  if (
    !ValidityUtils.isValid(previousAddress) &&
    !previousAddress.state.exclude
  ) {
    return getFirstNonValidPreviousAddressFieldId(previousAddress);
  }

  return null;
}

function getFirstNonValidHomeAddressFieldId(
  homeAddress: InstanceType<typeof HomeAddressForm>,
): string | null {
  if (!ValidityUtils.isValid(homeAddress.fields.streetLine1)) {
    return homeAddress.fields.streetLine1.id;
  }

  if (!ValidityUtils.isValid(homeAddress.fields.streetLine2)) {
    return homeAddress.fields.streetLine2.id;
  }

  if (!ValidityUtils.isValid(homeAddress.fields.unit)) {
    return homeAddress.fields.unit.id;
  }

  if (!ValidityUtils.isValid(homeAddress.fields.city)) {
    return homeAddress.fields.city.id;
  }

  if (!ValidityUtils.isValid(homeAddress.fields.zip)) {
    return homeAddress.fields.zip.id;
  }

  if (!ValidityUtils.isValid(homeAddress.fields.state)) {
    return homeAddress.fields.state.id;
  }

  if (!ValidityUtils.isValid(homeAddress.fields.phone)) {
    return homeAddress.fields.phone.id;
  }

  if (!ValidityUtils.isValid(homeAddress.fields.phoneType)) {
    return homeAddress.fields.phoneType.id;
  }

  return null;
}

function getFirstNonValidMailingAddressFieldId(
  mailingAddress: InstanceType<typeof MailingAddressForm>,
): string | null {
  if (!ValidityUtils.isValid(mailingAddress.fields.streetLine1)) {
    return mailingAddress.fields.streetLine1.id;
  }

  if (!ValidityUtils.isValid(mailingAddress.fields.streetLine2)) {
    return mailingAddress.fields.streetLine2.id;
  }

  if (!ValidityUtils.isValid(mailingAddress.fields.unit)) {
    return mailingAddress.fields.unit.id;
  }

  if (!ValidityUtils.isValid(mailingAddress.fields.city)) {
    return mailingAddress.fields.city.id;
  }

  if (!ValidityUtils.isValid(mailingAddress.fields.zip)) {
    return mailingAddress.fields.zip.id;
  }

  if (!ValidityUtils.isValid(mailingAddress.fields.state)) {
    return mailingAddress.fields.state.id;
  }

  return null;
}
function getFirstNonValidPreviousAddressFieldId(
  previousAddress: InstanceType<typeof PreviousAddressForm>,
): string | null {
  if (!ValidityUtils.isValid(previousAddress.fields.streetLine1)) {
    return previousAddress.fields.streetLine1.id;
  }

  if (!ValidityUtils.isValid(previousAddress.fields.streetLine2)) {
    return previousAddress.fields.streetLine2.id;
  }

  if (!ValidityUtils.isValid(previousAddress.fields.unit)) {
    return previousAddress.fields.unit.id;
  }

  if (!ValidityUtils.isValid(previousAddress.fields.city)) {
    return previousAddress.fields.city.id;
  }

  if (!ValidityUtils.isValid(previousAddress.fields.zip)) {
    return previousAddress.fields.zip.id;
  }

  if (!ValidityUtils.isValid(previousAddress.fields.state)) {
    return previousAddress.fields.state.id;
  }

  return null;
}
