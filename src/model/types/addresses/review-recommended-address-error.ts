import type { AddressErrorTypes } from './address-error-types';
import type { AddressFormNames } from './address-form-names';
import type { AddressComponents } from './address-components';

export interface ReviewRecommendedAddressError {
  type: AddressErrorTypes.ReviewRecommendedAddress;
  form: AddressFormNames;
  enteredAddress: AddressComponents;
  recommendedAddress: AddressComponents;
}
