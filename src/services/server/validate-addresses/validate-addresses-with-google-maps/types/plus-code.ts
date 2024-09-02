import type { NullablePartial } from './nullable-partial';

export type PlusCode = NullablePartial<{
  globalCode: string;
  compoundCode: string;
}>;
