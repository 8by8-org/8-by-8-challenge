import { getPreregistrationInfo } from '@/app/register/eligibility/utils/get-preregistration-info';
import { US_STATE_ABBREVIATIONS } from '@/constants/us-state-abbreviations';

describe('getPreregistrationInfo', () => {
  it('returns an empty string if the provided state is null.', () => {
    expect(getPreregistrationInfo(null)).toBe('');
  });

  it('returns an empty string if the state is not found in the table.', () => {
    expect(getPreregistrationInfo(US_STATE_ABBREVIATIONS.NORTH_DAKOTA)).toBe(
      '',
    );
  });

  it('returns a state-specific message if the state is found.', () => {
    for (const state of Object.values(US_STATE_ABBREVIATIONS)) {
      if (state === US_STATE_ABBREVIATIONS.NORTH_DAKOTA) {
        continue;
      }

      expect(getPreregistrationInfo(state)).toEqual(
        expect.stringMatching(/.+/),
      );
    }
  });
});
