import { VoterRegistrationPathNames } from '../constants/voter-registration-pathnames';
import type { ProgressPercent } from './progress-percent';

export function getProgressPercent(pathname: string): ProgressPercent {
  switch (pathname) {
    case VoterRegistrationPathNames.ELIGIBILITY:
      return 25;
    case VoterRegistrationPathNames.NAMES:
      return 50;
    case VoterRegistrationPathNames.ADDRESSES:
      return 75;
    default:
      return 100;
  }
}
