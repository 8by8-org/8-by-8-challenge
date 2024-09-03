import type { IValidateAddressResponse } from '../types/ivalidate-address-response';
import type { ProcessableResponse } from '../types/processable-response';

export function isProcessableResponse(
  response: IValidateAddressResponse,
): response is ProcessableResponse {
  if (
    !('result' in response) ||
    !response.result ||
    typeof response.result !== 'object'
  ) {
    return false;
  }

  const { result } = response;

  if (
    !('verdict' in result) ||
    !result.verdict ||
    typeof result.verdict !== 'object'
  ) {
    return false;
  }

  if (
    !('address' in result) ||
    !result.address ||
    typeof result.address !== 'object'
  ) {
    return false;
  }

  const { address } = result;

  if (
    !('postalAddress' in address) ||
    !address.postalAddress ||
    typeof address.postalAddress !== 'object'
  ) {
    return false;
  }

  const { postalAddress } = address;

  if (
    !('postalCode' in postalAddress) ||
    typeof postalAddress.postalCode !== 'string'
  ) {
    return false;
  }

  if (
    !('administrativeArea' in postalAddress) ||
    typeof postalAddress.administrativeArea !== 'string'
  ) {
    return false;
  }

  if (
    !('locality' in postalAddress) ||
    typeof postalAddress.locality !== 'string'
  ) {
    return false;
  }

  if (
    !('addressLines' in postalAddress) ||
    !postalAddress.addressLines ||
    !Array.isArray(postalAddress.addressLines) ||
    !postalAddress.addressLines.every(line => typeof line === 'string')
  ) {
    return false;
  }

  if (
    !('addressComponents' in address) ||
    !address.addressComponents ||
    !Array.isArray(address.addressComponents) ||
    !address.addressComponents.every(component => {
      if (
        !('componentName' in component) ||
        !component.componentName ||
        typeof component.componentName !== 'object'
      ) {
        return false;
      }

      const { componentName } = component;

      if (
        !('text' in componentName) ||
        typeof componentName.text !== 'string'
      ) {
        return false;
      }

      if (
        !('componentType' in component) ||
        typeof component.componentType !== 'string'
      ) {
        return false;
      }

      if (
        !('confirmationLevel' in component) ||
        typeof component.confirmationLevel !== 'string'
      ) {
        return false;
      }

      return true;
    })
  ) {
    return false;
  }

  if (
    'missingComponentTypes' in address &&
    (!Array.isArray(address.missingComponentTypes) ||
      address.missingComponentTypes.some(
        componentType => typeof componentType !== 'string',
      ))
  ) {
    return false;
  }

  return true;
}
