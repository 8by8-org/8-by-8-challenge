'use client';
import { useContextSafely } from '@/hooks/use-context-safely';
import { VoterRegistrationContext } from '../../voter-registration-context';
import { InputGroup } from '@/components/form-components/input-group';
import { Select } from '@/components/form-components/select';
import { US_STATE_ABBREVIATIONS } from '@/constants/us-state-abbreviations';
import styles from './styles.module.scss';

export function PreviousAddress() {
  const { voterRegistrationForm } = useContextSafely(
    VoterRegistrationContext,
    'PreviousAddress',
  );
  const form = voterRegistrationForm.fields.addresses.fields.previousAddress;

  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.legend}>Previous Address</legend>
      <InputGroup
        field={form.fields.streetLine1}
        type="text"
        labelContent="Street Address*"
        labelVariant="floating"
        containerClassName={styles.input_row_margin}
      />
      <InputGroup
        field={form.fields.streetLine2}
        type="text"
        labelContent="Address Line 2"
        labelVariant="floating"
        containerClassName={styles.input_row_margin}
      />
      <InputGroup
        field={form.fields.city}
        type="text"
        labelContent="City*"
        labelVariant="floating"
        containerClassName={styles.input_row_margin}
      />
      <div className={styles.input_row}>
        <InputGroup
          field={form.fields.zip}
          type="text"
          labelContent="Zip code*"
          labelVariant="floating"
          maxLength={5}
          containerClassName={styles.zip}
        />
        <Select
          field={form.fields.state}
          label="State"
          options={Object.values(US_STATE_ABBREVIATIONS).map(abbr => ({
            text: abbr,
            value: abbr,
          }))}
          className={styles.state}
        />
      </div>
    </fieldset>
  );
}
