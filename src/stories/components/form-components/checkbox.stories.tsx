import { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Checkbox } from '@/components/form-components/checkbox';
import { GlobalStylesProvider } from '@/stories/global-styles-provider';

const meta: Meta<typeof Checkbox> = {
  component: Checkbox,
};

export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);

    return (
      <GlobalStylesProvider>
        <Checkbox
          name="myCheckbox"
          labelContent={
            checked ?
              'Checked. Click to uncheck.'
            : 'Unchecked. Click to check.'
          }
          checked={checked}
          onChange={() => setChecked(!checked)}
        />
      </GlobalStylesProvider>
    );
  },
};
