import { OtherDetailsForm } from './other-details-form';
import { ValidityUtils } from 'fully-formed';

export function getFirstNonValidInputId(
  otherDetailsForm: InstanceType<typeof OtherDetailsForm>,
): string | null {
  if (!ValidityUtils.isValid(otherDetailsForm.fields.party)) {
    return otherDetailsForm.fields.party.id;
  }

  if (
    !otherDetailsForm.fields.otherParty.state.exclude &&
    !ValidityUtils.isValid(otherDetailsForm.fields.otherParty)
  ) {
    return otherDetailsForm.fields.otherParty.id;
  }

  if (!ValidityUtils.isValid(otherDetailsForm.fields.race)) {
    return otherDetailsForm.fields.race.id;
  }

  if (!ValidityUtils.isValid(otherDetailsForm.fields.idNumber)) {
    return otherDetailsForm.fields.idNumber.id;
  }

  return null;
}
