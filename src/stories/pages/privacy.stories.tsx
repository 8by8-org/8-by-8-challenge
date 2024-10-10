import { Meta, StoryObj } from '@storybook/react';
import PrivacyPolicyPage from '@/app/privacy/page';
import { GlobalStylesProvider } from '../global-styles-provider';

const meta: Meta<typeof PrivacyPolicyPage> = {
  component: PrivacyPolicyPage,
};

export default meta;

type Story = StoryObj<typeof PrivacyPolicyPage>;

export const Default: Story = {
  render: () => {
    return (
      <GlobalStylesProvider>
        <PrivacyPolicyPage />
      </GlobalStylesProvider>
    );
  },
};
