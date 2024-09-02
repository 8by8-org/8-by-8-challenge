import type { Address } from '@/model/types/addresses/address';

export function shouldCreateReviewRecommendedAddressError(
  address: Address,
  result: any,
): boolean {
  return (
    address.streetLine1 !== result.address.postalAddress.addressLines[0] ||
    address.streetLine2 !== result.address.postalAddress.addressLines[1] ||
    address.city !== result.address.postalAddress.locality ||
    address.state !== result.address.postalAddress.administrativeArea ||
    address.zip !== result.address.postalAddress.postalCode.slice(0, 5)
  );
}
