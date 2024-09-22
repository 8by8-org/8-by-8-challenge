import type { AddressErrorTypes } from './address-error-types';
import type { AddressFormNames } from './address-form-names';

export interface MissingSubpremiseError {
  type: AddressErrorTypes.MissingSubpremise;
  form: AddressFormNames;
}
