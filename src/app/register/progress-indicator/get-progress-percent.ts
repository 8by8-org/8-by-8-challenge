import { VoterRegistrationPathnames } from '../constants/voter-registration-pathnames';
import type { ProgressPercent } from './progress-percent';

export function getProgressPercent(pathname: string): ProgressPercent {
  switch (pathname) {
    case VoterRegistrationPathnames.ELIGIBILITY:
      return 25;
    case VoterRegistrationPathnames.NAMES:
      return 50;
    case VoterRegistrationPathnames.ADDRESSES:
      return 75;
    default:
      return 100;
  }
}
