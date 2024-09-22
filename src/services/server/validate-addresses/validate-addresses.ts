import type { Address } from '@/model/types/addresses/address';
import type { AddressErrors } from '@/model/types/addresses/address-errors';

export interface ValidateAddressesParams {
  homeAddress: Address;
  mailingAddress?: Address;
  previousAddress?: Address;
}

export interface ValidateAddresses {
  (params: ValidateAddressesParams): Promise<AddressErrors[]>;
}
