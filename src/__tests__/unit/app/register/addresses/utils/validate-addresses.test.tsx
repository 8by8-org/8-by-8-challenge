import { validateAddresses } from '@/app/register/addresses/utils/validate-addresses';
import { AddressErrorTypes } from '@/model/types/addresses/address-error-types';
import { Builder } from 'builder-pattern';
import type { AddressErrors } from '@/model/types/addresses/address-errors';

describe('validateAddresses', () => {
  it(`returns an array containing address errors if the response is ok.`, async () => {
    const errors: AddressErrors[] = [
      {
        type: AddressErrorTypes.UnconfirmedComponents,
        form: 'homeAddress',
        unconfirmedAddressComponents: {
          streetLine1: {
            value: '2930 Pearl St.',
            hasIssue: false,
          },
          streetLine2: {
            value: 'Suite 100',
            hasIssue: true,
          },
          city: {
            value: 'Boulder',
            hasIssue: false,
          },
          state: {
            value: 'CA',
            hasIssue: true,
          },
          zip: {
            value: '80301',
            hasIssue: false,
          },
        },
      },
      {
        type: AddressErrorTypes.MissingSubpremise,
        form: 'mailingAddress',
      },
    ];

    const response = Builder<Response>()
      .ok(true)
      .json(() => {
        return Promise.resolve({
          result: {
            errors,
          },
        });
      })
      .build();

    const fetchSpy = jest.spyOn(globalThis, 'fetch').mockImplementation(() => {
      return Promise.resolve(response);
    });

    const verdict = await validateAddresses({
      homeAddress: {
        streetLine1: '2930 Pearl St.',
        streetLine2: 'Suite 100',
        city: 'Boulder',
        state: 'CA',
        zip: '80301',
      },
      mailingAddress: {
        streetLine1: '500 W 2nd St',
        city: 'Austin',
        state: 'TX',
        zip: '78701',
      },
    });

    expect(verdict).toStrictEqual(errors);

    fetchSpy.mockRestore();
  });

  it(`returns an array containing only a ValidationFailed error if the response
  is not ok.`, async () => {
    const response = Builder<Response>().ok(false).build();

    const fetchSpy = jest.spyOn(globalThis, 'fetch').mockImplementation(() => {
      return Promise.resolve(response);
    });

    const verdict = await validateAddresses({
      homeAddress: {
        streetLine1: '2930 Pearl St.',
        streetLine2: 'Suite 100',
        city: 'Boulder',
        state: 'CA',
        zip: '80301',
      },
    });

    expect(verdict).toStrictEqual([
      {
        type: AddressErrorTypes.ValidationFailed,
      },
    ]);

    fetchSpy.mockRestore();
  });

  it(`returns an array containing only a ValidationFailed error if fetch throws
  an error.`, async () => {
    const fetchSpy = jest.spyOn(globalThis, 'fetch').mockImplementation(() => {
      throw new Error();
    });

    const verdict = await validateAddresses({
      homeAddress: {
        streetLine1: '2930 Pearl St.',
        streetLine2: 'Suite 100',
        city: 'Boulder',
        state: 'CA',
        zip: '80301',
      },
    });

    expect(verdict).toStrictEqual([
      {
        type: AddressErrorTypes.ValidationFailed,
      },
    ]);

    fetchSpy.mockRestore();
  });
});
