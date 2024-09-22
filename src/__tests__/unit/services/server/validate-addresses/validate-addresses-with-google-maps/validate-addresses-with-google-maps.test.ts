import { validateAddressesWithGoogleMaps } from '@/services/server/validate-addresses/validate-addresses-with-google-maps';
import { getValidGoogleMapsAddressValidationResponse } from '@/utils/test/get-valid-google-maps-address-validation-response';
import { Builder } from 'builder-pattern';
import { ServerError } from '@/errors/server-error';
import type { Address } from '@/model/types/addresses/address';
import type { ProcessableResponse } from '@/services/server/validate-addresses/validate-addresses-with-google-maps/types/processable-response';
import { AddressErrorTypes } from '@/model/types/addresses/address-error-types';

describe('validateAddressesWithGoogleMaps', () => {
  const address: Address = {
    streetLine1: '1600 Amphitheatre Pkwy',
    streetLine2: 'Suite 100',
    city: 'Mountain View',
    state: 'CA',
    zip: '94043',
  };

  it('Returns an empty array if all addresses it receives are valid.', async () => {
    const spy = jest.spyOn(globalThis, 'fetch').mockImplementation(() => {
      const response = Builder<Response>()
        .ok(true)
        .json(() => {
          return Promise.resolve(
            getValidGoogleMapsAddressValidationResponse(address),
          );
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

    spy.mockRestore();
  });

  it(`throws a ServerError if any of the responses received from the Google Maps 
  API are not ok.`, () => {
    const spy = jest
      .spyOn(globalThis, 'fetch')
      .mockImplementationOnce(() => {
        const response = Builder<Response>()
          .ok(true)
          .json(() => {
            return Promise.resolve(
              getValidGoogleMapsAddressValidationResponse(address),
            );
          })
          .build();

        return Promise.resolve(response);
      })
      .mockImplementationOnce(() => {
        const response = Builder<Response>().ok(false).build();

        return Promise.resolve(response);
      })
      .mockImplementationOnce(() => {
        const response = Builder<Response>()
          .ok(true)
          .json(() => {
            return Promise.resolve(
              getValidGoogleMapsAddressValidationResponse(address),
            );
          })
          .build();

        return Promise.resolve(response);
      });

    expect(
      validateAddressesWithGoogleMaps({
        homeAddress: address,
        mailingAddress: address,
        previousAddress: address,
      }),
    ).rejects.toBeInstanceOf(ServerError);

    spy.mockRestore();
  });

  it(`throws a ServerError if the response received from the Google Maps API
  cannot be processed.`, () => {
    const spy = jest.spyOn(globalThis, 'fetch').mockImplementationOnce(() => {
      const response = Builder<Response>()
        .ok(true)
        .json(() => {
          return Promise.resolve({});
        })
        .build();

      return Promise.resolve(response);
    });

    expect(
      validateAddressesWithGoogleMaps({
        homeAddress: address,
      }),
    ).rejects.toBeInstanceOf(ServerError);

    spy.mockRestore();
  });

  it(`returns an array containing an UnconfirmedComponentsError if the address
  has components that could not be confirmed.`, async () => {
    const hasUnconfirmedComponents =
      getValidGoogleMapsAddressValidationResponse(address);
    hasUnconfirmedComponents.result.verdict.hasUnconfirmedComponents = true;
    const streetLine2 =
      hasUnconfirmedComponents.result.address.addressComponents.find(
        component => component.componentType === 'subpremise',
      )!;
    streetLine2.confirmationLevel = 'UNCONFIRMED_BUT_PLAUSIBLE';

    const spy = jest.spyOn(globalThis, 'fetch').mockImplementationOnce(() => {
      const response = Builder<Response>()
        .ok(true)
        .json(() => {
          return Promise.resolve(hasUnconfirmedComponents);
        })
        .build();

      return Promise.resolve(response);
    });

    const errors = await validateAddressesWithGoogleMaps({
      homeAddress: address,
    });

    expect(
      errors.some(
        error => error.type === AddressErrorTypes.UnconfirmedComponents,
      ),
    ).toBe(true);

    spy.mockRestore();
  });

  it(`returns an array containing a ReviewRecommendedAddressError if the
  address did not contain unconfirmed components but a more accurate address
  was found.`, async () => {
    const addressWithMisspelling = {
      streetLine1: '1600 Amphitheatre Pkwy',
      city: 'Montan View',
      state: 'CA',
      zip: '94043',
    };

    const responseBody = getValidGoogleMapsAddressValidationResponse(
      addressWithMisspelling,
    );
    responseBody.result.address.postalAddress.locality = 'Mountain View';

    const spy = jest.spyOn(globalThis, 'fetch').mockImplementationOnce(() => {
      const response = Builder<Response>()
        .ok(true)
        .json(() => {
          return Promise.resolve(responseBody);
        })
        .build();

      return Promise.resolve(response);
    });

    const errors = await validateAddressesWithGoogleMaps({
      homeAddress: address,
    });

    expect(
      errors.some(
        error => error.type === AddressErrorTypes.ReviewRecommendedAddress,
      ),
    ).toBe(true);

    spy.mockRestore();
  });

  it(`returns an array containing a MissingSubpremiseError if a missing
  subpremise was detected.`, async () => {
    const responseBody = getValidGoogleMapsAddressValidationResponse(address);
    responseBody.result.address.missingComponentTypes = ['subpremise'];

    const spy = jest.spyOn(globalThis, 'fetch').mockImplementationOnce(() => {
      const response = Builder<Response>()
        .ok(true)
        .json(() => {
          return Promise.resolve(responseBody);
        })
        .build();

      return Promise.resolve(response);
    });

    const errors = await validateAddressesWithGoogleMaps({
      homeAddress: address,
    });

    expect(
      errors.some(error => error.type === AddressErrorTypes.MissingSubpremise),
    ).toBe(true);

    spy.mockRestore();
  });

  it(`returns an array containing multiple error types when multiple problems
  are detected.`, async () => {
    const hasUnconfirmedComponents =
      getValidGoogleMapsAddressValidationResponse(address);
    hasUnconfirmedComponents.result.verdict.hasUnconfirmedComponents = true;

    const hasMissingUnit = getValidGoogleMapsAddressValidationResponse(address);
    hasMissingUnit.result.address.missingComponentTypes = ['subpremise'];

    const hasMisspellingAndMissingUnit =
      getValidGoogleMapsAddressValidationResponse(address);
    hasMisspellingAndMissingUnit.result.address.postalAddress.addressLines[0] =
      '1600 Amphitheater Pkwy';
    hasMisspellingAndMissingUnit.result.address.missingComponentTypes = [
      'subpremise',
    ];

    const spy = jest
      .spyOn(globalThis, 'fetch')
      .mockImplementationOnce(() => {
        const response = Builder<Response>()
          .ok(true)
          .json(() => {
            return Promise.resolve(hasUnconfirmedComponents);
          })
          .build();

        return Promise.resolve(response);
      })
      .mockImplementationOnce(() => {
        const response = Builder<Response>()
          .ok(true)
          .json(() => {
            return Promise.resolve(hasMissingUnit);
          })
          .build();

        return Promise.resolve(response);
      })
      .mockImplementationOnce(() => {
        const response = Builder<Response>()
          .ok(true)
          .json(() => {
            return Promise.resolve(hasMisspellingAndMissingUnit);
          })
          .build();

        return Promise.resolve(response);
      });

    const errors = await validateAddressesWithGoogleMaps({
      homeAddress: address,
      mailingAddress: address,
      previousAddress: address,
    });

    const errorTypes = errors.map(error => error.type);
    expect(errorTypes).toStrictEqual([
      AddressErrorTypes.UnconfirmedComponents,
      AddressErrorTypes.MissingSubpremise,
      AddressErrorTypes.ReviewRecommendedAddress,
      AddressErrorTypes.MissingSubpremise,
    ]);

    spy.mockRestore();
  });

  /*
    The following tests can be uncommented to test against the actual 
    Google Maps API. Be sure to include a valid Google Maps API key in your 
    .env file. Examples are drawn from 
    https://developers.google.com/maps/documentation/address-validation/demo
  */
  /*
  it('returns an empty array when all addresses are valid.', async () => {
    const validAddress = {
      streetLine1: '1600 Amphitheatre Pkwy',
      city: 'Mountain View',
      state: 'CA',
      zip: '94043',
    };

    const errors = await validateAddressesWithGoogleMaps({
      homeAddress: validAddress,
    });

    expect(errors).toStrictEqual([]);
  });

  it(`returns an array containing an UnconfirmedComponentsError when there are 
  unconfirmed components.`, async () => {
    const hasUnconfirmedComponents = {
      streetLine1: '2930 Pearl St',
      streetLine2: 'Suite 100',
      city: 'Boulder',
      state: 'CO',
      zip: '80301',
    };

    const errors = await validateAddressesWithGoogleMaps({
      homeAddress: hasUnconfirmedComponents,
    });

    expect(errors).toStrictEqual([
      {
        type: AddressErrorTypes.UnconfirmedComponents,
        form: 'homeAddress',
        unconfirmedAddressComponents: {
          city: {
            hasIssue: false,
            value: 'Boulder',
          },
          state: {
            hasIssue: false,
            value: 'CO',
          },
          streetLine1: {
            hasIssue: false,
            value: '2930 Pearl St',
          },
          streetLine2: {
            hasIssue: true,
            value: 'Suite 100',
          },
          zip: {
            hasIssue: false,
            value: '80301',
          },
        },
      },
    ]);
  });

  it(`returns an array containing ReviewRecommended if an address contains 
  elements that can be corrected.`, async () => {
    const hasMisspelledElement = {
      streetLine1: '1600 Amphitheatre Pkwy',
      city: 'Montan View',
      state: 'CA',
      zip: '94043',
    };

    const errors = await validateAddressesWithGoogleMaps({
      homeAddress: hasMisspelledElement,
    });

    expect(errors).toStrictEqual([
      {
        type: AddressErrorTypes.ReviewRecommendedAddress,
        form: 'homeAddress',
        enteredAddress: {
          streetLine1: {
            value: '1600 Amphitheatre Pkwy',
            hasIssue: false,
          },
          city: {
            value: 'Montan View',
            hasIssue: true,
          },
          state: {
            value: 'CA',
            hasIssue: false,
          },
          zip: {
            value: '94043',
            hasIssue: false,
          },
        },
        recommendedAddress: {
          streetLine1: {
            value: '1600 Amphitheatre Pkwy',
            hasIssue: false,
          },
          city: {
            value: 'Mountain View',
            hasIssue: true,
          },
          state: {
            value: 'CA',
            hasIssue: false,
          },
          zip: {
            value: '94043',
            hasIssue: false,
          },
        },
      },
    ]);
  });

  it('returns an array containing a MissingSubpremiseError if a subpremise is missing.', async () => {
    const hasMissingSubpremise = {
      streetLine1: '500 W 2nd St',
      city: 'Austin',
      state: 'TX',
      zip: '78701',
    };

    const errors = await validateAddressesWithGoogleMaps({
      homeAddress: hasMissingSubpremise,
    });

    expect(errors).toStrictEqual([
      {
        type: AddressErrorTypes.MissingSubpremise,
        form: 'homeAddress',
      },
    ]);
  });
  */
});
