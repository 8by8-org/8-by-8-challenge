import { NullablePartial } from './nullable-partial';

export type USPSAddress = NullablePartial<{
  firstAddressLine: string;
  firm: string;
  secondAddressLine: string;
  urbanization: string;
  cityStateZipAddressLine: string;
  city: string;
  state: string;
  zipCode: string;
  zipCodeExtension: string;
}>;
