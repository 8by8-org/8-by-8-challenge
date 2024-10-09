import { Meta, StoryObj } from '@storybook/react';
import TermsOfServicePage from '@/app/tos/page';
import { GlobalStylesProvider } from '../global-styles-provider';

const meta: Meta<typeof TermsOfServicePage> = {
  component: TermsOfServicePage,
};

export default meta;

type Story = StoryObj<typeof TermsOfServicePage>;

export const Default: Story = {
  render: () => {
    return (
      <GlobalStylesProvider>
        <TermsOfServicePage />
      </GlobalStylesProvider>
    );
  },
};
