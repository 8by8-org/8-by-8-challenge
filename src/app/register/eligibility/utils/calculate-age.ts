import { DateTime } from 'luxon';

/**
 * Calculates the user's age based on their date of birth.
 *
 * @param dob - The user's date of birth. A string in the format yyyy-MM-dd.
 * @returns The user's age.
 */
export function calculateAge(dob: string) {
  const dateOfBirth = DateTime.fromISO(dob);
  const today = DateTime.now();
  const age = Math.max(
    0,
    /* istanbul ignore next */
    today.diff(dateOfBirth, 'years').toObject().years ?? 0,
  );
  return age;
}
