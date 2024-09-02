import type { NullablePartial } from './nullable-partial';
import type { Address } from './address';
import type { Geocode } from './geocode';
import type { Metadata } from './metadata';
import type { USPSData } from './usps-data';
import type { Verdict } from './verdict';

export type ValidationResult = NullablePartial<{
  verdict: Verdict;
  address: Address;
  geocode: Geocode;
  metadata: Metadata;
  uspsData: USPSData;
  englishLatinAddress: Address;
}>;
