import { calculateAge } from '@/app/register/eligibility/utils/calculate-age';
import { DateTime } from 'luxon';

describe('calculateAge', () => {
  it("calculates the user's age", () => {
    for (let i = 0; i <= 100; i++) {
      const dob = DateTime.now().minus({ years: i }).toFormat('yyyy-MM-dd');
      expect(Math.floor(calculateAge(dob))).toBe(i);
    }
  });

  it('returns 0 if the date provided is in the future.', () => {
    const dob = DateTime.now().plus({ years: 1 }).toFormat('yyyy-MM-dd');
    expect(calculateAge(dob)).toBe(0);
  });
});
