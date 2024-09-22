import type { NullablePartial } from './nullable-partial';

export type ComponentName = NullablePartial<{
  text: string;
  languageCode: string;
}>;
