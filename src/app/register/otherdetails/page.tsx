'use client';
import { useContextSafely } from '@/hooks/functions/use-context-safely';
import { VoterRegistrationContext } from '../voter-registration-context';
import { Select } from '@/components/form-components/select';
import { ExcludableContent } from '@/components/form-components/excludable-content/excludable-content';
import { InputGroup } from '@/components/form-components/input-group';

export default function OtherDetails() {
  const { voterRegistrationForm } = useContextSafely(
    VoterRegistrationContext,
    'OtherDetails',
  );

  const otherDetailsForm = voterRegistrationForm.fields.otherDetails;

  return (
    <form>
      <h2>Other Details</h2>
      <Select
        field={otherDetailsForm.fields.party}
        labelText="Political party"
        options={[
          {
            text: 'Democratic',
            value: 'democratic',
          },
          {
            text: 'Republican',
            value: 'republican',
          },
          {
            text: 'Green',
            value: 'green',
          },
          {
            text: 'Other',
            value: 'other',
          },
        ]}
      />
      <ExcludableContent excludableField={otherDetailsForm.fields.otherParty}>
        <InputGroup
          field={otherDetailsForm.fields.otherParty}
          labelContent="Other"
          labelVariant="floating"
          type="text"
        />
      </ExcludableContent>
    </form>
  );
}
