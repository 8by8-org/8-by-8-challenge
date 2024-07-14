import ChallengerWelcome from '@/app/challengerwelcome/page';
import { UserContext, type UserContextType } from '@/contexts/user-context';
import { Meta, StoryObj } from '@storybook/react';
import { GlobalStylesProvider } from '../global-styles-provider';
import { Builder } from 'builder-pattern';

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
        <UserContext.Provider
          value={Builder<UserContextType>().user(null).build()}
        >
          <ChallengerWelcome />
        </UserContext.Provider>
      </GlobalStylesProvider>
    );
  },
};
