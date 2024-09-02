import type { AddressErrorTypes } from './address-error-types';
import type { AddressComponents } from './address-components';

export interface UnconfirmedComponentsError {
  type: AddressErrorTypes.UnconfirmedComponents;
  unconfirmedAddressComponents: AddressComponents;
}
