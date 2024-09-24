import 'server-only';
import { PRIVATE_ENVIRONMENT_VARIABLES } from '@/constants/private-environment-variables';
import { getAddressLines } from './get-address-lines';
import { isProcessableResponse } from './is-processable-response';
import { ServerError } from '@/errors/server-error';
import { shouldCreateUnconfirmedComponentsError } from './should-create-unconfirmed-components-error';
import { createUnconfirmedComponentsError } from './create-unconfirmed-components-error';
import { shouldCreateReviewRecommendedAddressError } from './should-create-review-recommended-address-error';
import { createReviewRecommendedAddressError } from './create-review-recommended-address-error';
import { shouldCreateMissingSubpremiseError } from './should-create-missing-subpremise-error';
import { createMissingSubpremiseError } from './create-missing-subpremise-error';
import type { Address } from '@/model/types/addresses/address';
import type { AddressFormNames } from '@/model/types/addresses/address-form-names';

export async function validateAddressWithGoogleMaps(
  address: Address,
  form: AddressFormNames,
) {
  const endpoint = `https://addressvalidation.googleapis.com/v1:validateAddress?key=${PRIVATE_ENVIRONMENT_VARIABLES.GOOGLE_MAPS_API_KEY}`;
  const addressLines = getAddressLines(address);
  const request = {
    address: {
      regionCode: 'US',
      addressLines,
    },
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new ServerError(`Failed to validate address.`, response.status);
  }

  const responseBody = await response.json();

  if (!isProcessableResponse(responseBody)) {
    throw new ServerError('Unprocessable response.', 400);
  }

  if (shouldCreateUnconfirmedComponentsError(responseBody)) {
    return [createUnconfirmedComponentsError(address, responseBody, form)];
  }

  const errors = [];

  if (shouldCreateReviewRecommendedAddressError(address, responseBody)) {
    errors.push(
      createReviewRecommendedAddressError(address, responseBody, form),
    );
  }

  if (shouldCreateMissingSubpremiseError(responseBody)) {
    errors.push(createMissingSubpremiseError(form));
  }

  return errors;
}
