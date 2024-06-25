import ChallengerWelcome from '@/app/challengerwelcome/page';
import { Meta, StoryObj } from '@storybook/react';
import { GlobalStylesProvider } from '../global-styles-provider';

const meta: Meta<typeof ChallengerWelcome> = {
  component: ChallengerWelcome,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
};

export default meta;

type Story = StoryObj<typeof ChallengerWelcome>;

export const Default: Story = {
  render: () => {
    return (
      <GlobalStylesProvider>
        <ChallengerWelcome />
      </GlobalStylesProvider>
    );
  },
};
