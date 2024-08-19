import { EligibilityForm } from './eligibility/eligibility-form';
import { AddressesForm } from './addresses/addresses-form';
import { FormTemplate, FormFactory } from 'fully-formed';
import { NamesForm } from './names-form';
import { OtherDetailsForm } from './otherdetails/other-details-form';
import { User } from '@/model/types/user';

class VoterRegistrationTemplate extends FormTemplate {
  public readonly fields: [
    InstanceType<typeof EligibilityForm>,
    InstanceType<typeof NamesForm>,
    InstanceType<typeof AddressesForm>,
    InstanceType<typeof OtherDetailsForm>,
  ];

  public constructor(user: User | null) {
    super();
    const eligibilityForm = new EligibilityForm(user?.email ?? '');
    const addressesForm = new AddressesForm(eligibilityForm.fields.zip);

    this.fields = [
      eligibilityForm,
      new NamesForm(),
      addressesForm,
      new OtherDetailsForm(),
    ];
  }
}

export const VoterRegistrationForm = FormFactory.createForm(
  VoterRegistrationTemplate,
);
