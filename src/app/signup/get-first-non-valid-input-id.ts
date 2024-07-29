import { ValidityUtils } from 'fully-formed';
import { SignUpForm } from './signup-form';

/**
 * Takes in an instance of {@link SignUpForm} and returns the id of the first
 * field that is not valid, or null if the form is valid.
 *
 * @param signUpForm - An instance of {@link SignUpForm}.
 * @returns A string if the form is not valid, or null if the form is valid.
 */
export function getFirstNonValidInputId({
  fields,
  groups,
}: InstanceType<typeof SignUpForm>): string | null {
  if (!ValidityUtils.isValid(fields.name)) {
    return fields.name.id;
  }
  if (!ValidityUtils.isValid(fields.email)) {
    return fields.email.id;
  }
  if (
    !ValidityUtils.isValid(fields.confirmEmail) ||
    !ValidityUtils.isValid(groups.emailGroup)
  ) {
    return fields.confirmEmail.id;
  }
  if (!ValidityUtils.isValid(fields.captchaToken)) {
    return fields.captchaToken.id;
  }

  return null;
}
