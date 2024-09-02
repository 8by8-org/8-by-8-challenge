import type { NullablePartial } from './nullable-partial';

export type LatLng = NullablePartial<{
  latitude: number;
  longitude: number;
}>;
