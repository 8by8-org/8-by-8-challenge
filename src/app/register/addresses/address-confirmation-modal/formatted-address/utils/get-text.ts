import { AddressComponent } from '../../types/address-component';

export function getText(addressComponent: AddressComponent | string) {
  return typeof addressComponent === 'string' ? addressComponent : (
      addressComponent.text
    );
}
