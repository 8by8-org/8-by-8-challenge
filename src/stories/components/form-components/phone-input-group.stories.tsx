import { Meta, StoryObj } from '@storybook/react';
import { PhoneInputGroup } from '@/components/form-components/phone-input-group';
import { Field } from 'fully-formed';
import { PhoneValidator } from '@/app/register/utils/phone-validator';
import { GlobalStylesProvider } from '@/stories/global-styles-provider';

const meta: Meta<typeof PhoneInputGroup> = {
  component: PhoneInputGroup,
};

export default meta;

type Story = StoryObj<typeof PhoneInputGroup>;

export const Default: Story = {
  render: () => {
    return (
      <GlobalStylesProvider>
        <PhoneInputGroup
          field={
            new Field({
              name: 'phone',
              defaultValue: '',
              validators: [new PhoneValidator()],
            })
          }
          labelVariant="floating"
          labelContent="Phone number"
          autoComplete="tel"
          containerStyle={{
            maxWidth: '315px',
          }}
        />
      </GlobalStylesProvider>
    );
  },
};
