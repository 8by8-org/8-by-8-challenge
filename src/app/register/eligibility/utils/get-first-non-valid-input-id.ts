import { ValidityUtils } from 'fully-formed';
import type { EligibilityForm } from '../eligibility-form';

export function getFirstNonValidInputId(
  eligibilityForm: InstanceType<typeof EligibilityForm>,
): string | null {
  if (!ValidityUtils.isValid(eligibilityForm.fields.zip)) {
    return eligibilityForm.fields.zip.id;
  }

  if (!ValidityUtils.isValid(eligibilityForm.fields.dob)) {
    return eligibilityForm.fields.dob.id;
  }

  if (!ValidityUtils.isValid(eligibilityForm.fields.eighteenPlus)) {
    return eligibilityForm.fields.eighteenPlus.id;
  }

  if (!ValidityUtils.isValid(eligibilityForm.fields.isCitizen)) {
    return eligibilityForm.fields.isCitizen.id;
  }

  return null;
}
