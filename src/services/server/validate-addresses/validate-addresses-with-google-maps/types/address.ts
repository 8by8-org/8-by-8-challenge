import type { NullablePartial } from './nullable-partial';
import type { PostalAddress } from './postal-address';
import type { AddressComponent } from './address-component';

export type Address = NullablePartial<{
  formattedAddress: string;
  postalAddress: PostalAddress;
  addressComponents: AddressComponent[];
  missingComponentTypes: string[];
  unconfirmedComponentTypes: string[];
  unresolvedTokens: string[];
}>;
