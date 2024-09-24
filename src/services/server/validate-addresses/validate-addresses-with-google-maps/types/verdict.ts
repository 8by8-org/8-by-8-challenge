import type { NullablePartial } from './nullable-partial';

export type Verdict = NullablePartial<{
  inputGranularity: any;
  validationGranularity: any;
  geocodeGranularity: any;
  addressComplete: boolean;
  hasUnconfirmedComponents: boolean;
  hasInferredComponents: boolean;
  hasReplacedComponents: boolean;
}>;
