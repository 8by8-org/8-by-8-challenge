import type { NullablePartial } from './nullable-partial';

export type Metadata = NullablePartial<{
  business: boolean;
  poBox: boolean;
  residential: boolean;
}>;
