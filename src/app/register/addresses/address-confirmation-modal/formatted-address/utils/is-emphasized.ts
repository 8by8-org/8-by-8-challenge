import { AddressComponent } from '../../types/address-component';

export function isEmphasized(addressComponent: AddressComponent | string) {
  return typeof addressComponent === 'object' && addressComponent.hasIssue;
}
