'use client';
import { useContextSafely } from '@/hooks/use-context-safely';
import { VoterRegistrationContext } from '../../../voter-registration-context';
import { Select } from '@/components/form-components/select';
import { Checkbox } from '@/components/form-components/checkbox';
import { useValue } from 'fully-formed';

interface OtherInfoFormComponentProps {
  politicalParties: string[];
}

export function OtherInfoFormComponent({
  politicalParties,
}: OtherInfoFormComponentProps) {
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
        label="Political party"
        options={politicalParties.map(party => ({
          text: party,
          value: party,
        }))}
      />
      <Checkbox
        checked={useValue(otherDetailsForm.fields.changedParties)}
        onChange={e =>
          otherDetailsForm.fields.changedParties.setValue(e.target.checked)
        }
        name={otherDetailsForm.fields.changedParties.name}
        labelContent="I've changed political parties"
      />
      <Select
        field={otherDetailsForm.fields.race}
        label="Race*"
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
    </form>
  );
}
