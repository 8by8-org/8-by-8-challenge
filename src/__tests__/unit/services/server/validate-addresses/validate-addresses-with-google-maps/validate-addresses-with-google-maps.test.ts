import { validateAddressesWithGoogleMaps } from '@/services/server/validate-addresses/validate-addresses-with-google-maps';
import { Builder } from 'builder-pattern';
import type { ProcessableResponse } from '@/services/server/validate-addresses/validate-addresses-with-google-maps/types/processable-response';
import type { Address } from '@/model/types/addresses/address';

describe('validateAddressesWithGoogleMaps', () => {
  it('Returns an empty array if all addresses it receives are valid.', async () => {
    const address: Address = {
      streetLine1: '1600 Amphitheatre Pkwy',
      city: 'Mountain View',
      state: 'CA',
      zip: '94043',
    };

    jest.spyOn(globalThis, 'fetch').mockImplementation(() => {
      console.log('spy called');

      const response = Builder<Response>()
        .ok(true)
        .json(() => {
          const processableResponseBody: ProcessableResponse = {
            result: {
              verdict: {
                hasUnconfirmedComponents: false,
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
                      text: address.streetLine1.slice(0, 4),
                    },
                    componentType: 'street_number',
                    confirmationLevel: 'CONFIRMED',
                  },
                  {
                    componentName: {
                      text: address.streetLine1.slice(5),
                    },
                    componentType: 'route',
                    confirmationLevel: 'CONFIRMED',
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

          return Promise.resolve(processableResponseBody);
        })
        .build();

      return Promise.resolve(response);
    });

    const result = await validateAddressesWithGoogleMaps({
      homeAddress: address,
      mailingAddress: address,
      previousAddress: address,
    });

    expect(result).toStrictEqual([]);
  });

  // it(`throws a ServerError if the response received from the Google maps API is
  // not ok.`, () => {});

  // it(`throws a ServerError if the response received from the Google maps API
  // cannot be processed due to missing or invalid properties.`, () => {});

  // it(`returns an array containing an UnconfirmedComponentsError if the address
  // has components that could not be confirmed.`, () => {});

  // it(`returns an array containing a ReviewRecommendedAddressError if the
  // address did not contain unconfirmed components but a more accurate address
  // was found.`, () => {});

  // it(`returns an array containing a MissingSubpremiseError if a missing
  // subpremise was detected.`, () => {});

  // it(`returns an array containing multiple error types when multiple problems
  // are detected.`, () => {});

  /*
    The following tests can be uncommented to test against the actual 
    Google Maps API.
  */
});
