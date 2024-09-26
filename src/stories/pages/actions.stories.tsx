import { Meta, StoryObj } from '@storybook/react';
import ActionsPage from '@/app/actions/page';
import { GlobalStylesProvider } from '../global-styles-provider';
import { UserContext, type UserContextType } from '@/contexts/user-context';
import { Builder } from 'builder-pattern';
import { UserType } from '@/model/enums/user-type';
import { createId } from '@paralleldrive/cuid2';
import type { User } from '@/model/types/user';
import type { ChallengerData } from '@/model/types/challenger-data';

const meta: Meta<typeof ActionsPage> = {
  component: ActionsPage,
};

export default meta;

type Story = StoryObj<typeof ActionsPage>;

export const NoActionsComplete: Story = {
  render: () => {
    const user = Builder<User>()
      .contributedTo([])
      .completedActions({
        electionReminders: false,
        registerToVote: false,
        sharedChallenge: false,
      })
      .type(UserType.Player)
      .build();

    const invitedBy = Builder<ChallengerData>()
      .challengerName('Lily')
      .challengerAvatar('0')
      .challengerInviteCode('')
      .build();

    return (
      <GlobalStylesProvider>
        <UserContext.Provider
          value={Builder<UserContextType>()
            .user(user)
            .invitedBy(invitedBy)
            .build()}
        >
          <ActionsPage />
        </UserContext.Provider>
      </GlobalStylesProvider>
    );
  },
};

export const LastContributedToCurrentInviter: Story = {
  render: () => {
    const challenger: ChallengerData = {
      challengerName: 'Lily',
      challengerAvatar: '0',
      challengerInviteCode: createId(),
    };

    const user = Builder<User>()
      .contributedTo([challenger])
      .completedActions({
        electionReminders: true,
        registerToVote: false,
        sharedChallenge: false,
      })
      .type(UserType.Player)
      .build();

    return (
      <GlobalStylesProvider>
        <UserContext.Provider
          value={Builder<UserContextType>()
            .user(user)
            .invitedBy(challenger)
            .build()}
        >
          <ActionsPage />
        </UserContext.Provider>
      </GlobalStylesProvider>
    );
  },
};

export const HasCompletedAllActions: Story = {
  render: () => {
    const challenger1: ChallengerData = {
      challengerName: 'Barbara',
      challengerAvatar: '0',
      challengerInviteCode: createId(),
    };

    const challenger2: ChallengerData = {
      challengerName: 'Martin',
      challengerAvatar: '3',
      challengerInviteCode: createId(),
    };

    const challenger3: ChallengerData = {
      challengerName: 'Robert',
      challengerAvatar: '2',
      challengerInviteCode: createId(),
    };

    const user = Builder<User>()
      .contributedTo([challenger1, challenger2, challenger3])
      .completedActions({
        electionReminders: true,
        registerToVote: true,
        sharedChallenge: false,
      })
      .type(UserType.Hybrid)
      .build();

    return (
      <GlobalStylesProvider>
        <UserContext.Provider
          value={Builder<UserContextType>()
            .user(user)
            .invitedBy(challenger3)
            .build()}
        >
          <ActionsPage />
        </UserContext.Provider>
      </GlobalStylesProvider>
    );
  },
};
