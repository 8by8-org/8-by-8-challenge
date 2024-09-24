import { AddressComponent } from './address-component';

export interface AddressComponents {
  streetLine1: AddressComponent;
  streetLine2?: AddressComponent;
  city: AddressComponent;
  state: AddressComponent;
  zip: AddressComponent;
}
