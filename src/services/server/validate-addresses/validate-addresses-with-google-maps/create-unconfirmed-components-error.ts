import { AddressErrorTypes } from '@/model/types/addresses/address-error-types';
import type { Address } from '@/model/types/addresses/address';
import type { UnconfirmedComponentsError } from '@/model/types/addresses/unconfirmed-components-error';
import type { AddressComponents } from '@/model/types/addresses/address-components';

export function createUnconfirmedComponentsError(
  address: Address,
  result: any,
): UnconfirmedComponentsError {
  const unconfirmedAddressComponents: AddressComponents = {
    streetLine1: {
      value: address.streetLine1,
      hasIssue: isAddressLineUnconfirmed(address.streetLine1, result),
    },
    city: {
      value: address.city,
      hasIssue: isComponentUnconfirmed('city', result),
    },
    state: {
      value: address.state,
      hasIssue: isComponentUnconfirmed('state', result),
    },
    zip: {
      value: address.zip,
      hasIssue: isComponentUnconfirmed('zip', result),
    },
  };

  if (address.streetLine2) {
    unconfirmedAddressComponents.streetLine2 = {
      value: address.streetLine2,
      hasIssue: isAddressLineUnconfirmed(address.streetLine2, result),
    };
  }

  return {
    type: AddressErrorTypes.UnconfirmedComponents,
    unconfirmedAddressComponents,
  };
}

function isAddressLineUnconfirmed(addressLine: string, result: any): boolean {
  if (
    streetAddressIsUnconfirmed(result) &&
    addressLine === getStreetAddress(result)
  ) {
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

  for (const addressComponent of result.address.addressComponents) {
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

function streetAddressIsUnconfirmed(result: any) {
  const streetNumber = result.address.addressComponents.find(
    (component: any) => component.componentType === 'street_number',
  );

  const route = result.address.addressComponents.find(
    (component: any) => component.componentType === 'route',
  );

  const isUnconfirmed = !!(
    streetNumber?.confirmationLevel !== 'CONFIRMED' ||
    route?.confirmationLevel !== 'CONFIRMED'
  );

  return isUnconfirmed;
}

function getStreetAddress(result: any) {
  const streetNumber = result.address.addressComponents.find(
    (component: any) => component.componentType === 'street_number',
  );

  const route = result.address.addressComponents.find(
    (component: any) => component.componentType === 'route',
  );

  if (streetNumber && route) {
    return `${streetNumber.componentName.text} ${route.componentName.text}`;
  } else {
    return streetNumber?.componentName.text || route?.componentName.text;
  }
}

function isComponentUnconfirmed(type: 'city' | 'state' | 'zip', result: any) {
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

  return (
    result.address.addressComponents.find(
      (component: any) => component.componentType === componentType,
    ).confirmationLevel !== 'CONFIRMED'
  );
}
