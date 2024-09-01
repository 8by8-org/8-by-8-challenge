import type { FieldOfType } from 'fully-formed';

export interface AddressForm {
  fields: {
    streetLine1: FieldOfType<string>;
    streetLine2: FieldOfType<string>;
    city: FieldOfType<string>;
    state: FieldOfType<string>;
    zip: FieldOfType<string>;
  };
}
