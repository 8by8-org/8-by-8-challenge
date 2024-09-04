import { createUnconfirmedComponentsError } from '@/services/server/validate-addresses/validate-addresses-with-google-maps/utils/create-unconfirmed-components-error';
import { getValidGoogleMapsAddressValidationResponse } from '@/utils/test/get-valid-google-maps-address-validation-response';

describe('createUnconfirmedComponentsError', () => {
  it('flags all unconfirmed components.', () => {
    const address = {
      streetLine1: '123 Fake St',
      streetLine2: 'Apartment 10000',
      city: 'Nowhereville',
      state: 'AL',
      zip: '12345',
    };

    const responseBody = getValidGoogleMapsAddressValidationResponse(address);
    responseBody.result.verdict.hasUnconfirmedComponents = true;

    responseBody.result.address.addressComponents.forEach(component => {
      component.confirmationLevel = 'UNCONFIRMED_BUT_PLAUSIBLE';
    });

    const error = createUnconfirmedComponentsError(
      address,
      responseBody,
      'homeAddress',
    );

    for (const addressComponent of Object.values(
      error.unconfirmedAddressComponents,
    )) {
      expect(addressComponent.hasIssue).toBe(true);
    }
  });

  it('flags an unconfirmed street number when it is present without a route.', () => {
    const address = {
      streetLine1: '1600',
      city: 'Mountain View',
      state: 'CA',
      zip: '94043',
    };

    const responseBody = {
      result: {
        verdict: {
          hasUnconfirmedComponents: true,
        },
        address: {
          postalAddress: {
            postalCode: address.zip,
            administrativeArea: address.state,
            locality: address.city,
            addressLines: [address.streetLine1],
          },
          addressComponents: [
            {
              componentName: {
                text: address.streetLine1,
              },
              componentType: 'street_number',
              confirmationLevel: 'UNCONFIRMED_BUT_PLAUSIBLE',
            },
            {
              componentName: {
                text: address.city,
              },
              componentType: 'locality',
              confirmationLevel: 'CONFIRMED',
            },
            {
              componentName: {
                text: address.state,
              },
              componentType: 'administrative_area_level_1',
              confirmationLevel: 'CONFIRMED',
            },
            {
              componentName: {
                text: address.zip,
              },
              componentType: 'postal_code',
              confirmationLevel: 'CONFIRMED',
            },
          ],
        },
      },
    };

    expect(
      createUnconfirmedComponentsError(address, responseBody, 'homeAddress')
        .unconfirmedAddressComponents.streetLine1.hasIssue,
    ).toBe(true);
  });

  it('flags an unconfirmed route when it is present without a street.', () => {
    const address = {
      streetLine1: 'Amphitheatre Pkwy',
      city: 'Mountain View',
      state: 'CA',
      zip: '94043',
    };

    const responseBody = {
      result: {
        verdict: {
          hasUnconfirmedComponents: true,
        },
        address: {
          postalAddress: {
            postalCode: address.zip,
            administrativeArea: address.state,
            locality: address.city,
            addressLines: [address.streetLine1],
          },
          addressComponents: [
            {
              componentName: {
                text: address.streetLine1,
              },
              componentType: 'route',
              confirmationLevel: 'UNCONFIRMED_BUT_PLAUSIBLE',
            },
            {
              componentName: {
                text: address.city,
              },
              componentType: 'locality',
              confirmationLevel: 'CONFIRMED',
            },
            {
              componentName: {
                text: address.state,
              },
              componentType: 'administrative_area_level_1',
              confirmationLevel: 'CONFIRMED',
            },
            {
              componentName: {
                text: address.zip,
              },
              componentType: 'postal_code',
              confirmationLevel: 'CONFIRMED',
            },
          ],
        },
      },
    };

    expect(
      createUnconfirmedComponentsError(address, responseBody, 'homeAddress')
        .unconfirmedAddressComponents.streetLine1.hasIssue,
    ).toBe(true);
  });

  it('flags an unconfirmed PO box.', () => {
    const address = {
      streetLine1: 'PO Box 9999',
      city: 'Mountain View',
      state: 'CA',
      zip: '94043',
    };

    const responseBody = {
      result: {
        verdict: {
          hasUnconfirmedComponents: true,
        },
        address: {
          postalAddress: {
            postalCode: address.zip,
            administrativeArea: address.state,
            locality: address.city,
            addressLines: [address.streetLine1],
          },
          addressComponents: [
            {
              componentName: {
                text: address.streetLine1,
              },
              componentType: 'post_box',
              confirmationLevel: 'UNCONFIRMED_BUT_PLAUSIBLE',
            },
            {
              componentName: {
                text: address.city,
              },
              componentType: 'locality',
              confirmationLevel: 'CONFIRMED',
            },
            {
              componentName: {
                text: address.state,
              },
              componentType: 'administrative_area_level_1',
              confirmationLevel: 'CONFIRMED',
            },
            {
              componentName: {
                text: address.zip,
              },
              componentType: 'postal_code',
              confirmationLevel: 'CONFIRMED',
            },
          ],
        },
      },
    };

    expect(
      createUnconfirmedComponentsError(address, responseBody, 'homeAddress')
        .unconfirmedAddressComponents.streetLine1.hasIssue,
    ).toBe(true);
  });
});
