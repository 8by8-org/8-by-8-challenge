import type { AddressErrorTypes } from './address-error-types';
import type { AddressComponents } from './address-components';
import type { AddressFormNames } from './address-form-names';

export interface UnconfirmedComponentsError {
  type: AddressErrorTypes.UnconfirmedComponents;
  form: AddressFormNames;
  unconfirmedAddressComponents: AddressComponents;
}
