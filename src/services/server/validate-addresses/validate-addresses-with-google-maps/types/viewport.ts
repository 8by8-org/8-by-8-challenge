import type { NullablePartial } from './nullable-partial';
import type { LatLng } from './lat-lng';

export type Viewport = NullablePartial<{
  low: LatLng;
  high: LatLng;
}>;
