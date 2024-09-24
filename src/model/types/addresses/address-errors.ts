import type { UnconfirmedComponentsError } from './unconfirmed-components-error';
import type { ReviewRecommendedAddressError } from './review-recommended-address-error';
import type { MissingSubpremiseError } from './missing-subpremise-error';
import type { ValidationFailedError } from './validation-failed-error';

export type AddressErrors =
  | UnconfirmedComponentsError
  | ReviewRecommendedAddressError
  | MissingSubpremiseError
  | ValidationFailedError;
