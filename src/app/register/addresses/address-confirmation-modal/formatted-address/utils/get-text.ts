import { AddressComponent } from '@/model/types/addresses/address-component';

export function getText(addressComponent: AddressComponent | string) {
  return typeof addressComponent === 'string' ? addressComponent : (
      addressComponent.value
    );
}
