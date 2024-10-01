import PlayerWelcome from '@/app/playerwelcome/page';
import { Meta, StoryObj } from '@storybook/react';
import { UserContext, type UserContextType } from '@/contexts/user-context';
import { GlobalStylesProvider } from '../global-styles-provider';
import { Builder } from 'builder-pattern';

const meta: Meta<typeof PlayerWelcome> = {
  component: PlayerWelcome,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
};

export default meta;

type Story = StoryObj<typeof PlayerWelcome>;

export const Default: Story = {
  render: () => {
    return (
      <GlobalStylesProvider>
        <UserContext.Provider
          value={Builder<UserContextType>()
            .user(null)
            .invitedBy({
              challengerName: 'John Smith',
              challengerAvatar: '2',
              challengerInviteCode: '',
            })
            .build()}
        >
          <PlayerWelcome />
        </UserContext.Provider>
      </GlobalStylesProvider>
    );
  },
};

export const LongName: Story = {
  render: () => {
    return (
      <GlobalStylesProvider>
        <UserContext.Provider
          value={Builder<UserContextType>()
            .user(null)
            .invitedBy({
              challengerName: 'Smitty Werbenjagermanjensen',
              challengerAvatar: '3',
              challengerInviteCode: '',
            })
            .build()}
        >
          <PlayerWelcome />
        </UserContext.Provider>
      </GlobalStylesProvider>
    );
  },
};

export const NoInvite: Story = {
  render: () => {
    return (
      <GlobalStylesProvider>
        <UserContext.Provider
          value={Builder<UserContextType>().user(null).invitedBy(null).build()}
        >
          <PlayerWelcome />
        </UserContext.Provider>
      </GlobalStylesProvider>
    );
  },
};
