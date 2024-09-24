import { AddressesForm } from '@/app/register/addresses/addresses-form';

export type AddressFormNames = keyof InstanceType<
  typeof AddressesForm
>['fields'];
