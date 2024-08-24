import { EligibilityForm } from './eligibility/eligibility-form';
import { AddressesForm } from './addresses/addresses-form';
import { FormTemplate, FormFactory } from 'fully-formed';
import { NamesForm } from './names/names-form';
import { OtherInfoForm } from './other-info/[state]/[zip]/other-details-form';
import type { User } from '@/model/types/user';

export const VoterRegistrationForm = FormFactory.createForm(
  class VoterRegistrationTemplate extends FormTemplate {
    public readonly fields: [
      InstanceType<typeof EligibilityForm>,
      InstanceType<typeof NamesForm>,
      InstanceType<typeof AddressesForm>,
      InstanceType<typeof OtherInfoForm>,
    ];

    public constructor(user: User | null) {
      super();
      const eligibilityForm = new EligibilityForm(user?.email ?? '');
      const addressesForm = new AddressesForm(eligibilityForm.fields.zip);

      this.fields = [
        eligibilityForm,
        new NamesForm(),
        addressesForm,
        new OtherInfoForm(),
      ];
    }
  },
);
