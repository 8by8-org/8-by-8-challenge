import type { AddressErrorType } from './address-error-type.ts';

export interface FailedToValidateError {
  type: AddressErrorType.FailedToValidate;
}
