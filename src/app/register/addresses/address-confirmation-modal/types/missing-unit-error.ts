import type { AddressErrorType } from './address-error-type.ts';
import type { Address } from './address';
import type { AddressesForm } from '../../addresses-form';

export interface MissingUnitError {
  type: AddressErrorType.MissingUnit;
  affectedForm: keyof InstanceType<typeof AddressesForm>['fields'];
  enteredAddress: Address;
}
