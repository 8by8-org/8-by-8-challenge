'use client';
import Image from 'next/image';
import { useContextSafely } from '@/hooks/use-context-safely';
import { useHasFieldWithCautionValidity } from '../hooks/use-has-field-with-caution-validity';
import { VoterRegistrationContext } from '../../voter-registration-context';
import { InputGroup } from '@/components/form-components/input-group';
import { Select } from '@/components/form-components/select';
import { US_STATE_ABBREVIATIONS } from '@/constants/us-state-abbreviations';
import warningIconDark from '@/../public/static/images/components/shared/warning-icon-dark.svg';
import styles from './styles.module.scss';

export function PreviousAddress() {
  const { voterRegistrationForm } = useContextSafely(
    VoterRegistrationContext,
    'PreviousAddress',
  );
  const form = voterRegistrationForm.fields.addresses.fields.previousAddress;
  const displayWarningMessage = useHasFieldWithCautionValidity(form);

  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.legend}>Previous Address</legend>
      {displayWarningMessage && (
        <p className={styles.warning_message}>
          Please double-check fields marked with a{' '}
          <Image
            src={warningIconDark}
            alt="Warning icon"
            className={styles.warning_icon}
          />
        </p>
      )}
      <InputGroup
        field={form.fields.streetLine1}
        type="text"
        labelContent="Street Address*"
        labelVariant="floating"
        containerClassName={styles.input_row_margin}
        aria-required
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
        aria-required
      />
      <div className={styles.input_row}>
        <InputGroup
          field={form.fields.zip}
          type="text"
          labelContent="Zip code*"
          labelVariant="floating"
          maxLength={5}
          containerClassName={styles.zip}
          aria-required
        />
        <Select
          field={form.fields.state}
          label="State"
          options={Object.values(US_STATE_ABBREVIATIONS).map(abbr => ({
            text: abbr,
            value: abbr,
          }))}
          className={styles.state}
          aria-required
        />
      </div>
    </fieldset>
  );
}
