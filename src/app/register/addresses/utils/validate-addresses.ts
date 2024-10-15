import { AddressErrorTypes } from '@/model/types/addresses/address-error-types';
import { createCSRFHeader } from '@/utils/csrf/create-csrf-header';
import type { ValidateAddressesParams } from '@/services/server/validate-addresses/validate-addresses';
import type { AddressErrors } from '@/model/types/addresses/address-errors';

interface ValidationResponse {
  result: {
    errors: AddressErrors[];
  };
}

export async function validateAddresses(
  params: ValidateAddressesParams,
): Promise<AddressErrors[]> {
  try {
    const response = await fetch('/api/validate-addresses', {
      method: 'POST',
      body: JSON.stringify(params),
      headers: createCSRFHeader(),
    });

    if (!response.ok) {
      return [
        {
          type: AddressErrorTypes.ValidationFailed,
        },
      ];
    }

    const body = (await response.json()) as ValidationResponse;
    return body.result.errors;
  } catch (e) {
    return [
      {
        type: AddressErrorTypes.ValidationFailed,
      },
    ];
  }
}
