import type { NullablePartial } from './nullable-partial';
import type { ValidationResult } from './validation-result';

export type IValidateAddressResponse = NullablePartial<{
  result: ValidationResult | null;
  responseId: string;
}>;

type x = IValidateAddressResponse['result'];
