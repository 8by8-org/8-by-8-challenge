import type { Address } from '@/model/types/addresses/address';
import type { ProcessableResponse } from '../types/processable-response';

export function shouldCreateReviewRecommendedAddressError(
  address: Address,
  response: ProcessableResponse,
): boolean {
  return (
    address.streetLine1 !==
      response.result.address.postalAddress.addressLines[0] ||
    (address.streetLine2 ?? '') !==
      (response.result.address.postalAddress.addressLines[1] ?? '') ||
    address.city !== response.result.address.postalAddress.locality ||
    address.state !==
      response.result.address.postalAddress.administrativeArea ||
    address.zip !== response.result.address.postalAddress.postalCode.slice(0, 5)
  );
}
