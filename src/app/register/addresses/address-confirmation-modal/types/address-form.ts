import { HomeAddressForm } from '../../home-address/home-address-form';
import { MailingAddressForm } from '../../mailing-address/mailing-address-form';
import { PreviousAddressForm } from '../../previous-address/previous-address-form';

export type AddressForm =
  | InstanceType<typeof HomeAddressForm>
  | InstanceType<typeof MailingAddressForm>
  | InstanceType<typeof PreviousAddressForm>;
