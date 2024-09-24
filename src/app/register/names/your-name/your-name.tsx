'use client';
import { useContextSafely } from '@/hooks/use-context-safely';
import { VoterRegistrationContext } from '../../voter-registration-context';
import { Select } from '@/components/form-components/select';
import { InputGroup } from '@/components/form-components/input-group';
import { MoreInfo } from '@/components/utils/more-info';
import styles from './styles.module.scss';

export function YourName() {
  const { voterRegistrationForm } = useContextSafely(
    VoterRegistrationContext,
    'YourName',
  );
  const form = voterRegistrationForm.fields.names.fields.yourName;

  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.legend}>
        Your Name
        <MoreInfo
          buttonAltText={'Click for more information about providing your name'}
          dialogAriaLabel={'More infornation about providing your name'}
          info={
            <p>
              Provide your full name. Do not use nicknames or initials. If
              you&apos;ve changed your name, you will be asked for your previous
              name below.
            </p>
          }
          className={styles.more_info}
        />
      </legend>
      <Select
        field={form.fields.title}
        label="Title*"
        options={[
          {
            text: 'Mr.',
            value: 'mr.',
          },
          {
            text: 'Mrs.',
            value: 'mrs.',
          },
          {
            text: 'Miss',
            value: 'miss',
          },
          {
            text: 'Ms.',
            value: 'ms.',
          },
          {
            text: 'Sr.',
            value: 'sr.',
          },
          {
            text: 'Sra.',
            value: 'sra.',
          },
          {
            text: 'Srta.',
            value: 'srta.',
          },
        ]}
        className={styles.select}
        aria-required
      />
      <InputGroup
        field={form.fields.first}
        labelContent="First Name*"
        labelVariant="floating"
        type="text"
        containerClassName={styles.input}
        aria-required
      />
      <InputGroup
        field={form.fields.middle}
        labelContent="Middle Name"
        labelVariant="floating"
        type="text"
        containerClassName={styles.input}
      />
      <InputGroup
        field={form.fields.last}
        labelContent="Last Name*"
        labelVariant="floating"
        type="text"
        containerClassName={styles.input}
        aria-required
      />
      <Select
        field={form.fields.suffix}
        label="Suffix"
        options={[
          {
            text: '',
            value: '',
          },
          {
            text: 'Jr.',
            value: 'Jr.',
          },
          {
            text: 'Sr.',
            value: 'Sr.',
          },
          {
            text: 'II',
            value: 'II',
          },
          {
            text: 'III',
            value: 'III',
          },
          {
            text: 'IV',
            value: 'IV',
          },
        ]}
        className={styles.select}
      />
    </fieldset>
  );
}
