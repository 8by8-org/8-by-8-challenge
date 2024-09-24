import { AddressComponent } from '@/model/types/addresses/address-component';

export function isEmphasized(addressComponent: AddressComponent | string) {
  return typeof addressComponent === 'object' && addressComponent.hasIssue;
}
