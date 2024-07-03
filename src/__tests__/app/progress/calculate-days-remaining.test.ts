import type { User } from '@/model/types/user';
import { calculateDaysRemaining } from '@/app/progress/calculate-days-remaining';
import { DateTime } from 'luxon';

describe('calculateDaysRemaining', () => {
  it('should return 0 when user is null', () => {
    const result = calculateDaysRemaining(null);
    expect(result).toBe(0);
  });

  it('should return 0 when challengeEndTimestamp is before current date', () => {
    const user: User = {
      challengeEndTimestamp: DateTime.now().minus({ days: 1 }).toUnixInteger(),
    } as User;

    const result = calculateDaysRemaining(user);
    expect(result).toBe(0);
  });

  it('should return a positive number when challengeEndTimestamp after current date', () => {
    const user: User = {
      challengeEndTimestamp: DateTime.now().plus({ days: 8 }).toUnixInteger(),
    } as User;

    const result = calculateDaysRemaining(user);
    expect(result).toBeGreaterThan(0);
  });

  it('should return a 2 when challengeEndTimestamp is two days after current date', () => {
    const date = DateTime.now().plus({ days: 2 }).toUnixInteger();
    const user: User = { challengeEndTimestamp: date } as User;

    const result = calculateDaysRemaining(user);
    expect(result).toBe(2);
  });
});
