'use client';
import { InputGroup } from '@/components/form-components/input-group';
import { Select } from '@/components/form-components/select';
import { US_STATES_AND_TERRITORIES } from '@/constants/us-states-and-territories';
import { FieldOfType, IGroup, useMessages, useValidity } from 'fully-formed';
import { ReactNode } from 'react';

interface AddressForm {
  fields: {
    streetLine1: FieldOfType<string>;
    streetLine2: FieldOfType<string>;
    unit: FieldOfType<string>;
    city: FieldOfType<string>;
    state: FieldOfType<string>;
    zip: FieldOfType<string>;
  };

  groups: {
    addressGroup: IGroup;
  };
}

interface AddressFieldsetProps {
  form: AddressForm;
  title: ReactNode;
}

export function AddressFieldset({ form, title }: AddressFieldsetProps) {
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
            options={US_STATES_AND_TERRITORIES.map(abbr => ({
              text: abbr,
              value: abbr,
            }))}
            style={{ width: '100px' }}
          />
        </div>
      </div>
      <div style={{ display: 'block', minHeight: '19px' }}>
        {useMessages(form.groups.addressGroup).map(({ text }, index) => {
          return <span key={index}>{text}</span>;
        })}
      </div>
    </fieldset>
  );
}
