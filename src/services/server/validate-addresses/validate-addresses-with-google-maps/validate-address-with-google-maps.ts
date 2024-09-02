import 'server-only';
import { AddressValidationClient } from "@googlemaps/addressvalidation/build/src/v1";
import { PRIVATE_ENVIRONMENT_VARIABLES } from '@/constants/private-environment-variables';
import { getAddressLines } from './get-address-lines';
import { canProcessResponse } from './can-process-response';
import { ServerError } from '@/errors/server-error';
import { shouldCreateUnconfirmedComponentsError } from './should-create-unconfirmed-components-error';
import { createUnconfirmedComponentsError } from './create-unconfirmed-components-error';
import { shouldCreateReviewRecommendedAddressError } from './should-create-review-recommended-address-error';
import { createReviewRecommendedAddressError } from './create-review-recommended-address-error';
import { shouldCreateMissingSubpremiseError } from './should-create-missing-subpremise-error';
import { createMissingSubpremiseError } from './create-missing-subpremise-error';
import type { Address } from "@/model/types/addresses/address";
import type { AddressFormNames } from "@/model/types/addresses/address-form-names";

export async function validateAddressWithGoogleMaps(address: Address, form: AddressFormNames) {
  const client = new AddressValidationClient({
    apiKey: PRIVATE_ENVIRONMENT_VARIABLES.GOOGLE_MAPS_API_KEY,
  });

  const addressLines = getAddressLines(address);

  const request = {
    address: {
      regionCode: "US",
      addressLines,
    },
  };

  const [response] = await client.validateAddress(request);

  if (!canProcessResponse(response)) {
    throw new ServerError("Unprocessable response.", 400);
  }

  const { result } = response;

  if (shouldCreateUnconfirmedComponentsError(result)) {
    return [createUnconfirmedComponentsError(address, result)];
  }

  const errors = [];

  if (shouldCreateReviewRecommendedAddressError(address, result)) {
    errors.push(createReviewRecommendedAddressError(address, result, form));
  }

  if (shouldCreateMissingSubpremiseError(result)) {
    errors.push(createMissingSubpremiseError(form));
  }

  return errors;
};
