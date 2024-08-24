'use client';
import { InputGroup } from '@/components/form-components/input-group';
import { Select } from '@/components/form-components/select';
import { US_STATE_ABBREVIATIONS } from '@/constants/us-state-abbreviations';
import { FieldOfType } from 'fully-formed';
import { ReactNode } from 'react';

interface HomeAddressForm {
  fields: {
    streetLine1: FieldOfType<string>;
    streetLine2: FieldOfType<string>;
    unit: FieldOfType<string>;
    city: FieldOfType<string>;
    state: FieldOfType<string>;
    zip: FieldOfType<string>;
    phone: FieldOfType<string>;
    phoneType: FieldOfType<string>;
  };
}

interface HomeAddressFieldsetProps {
  form: HomeAddressForm;
  title: ReactNode;
}

export function HomeAddressFieldset({ form, title }: HomeAddressFieldsetProps) {
  return (
    <fieldset>
      <legend className="h2" style={{ marginBottom: '24px' }}>
        {title}
      </legend>
      <InputGroup
        field={form.fields.streetLine1}
        type="text"
        labelContent="Street Address*"
        labelVariant="floating"
        containerStyle={{ marginBottom: '30px' }}
      />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '30px',
        }}
      >
        <InputGroup
          field={form.fields.streetLine2}
          type="text"
          labelContent="Address Line 2"
          labelVariant="floating"
          containerStyle={{ width: '60%' }}
        />
        <InputGroup
          field={form.fields.unit}
          type="text"
          labelContent="Unit #"
          labelVariant="floating"
          containerStyle={{ width: '30%' }}
        />
      </div>
      <InputGroup
        field={form.fields.city}
        type="text"
        labelContent="City*"
        labelVariant="floating"
        containerStyle={{ marginBottom: '30px' }}
      />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '30px',
        }}
      >
        <InputGroup
          field={form.fields.zip}
          type="text"
          labelContent="Zip code*"
          labelVariant="floating"
          maxLength={5}
        />
        <div style={{ paddingTop: '19px' }}>
          <Select
            field={form.fields.state}
            label="State"
            options={Object.values(US_STATE_ABBREVIATIONS).map(abbr => ({
              text: abbr,
              value: abbr,
            }))}
            style={{ width: '100px' }}
          />
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '30px',
        }}
      >
        <InputGroup
          field={form.fields.phone}
          type="number"
          labelContent="Phone number"
          labelVariant="floating"
          maxLength={10}
          containerStyle={{ width: '200px', maxWidth: '200px' }}
        />
        <div style={{ paddingTop: '19px' }}>
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
            style={{ width: '100px' }}
          />
        </div>
      </div>
    </fieldset>
  );
}
