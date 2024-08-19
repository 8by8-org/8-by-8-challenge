import { VOTER_REGISTRATION_PATHNAMES } from '../constants/voter-registration-pathnames';
import type { ProgressPercent } from './progress-percent';

export function getProgressPercent(pathname: string): ProgressPercent {
  switch (pathname) {
    case VOTER_REGISTRATION_PATHNAMES[0]:
      return 25;
    case VOTER_REGISTRATION_PATHNAMES[1]:
      return 50;
    case VOTER_REGISTRATION_PATHNAMES[2]:
      return 75;
    case VOTER_REGISTRATION_PATHNAMES[3]:
      return 100;
    default:
      return 25;
  }
}
