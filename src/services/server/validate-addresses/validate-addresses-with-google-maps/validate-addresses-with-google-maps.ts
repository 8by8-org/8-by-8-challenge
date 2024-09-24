import 'server-only';
import { bind } from 'undecorated-di';
import { validateAddressWithGoogleMaps } from './utils/validate-address-with-google-maps';
import type { ValidateAddressesParams } from '../validate-addresses';
import type { AddressErrors } from '@/model/types/addresses/address-errors';

export const validateAddressesWithGoogleMaps = bind(
  async function validateAddressesWithGoogleMaps(
    params: ValidateAddressesParams,
  ): Promise<AddressErrors[]> {
    const errors = await Promise.all([
      validateAddressWithGoogleMaps(params.homeAddress, 'homeAddress'),
      params.mailingAddress &&
        validateAddressWithGoogleMaps(params.mailingAddress, 'mailingAddress'),
      params.previousAddress &&
        validateAddressWithGoogleMaps(
          params.previousAddress,
          'previousAddress',
        ),
    ]);

    return errors.flat().filter(error => !!error);
  },
  [],
);
