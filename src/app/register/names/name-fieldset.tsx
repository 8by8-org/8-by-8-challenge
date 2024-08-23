'use client';
import { Select } from '@/components/form-components/select';
import { InputGroup } from '@/components/form-components/input-group';
import { Messages } from '@/components/form-components/messages';
import type { FieldOfType } from 'fully-formed';
import type { ReactNode } from 'react';

interface NameForm {
  fields: {
    title: FieldOfType<string>;
    first: FieldOfType<string>;
    middle: FieldOfType<string>;
    last: FieldOfType<string>;
    suffix: FieldOfType<string>;
  };
}

interface NameFieldsetProps {
  title: ReactNode;
  form: NameForm;
}

export function NameFieldset({ title, form }: NameFieldsetProps) {
  return (
    <fieldset style={{ marginBottom: '30px' }}>
      <legend className="h2" style={{ marginBottom: '24px' }}>
        {title}
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
        style={{
          width: '50%',
        }}
      />
      <InputGroup
        field={form.fields.first}
        labelContent="First Name*"
        labelVariant="floating"
        type="text"
        containerStyle={{
          marginTop: '30px',
          marginBottom: '30px',
        }}
      />
      <InputGroup
        field={form.fields.middle}
        labelContent="Middle Name"
        labelVariant="floating"
        type="text"
        containerStyle={{
          marginBottom: '30px',
        }}
      />
      <InputGroup
        field={form.fields.last}
        labelContent="Last Name*"
        labelVariant="floating"
        type="text"
        containerStyle={{
          marginBottom: '30px',
        }}
      />
      <Select
        field={form.fields.suffix}
        label="Suffix"
        options={[
          {
            text: 'Jr.',
            value: 'Jr.',
          },
          {
            text: 'Esq.',
            value: 'Esq.',
          },
        ]}
        style={{
          width: '50%',
        }}
      />
    </fieldset>
  );
}
