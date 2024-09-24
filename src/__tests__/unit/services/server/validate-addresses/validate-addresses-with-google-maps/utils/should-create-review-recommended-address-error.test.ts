import { shouldCreateReviewRecommendedAddressError } from '@/services/server/validate-addresses/validate-addresses-with-google-maps/utils/should-create-review-recommended-address-error';
import { getValidGoogleMapsAddressValidationResponse } from '@/utils/test/get-valid-google-maps-address-validation-response';

it(`returns false when either address.streetLine1 and 
response.result.address.postalAddress.addressLines[1] are both undefined.`, () => {
  const address = {
    streetLine1: '123 Fake St.',
    city: 'Somewhereville',
    state: 'AL',
    zip: '12345',
  };

  const response = getValidGoogleMapsAddressValidationResponse(address);

  expect(shouldCreateReviewRecommendedAddressError(address, response)).toBe(
    false,
  );
});
