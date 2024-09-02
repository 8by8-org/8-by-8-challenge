import type { NullablePartial } from './nullable-partial';
import type { LatLng } from './lat-lng';
import type { PlusCode } from './plus-code';
import type { Viewport } from './viewport';

export type Geocode = NullablePartial<{
  location: LatLng;
  plusCode: PlusCode;
  bounds: Viewport;
  featureSizeMeters: number;
  placeId: string;
  placeTypes: string[];
}>;
