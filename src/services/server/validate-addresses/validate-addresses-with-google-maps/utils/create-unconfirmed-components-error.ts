import { AddressErrorTypes } from '@/model/types/addresses/address-error-types';
import { collapseWhitespace } from '@/utils/shared/collapse-whitespace';
import type { Address } from '@/model/types/addresses/address';
import type { UnconfirmedComponentsError } from '@/model/types/addresses/unconfirmed-components-error';
import type { AddressComponents } from '@/model/types/addresses/address-components';
import type { ProcessableResponse } from '../types/processable-response';
import type { AddressFormNames } from '@/model/types/addresses/address-form-names';

export function createUnconfirmedComponentsError(
  address: Address,
  response: ProcessableResponse,
  form: AddressFormNames,
): UnconfirmedComponentsError {
  const unconfirmedAddressComponents: AddressComponents = {
    streetLine1: {
      value: address.streetLine1,
      hasIssue: isAddressLineUnconfirmed(address.streetLine1, response),
    },
    city: {
      value: address.city,
      hasIssue: isComponentUnconfirmed('city', response),
    },
    state: {
      value: address.state,
      hasIssue: isComponentUnconfirmed('state', response),
    },
    zip: {
      value: address.zip,
      hasIssue: isComponentUnconfirmed('zip', response),
    },
  };

  if (address.streetLine2) {
    unconfirmedAddressComponents.streetLine2 = {
      value: address.streetLine2,
      hasIssue: isAddressLineUnconfirmed(address.streetLine2, response),
    };
  }

  return {
    type: AddressErrorTypes.UnconfirmedComponents,
    form,
    unconfirmedAddressComponents,
  };
}

function isAddressLineUnconfirmed(
  addressLine: string,
  response: ProcessableResponse,
): boolean {
  if (addressLineMatchesUnconfirmedStreetAddress(addressLine, response)) {
    return true;
  }

  const componentsToIgnore = [
    'street_number',
    'route',
    'locality',
    'administrative_area_level_1',
    'postal_code',
    'postal_code_prefix',
    'postal_code_suffix',
    'country',
  ];

  for (const addressComponent of response.result.address.addressComponents) {
    if (
      addressComponent.confirmationLevel === 'CONFIRMED' ||
      componentsToIgnore.includes(addressComponent.componentType)
    ) {
      continue;
    }

    if (addressComponent.componentName.text === addressLine) {
      return true;
    }
  }

  return false;
}

function addressLineMatchesUnconfirmedStreetAddress(
  addressLine: string,
  response: ProcessableResponse,
) {
  const streetAddress = getStreetAddressFromResponse(response);
  if (!streetAddress) return false;

  return (
    streetAddressIsUnconfirmed(response) &&
    collapseWhitespace(addressLine) === collapseWhitespace(streetAddress)
  );
}

function streetAddressIsUnconfirmed(response: ProcessableResponse) {
  const streetNumber = response.result.address.addressComponents.find(
    component => component.componentType === 'street_number',
  );

  const route = response.result.address.addressComponents.find(
    component => component.componentType === 'route',
  );

  const isUnconfirmed = !!(
    streetNumber?.confirmationLevel !== 'CONFIRMED' ||
    route?.confirmationLevel !== 'CONFIRMED'
  );

  return isUnconfirmed;
}

function getStreetAddressFromResponse(
  response: ProcessableResponse,
): string | undefined {
  const streetNumber = response.result.address.addressComponents.find(
    component => component.componentType === 'street_number',
  );

  const route = response.result.address.addressComponents.find(
    component => component.componentType === 'route',
  );

  if (streetNumber && route) {
    return `${streetNumber.componentName.text} ${route.componentName.text}`;
  } else {
    return streetNumber?.componentName.text || route?.componentName.text;
  }
}

function isComponentUnconfirmed(
  type: 'city' | 'state' | 'zip',
  response: ProcessableResponse,
) {
  let componentType = '';

  switch (type) {
    case 'city':
      componentType = 'locality';
      break;
    case 'state':
      componentType = 'administrative_area_level_1';
      break;
    case 'zip':
      componentType = 'postal_code';
      break;
  }

  const component = response.result.address.addressComponents.find(
    component => component.componentType === componentType,
  );

  return !component || component.confirmationLevel !== 'CONFIRMED';
}
