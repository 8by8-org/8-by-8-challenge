import { POST } from '@/app/api/validate-addresses/route';
import { serverContainer } from '@/services/server/container';
import { SERVER_SERVICE_KEYS } from '@/services/server/keys';
import { saveActualImplementation } from '@/utils/test/save-actual-implementation';
import { NextRequest } from 'next/server';
import { AddressErrorTypes } from '@/model/types/addresses/address-error-types';
import { ServerError } from '@/errors/server-error';
import type { ValidateAddresses } from '@/services/server/validate-addresses/validate-addresses';
import type { AddressErrors } from '@/model/types/addresses/address-errors';

describe('POST', () => {
  const getActualService = saveActualImplementation(serverContainer, 'get');

  it(`returns a response with a result.errors property containing an empty array
  if all addresses were valid.`, async () => {
    const containerSpy = jest
      .spyOn(serverContainer, 'get')
      .mockImplementation(key => {
        if (key.name === SERVER_SERVICE_KEYS.validateAddresses.name) {
          const validateAddresses: ValidateAddresses = () => {
            return Promise.resolve([] as AddressErrors[]);
          };

          return validateAddresses;
        }

        return getActualService(key);
      });

    const request = new NextRequest(
      'https://challenge.8by8.us/api/validate-addresses',
      {
        method: 'POST',
        body: JSON.stringify({
          homeAddress: {
            streetLine1: '1600 Amphitheatre Pkwy',
            city: 'Mountain View',
            state: 'CA',
            zip: '94043',
          },
        }),
      },
    );

    const response = await POST(request);
    const body = await response.json();
    expect(body).toEqual({
      result: {
        errors: [],
      },
    });

    containerSpy.mockRestore();
  });

  it(`returns a response with a result.errors property containing errors if any
  were detected.`, async () => {
    const addresses = {
      homeAddress: {
        streetLine1: '2930 Pearl Street',
        streetLine2: 'Suite 100',
        city: 'Boulder',
        state: 'CO',
        zip: '80301',
      },
      mailingAddress: {
        streetLine1: '1600 Amphitheatre Pkwy',
        city: 'Montan View',
        state: 'CA',
        zip: '94043',
      },
      previousAddress: {
        streetLine1: '500 W 2nd St',
        city: 'Austin',
        state: 'TX',
        zip: '78701',
      },
    };

    const errors: AddressErrors[] = [
      {
        type: AddressErrorTypes.UnconfirmedComponents,
        form: 'homeAddress',
        unconfirmedAddressComponents: {
          streetLine1: {
            value: addresses.homeAddress.streetLine1,
            hasIssue: false,
          },
          streetLine2: {
            value: addresses.homeAddress.streetLine2,
            hasIssue: true,
          },
          city: {
            value: addresses.homeAddress.city,
            hasIssue: false,
          },
          state: {
            value: addresses.homeAddress.state,
            hasIssue: false,
          },
          zip: {
            value: addresses.homeAddress.zip,
            hasIssue: false,
          },
        },
      },
      {
        type: AddressErrorTypes.ReviewRecommendedAddress,
        form: 'mailingAddress',
        enteredAddress: {
          streetLine1: {
            value: addresses.mailingAddress.streetLine1,
            hasIssue: false,
          },
          city: {
            value: addresses.mailingAddress.city,
            hasIssue: true,
          },
          state: {
            value: addresses.mailingAddress.state,
            hasIssue: false,
          },
          zip: {
            value: addresses.mailingAddress.zip,
            hasIssue: false,
          },
        },
        recommendedAddress: {
          streetLine1: {
            value: addresses.mailingAddress.streetLine1,
            hasIssue: false,
          },
          city: {
            value: addresses.mailingAddress.city,
            hasIssue: true,
          },
          state: {
            value: addresses.mailingAddress.state,
            hasIssue: false,
          },
          zip: {
            value: addresses.mailingAddress.zip,
            hasIssue: false,
          },
        },
      },
      {
        type: AddressErrorTypes.MissingSubpremise,
        form: 'previousAddress',
      },
    ];

    const containerSpy = jest
      .spyOn(serverContainer, 'get')
      .mockImplementation(key => {
        if (key.name === SERVER_SERVICE_KEYS.validateAddresses.name) {
          const validateAddresses: ValidateAddresses = () => {
            return Promise.resolve(errors);
          };

          return validateAddresses;
        }

        return getActualService(key);
      });

    const request = new NextRequest(
      'https://challenge.8by8.us/api/validate-addresses',
      {
        method: 'POST',
        body: JSON.stringify(addresses),
      },
    );

    const response = await POST(request);
    const body = await response.json();
    expect(body).toEqual({
      result: {
        errors,
      },
    });

    containerSpy.mockRestore();
  });

  it(`returns a response with a status of 400 if the data sent in the body
  could not be parsed.`, async () => {
    const request = new NextRequest(
      'https://challenge.8by8.us/api/validate-addresses',
      {
        method: 'POST',
        body: JSON.stringify({}),
      },
    );

    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it('returns a response with a status matching that of a caught ServerError.', async () => {
    const containerSpy = jest
      .spyOn(serverContainer, 'get')
      .mockImplementation(key => {
        if (key.name === SERVER_SERVICE_KEYS.validateAddresses.name) {
          const validateAddresses: ValidateAddresses = () => {
            throw new ServerError('Too many requests.', 429);
          };

          return validateAddresses;
        }

        return getActualService(key);
      });

    const request = new NextRequest(
      'https://challenge.8by8.us/api/validate-addresses',
      {
        method: 'POST',
        body: JSON.stringify({
          homeAddress: {
            streetLine1: '1600 Amphitheatre Pkwy',
            city: 'Mountain View',
            state: 'CA',
            zip: '94043',
          },
        }),
      },
    );

    const response = await POST(request);
    expect(response.status).toBe(429);

    containerSpy.mockRestore();
  });

  it(`returns a response with a status of 500 when an unknown error is encountered.`, async () => {
    const containerSpy = jest
      .spyOn(serverContainer, 'get')
      .mockImplementation(key => {
        if (key.name === SERVER_SERVICE_KEYS.validateAddresses.name) {
          const validateAddresses: ValidateAddresses = () => {
            throw new Error();
          };

          return validateAddresses;
        }

        return getActualService(key);
      });

    const request = new NextRequest(
      'https://challenge.8by8.us/api/validate-addresses',
      {
        method: 'POST',
        body: JSON.stringify({
          homeAddress: {
            streetLine1: '1600 Amphitheatre Pkwy',
            city: 'Mountain View',
            state: 'CA',
            zip: '94043',
          },
        }),
      },
    );

    const response = await POST(request);
    expect(response.status).toBe(500);

    containerSpy.mockRestore();
  });
});
