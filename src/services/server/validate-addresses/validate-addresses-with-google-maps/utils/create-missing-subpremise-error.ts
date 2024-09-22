import { AddressErrorTypes } from '@/model/types/addresses/address-error-types';
import type { MissingSubpremiseError } from '@/model/types/addresses/missing-subpremise-error';
import type { AddressFormNames } from '@/model/types/addresses/address-form-names';

export function createMissingSubpremiseError(
  form: AddressFormNames,
): MissingSubpremiseError {
  return {
    type: AddressErrorTypes.MissingSubpremise,
    form,
  };
}
