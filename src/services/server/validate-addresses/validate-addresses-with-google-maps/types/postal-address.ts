import type { NullablePartial } from './nullable-partial';

export type PostalAddress = NullablePartial<{
  revision: number;
  regionCode: string;
  languageCode: string;
  postalCode: string;
  sortingCode: string;
  administrativeArea: string;
  locality: string;
  sublocality: string;
  addressLines: string[];
  recipients: string[];
  organization: string;
}>;
