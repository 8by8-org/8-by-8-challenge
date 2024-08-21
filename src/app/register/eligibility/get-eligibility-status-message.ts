import zipToState from 'zip-state';
import { calculateAge } from './calculate-age';
import { DateTime } from 'luxon';

const MIN_AGE_16_STATES = [
  'CA',
  'CO',
  'DC',
  'DE',
  'FL',
  'HI',
  'LA',
  'MD',
  'MA',
  'NY',
  'NC',
  'OR',
  'RI',
  'UT',
  'VA',
  'WA',
];
const MIN_AGE_17_STATES = ['ME', 'NV', 'NJ', 'WV'];
const MIN_AGE_17_5_STATES = ['GA', 'IA', 'MO'];

/*
  Verify this information. this can also be simplified a bit to match the figma.
*/
export function getEligibilityStatusMessage(dob: string, zip: string) {
  const age = calculateAge(dob);

  if (age >= 18) {
    return '';
  }

  const state = zipToState(zip)!;

  if (MIN_AGE_16_STATES.includes(state)) {
    if (age >= 16) {
      return `Your state (${state}) permits preregistration beginning at age 16. Please note that you must be 18 at the time of the next election to vote.`;
    } else {
      return `The minimum preregistration age is 16 in your state (${state}).`;
    }
  }
  if (MIN_AGE_17_STATES.includes(state)) {
    if (age >= 17) {
      return `Your state (${state}) permits preregistration beginning at age 17. Please note that you must be 18 at the time of the next election to vote.`;
    } else {
      return `The minimum preregistration age in your state (${state}) is 17.`;
    }
  }
  if (MIN_AGE_17_5_STATES.includes(state)) {
    if (age >= 17.5) {
      return `Your state (${state}) permits preregistration beginning at age 17.5. Please note that you must be 18 at the time of the next election to vote.`;
    } else {
      return `The minimum preregistration age in your state (${state}) is 17.5.`;
    }
  }
  if (state === 'AK' || state === 'TX') {
    const today = DateTime.now();
    const [_, month, day] = dob.split('-').map(Number);
    const upcomingBirthday = DateTime.fromObject({
      year: DateTime.now().year,
      month,
      day,
    });

    /* 
      Check to make sure that the user's birthday hasn't already passed. If it 
      has, increment upcomingBirthday by 1 year.
    */
    if (upcomingBirthday < today) {
      upcomingBirthday.plus({ years: 1 });
    }
    if (state === 'AK') {
      if (age > 17) {
        const difference = upcomingBirthday.diff(today, 'day').toObject().days!;
        if (difference <= 90) {
          return `Your state (${state}) permits preregistration within 90 days of your 18th birthday. Please note that you must be 18 at the time of the next election to vote.`;
        } else {
          return 'You must be within 90 days of turning 18 to preregister to vote in Alaska.';
        }
      } else {
        return 'You must be within 90 days of turning 18 to preregister to vote in Alaska.';
      }
    }
    // User is from Texas.
    else {
      if (age > 17) {
        const difference = upcomingBirthday
          .diff(today, 'months')
          .toObject().months!;
        if (difference <= 2) {
          return `Your state (${state}) permits preregistration beginning at age 17 and 10 months. Please note that you must be 18 at the time of the next election to vote.`;
        } else {
          return 'You must be 17 and 10 months of age or older to preregister to vote in Texas.';
        }
      } else {
        return 'You must be 17 and 10 months of age or older to preregister to vote in Texas.';
      }
    }
  }
  //case for all other states except ND which does not require registration
  return 'Your state does not specifically address an age for preregistration. You may register if you will be 18 by the next election. Please reach out to your state election officials for details.';
}
