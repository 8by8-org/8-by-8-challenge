import type { ConfirmationNeededError } from './confirmation-needed-error';
import type { FailedToConfirmError } from './failed-to-confirm-error';
import type { FailedToValidateError } from './failed-to-validate-error';
import type { MissingUnitError } from './missing-unit-error';

export type AddressError =
  | ConfirmationNeededError
  | MissingUnitError
  | FailedToConfirmError
  | FailedToValidateError;
