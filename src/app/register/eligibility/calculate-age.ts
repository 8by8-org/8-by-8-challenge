import { DateTime } from 'luxon';

export function calculateAge(dob: string) {
  const dateOfBirth = DateTime.fromISO(dob);
  const today = DateTime.now();
  const age = Math.min(
    0,
    today.diff(dateOfBirth, 'years').toObject().years ?? 0,
  );
  return age;
}
