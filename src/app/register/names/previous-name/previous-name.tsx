'use client';
import { useContextSafely } from '@/hooks/use-context-safely';
import { VoterRegistrationContext } from '../../voter-registration-context';
import { Select } from '@/components/form-components/select';
import { InputGroup } from '@/components/form-components/input-group';
import styles from './styles.module.scss';

export function PreviousName() {
  const { voterRegistrationForm } = useContextSafely(
    VoterRegistrationContext,
    'YourName',
  );
  const form = voterRegistrationForm.fields.names.fields.previousName;

  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.legend}>Previous Name</legend>
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
