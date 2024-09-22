'use client';
import Image from 'next/image';
import { useContextSafely } from '@/hooks/use-context-safely';
import { useHasFieldWithCautionValidity } from '../hooks/use-has-field-with-caution-validity';
import { VoterRegistrationContext } from '../../voter-registration-context';
import { MoreInfo } from '@/components/utils/more-info';
import { InputGroup } from '@/components/form-components/input-group';
import { Select } from '@/components/form-components/select';
import { PhoneInputGroup } from '@/components/form-components/phone-input-group';
import { US_STATE_ABBREVIATIONS } from '@/constants/us-state-abbreviations';
import warningIconDark from '@/../public/static/images/components/shared/warning-icon-dark.svg';
import styles from './styles.module.scss';

export function HomeAddress() {
  const { voterRegistrationForm } = useContextSafely(
    VoterRegistrationContext,
    'HomeAddress',
  );
  const form = voterRegistrationForm.fields.addresses.fields.homeAddress;
  const displayWarningMessage = useHasFieldWithCautionValidity(form);

  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.legend}>
        Home Address
        <MoreInfo
          buttonAltText={
            'Click for more information about entering your home address.'
          }
          dialogAriaLabel={'More information about entering your home address.'}
          info={
            <p>
              Provide your home address. Do not put your mailing address here if
              it&apos;s different from your home address. Do not use a PO Box or
              rural route without a box number. If you live in a rural area but
              don&apos;t have a street address or have no address, you can show
              where you live on a map later on the printed form.
            </p>
          }
          className={styles.more_info_button}
        />
      </legend>
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
      <div className={styles.input_row}>
        <PhoneInputGroup
          field={form.fields.phone}
          labelContent="Phone number"
          labelVariant="floating"
          containerClassName={styles.phone_number}
        />
        <Select
          field={form.fields.phoneType}
          label="Phone Type"
          options={[
            {
              text: 'Mobile',
              value: 'Mobile',
            },
            {
              text: 'Home',
              value: 'Home',
            },
            {
              text: 'Work',
              value: 'Work',
            },
            {
              text: 'Other',
              value: 'Other',
            },
          ]}
          className={styles.phone_type}
        />
      </div>
    </fieldset>
  );
}
