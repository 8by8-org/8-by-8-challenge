import type { AddressErrorType } from './address-error-type.ts';
import type { AddressComponents } from './address-components';

export interface FailedToConfirmError {
  type: AddressErrorType.FailedToConfirm;
  enteredAddress: AddressComponents;
}
