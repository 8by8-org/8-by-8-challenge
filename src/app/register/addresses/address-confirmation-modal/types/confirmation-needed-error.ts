import type { AddressErrorType } from './address-error-type.ts';
import type { AddressComponents } from './address-components';
import type { AddressesForm } from '../../addresses-form';

export interface ConfirmationNeededError {
  type: AddressErrorType.ConfirmationNeeded;
  affectedForm: keyof InstanceType<typeof AddressesForm>['fields'];
  enteredAddress: AddressComponents;
  recommendedAddress: AddressComponents;
}
