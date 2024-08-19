import { SubFormTemplate, FormFactory, type FieldOfType } from 'fully-formed';
import { HomeAddressForm } from '../../voter-registration-form/addresses-form/home-address-form';
import { MailingAddressForm } from '../../voter-registration-form/addresses-form/mailing-address-form';
import { PreviousAddressForm } from './previous-address-form';

class AddressesTemplate extends SubFormTemplate {
  public readonly name = 'addresses';
  public readonly fields: [
    InstanceType<typeof HomeAddressForm>,
    InstanceType<typeof MailingAddressForm>,
    InstanceType<typeof PreviousAddressForm>,
  ];

  public constructor(externalZipCodeField: FieldOfType<string>) {
    super();
    this.fields = [
      new HomeAddressForm(externalZipCodeField),
      new MailingAddressForm(),
      new PreviousAddressForm(),
    ];
  }
}

export const AddressesForm = FormFactory.createSubForm(AddressesTemplate);
