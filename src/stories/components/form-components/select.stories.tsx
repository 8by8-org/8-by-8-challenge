import { Meta, StoryObj } from '@storybook/react';
import { Select } from '@/components/form-components/select';
import { Field, StringValidators, Validator } from 'fully-formed';
import { GlobalStylesProvider } from '@/stories/global-styles-provider';
import { US_STATES_AND_TERRITORIES } from '@/constants/us-states-and-territories';

const meta: Meta<typeof Select> = {
  component: Select,
  parameters: {
    layout: 'fullscreen',
    controls: {
      expanded: false,
    },
  },
};

export default meta;

type Story = StoryObj<typeof Select>;

export const FewOptions: Story = {
  render: () => {
    const favoriteColor = new Field({
      name: 'favoriteColor',
      defaultValue: '',
    });

    return (
      <GlobalStylesProvider>
        <Select
          label="Favorite Color"
          field={favoriteColor}
          options={[
            {
              text: 'Red',
              value: 'red',
            },
            {
              text: 'Green',
              value: 'green',
            },
            {
              text: 'Blue',
              value: 'blue',
            },
          ]}
        />
      </GlobalStylesProvider>
    );
  },
};

export const ManyOptions: Story = {
  render: () => {
    const state = new Field({
      name: 'state',
      defaultValue: '',
    });

    return (
      <GlobalStylesProvider>
        <Select
          label="State"
          field={state}
          options={US_STATES_AND_TERRITORIES.map(abbr => {
            return {
              text: abbr,
              value: abbr,
            };
          })}
        />
      </GlobalStylesProvider>
    );
  },
};

export const NoOptions: Story = {
  render: () => {
    return (
      <GlobalStylesProvider>
        <Select
          label="No options to select from"
          field={new Field({ name: 'testField', defaultValue: '' })}
          options={[]}
        />
      </GlobalStylesProvider>
    );
  },
};

export const WithMoreInfoButton: Story = {
  render: () => {
    const politicalParty = new Field({
      name: 'politicalParty',
      defaultValue: '',
    });

    return (
      <GlobalStylesProvider>
        <Select
          label="Political Party"
          field={politicalParty}
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
              text: 'Libertarian',
              value: 'libertarian',
            },
            {
              text: 'Other',
              value: 'other',
            },
          ]}
          moreInfo={{
            buttonAltText: 'Click for more information about this field',
            dialogAriaLabel: 'More information',
            infoComponent: (
              <p>
                Lorem ipsum odor amet, consectetuer adipiscing elit. Aeleifend
                magna dolor, nibh at metus eu habitant. Quam tempus suscipit
                amet nec ut blandit.
              </p>
            ),
          }}
        />
      </GlobalStylesProvider>
    );
  },
};

export const Required: Story = {
  render: () => {
    const requiredField = new Field({
      name: 'requiredField',
      defaultValue: '',
      validators: [
        StringValidators.required({
          invalidMessage: 'Please select an option.',
        }),
      ],
    });

    return (
      <GlobalStylesProvider>
        <Select
          label="Select an option"
          field={requiredField}
          options={[
            {
              text: 'Option A',
              value: 'a',
            },
            {
              text: 'Option B',
              value: 'b',
            },
            {
              text: 'Option C',
              value: 'c',
            },
          ]}
        />
      </GlobalStylesProvider>
    );
  },
};

export const WithValidation: Story = {
  render: () => {
    const withValidation = new Field({
      name: 'withValidation',
      defaultValue: '',
      validators: [
        new Validator<string>({
          predicate: value => value !== 'invalid',
          invalidMessage: 'Please select a valid option.',
        }),
      ],
    });

    return (
      <GlobalStylesProvider>
        <Select
          label="Select an option"
          field={withValidation}
          options={[
            {
              text: 'This option is invalid.',
              value: 'invalid',
            },
            {
              text: 'This option is valid.',
              value: 'valid',
            },
          ]}
        />
      </GlobalStylesProvider>
    );
  },
};

export const Narrow: Story = {
  render: () => {
    const favoriteColor = new Field({
      name: 'favoriteColor',
      defaultValue: '',
    });

    return (
      <GlobalStylesProvider>
        <Select
          label="Favorite Color"
          field={favoriteColor}
          options={[
            {
              text: 'Magenta',
              value: 'magenta',
            },
            {
              text: 'Emerald',
              value: 'emerald',
            },
            {
              text: 'Cerulean',
              value: 'cerulean',
            },
          ]}
          style={{ maxWidth: '100px' }}
        />
      </GlobalStylesProvider>
    );
  },
};

export const Wide: Story = {
  render: () => {
    const pickOne = new Field({
      name: 'pickOne',
      defaultValue: '',
    });

    return (
      <GlobalStylesProvider>
        <Select
          label="Pick One"
          field={pickOne}
          options={[
            {
              text: 'A',
              value: 'a',
            },
            {
              text: 'B',
              value: 'b',
            },
            {
              text: 'C',
              value: 'c',
            },
          ]}
          style={{ width: '300px' }}
        />
      </GlobalStylesProvider>
    );
  },
};
