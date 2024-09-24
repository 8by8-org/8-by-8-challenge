import { PREREGISTRATION_INFO_BY_STATE } from './preregistration-information-by-state';

/**
 * Determines what (if any) preregistration message to show the user based on
 * the state detected from their zip code.
 *
 * @param zipCode - The user's 5-digit ZIP code.
 * @returns The preregistration message for the user's state or an empty string
 * if none exists.
 */
export function getPreregistrationInfo(state: string | null) {
  if (!state || !(state in PREREGISTRATION_INFO_BY_STATE)) {
    return '';
  }

  return PREREGISTRATION_INFO_BY_STATE[state];
}
