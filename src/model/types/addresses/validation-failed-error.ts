import type { AddressErrorTypes } from './address-error-types';

export interface ValidationFailedError {
  type: AddressErrorTypes.ValidationFailed;
}
