import { Meta, StoryObj } from '@storybook/react';
import { useState, type ReactNode } from 'react';
import ActionsPage from '@/app/actions/page';
import { GlobalStylesProvider } from '../global-styles-provider';
import { UserContext, type UserContextType } from '@/contexts/user-context';
import { AlertsContextProvider } from '@/contexts/alerts-context';
import { Builder } from 'builder-pattern';
import { UserType } from '@/model/enums/user-type';
import { createId } from '@paralleldrive/cuid2';
import type { User } from '@/model/types/user';
import type { ChallengerData } from '@/model/types/challenger-data';

const meta: Meta<typeof ActionsPage> = {
  component: ActionsPage,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
};

export default meta;

type Story = StoryObj<typeof ActionsPage>;

interface MockUserContextProviderProps {
  children?: ReactNode;
  user: User | null;
  invitedBy: ChallengerData;
  forceTakeChallengeToFail?: boolean;
}

function MockUserContextProvider(props: MockUserContextProviderProps) {
  const [user, setUser] = useState(props.user);

  const takeTheChallenge = async () => {
    if (!user || user.type !== UserType.Player) return;

    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (props.forceTakeChallengeToFail) {
          reject(new Error('Failed to take the challenge.'));
        } else if (user) {
          const updatedContributedTo = [
            ...user.contributedTo.filter(
              challenderData =>
                challenderData.challengerInviteCode !==
                props.invitedBy.challengerInviteCode,
            ),
            props.invitedBy,
          ];

          setUser({
            ...user,
            type: UserType.Hybrid,
            contributedTo: updatedContributedTo,
          });

          resolve();
        } else {
          resolve();
        }
      }, 3000);
    });
  };

  return (
    <UserContext.Provider
      value={Builder<UserContextType>()
        .user(user)
        .invitedBy(props.invitedBy)
        .takeTheChallenge(takeTheChallenge)
        .build()}
    >
      {props.children}
    </UserContext.Provider>
  );
}

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
        <AlertsContextProvider>
          <MockUserContextProvider user={user} invitedBy={invitedBy}>
            <ActionsPage />
          </MockUserContextProvider>
        </AlertsContextProvider>
      </GlobalStylesProvider>
    );
  },
};

export const LastContributedToIsCurrentInviter: Story = {
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
        <AlertsContextProvider>
          <MockUserContextProvider user={user} invitedBy={challenger}>
            <ActionsPage />
          </MockUserContextProvider>
        </AlertsContextProvider>
      </GlobalStylesProvider>
    );
  },
};

export const LastContributedToIsNotCurrentInviter: Story = {
  render: () => {
    const challenger1: ChallengerData = {
      challengerName: 'Marcellus',
      challengerAvatar: '3',
      challengerInviteCode: createId(),
    };

    const challenger2: ChallengerData = {
      challengerName: 'Robert',
      challengerAvatar: '3',
      challengerInviteCode: createId(),
    };

    const user = Builder<User>()
      .contributedTo([challenger1])
      .completedActions({
        electionReminders: false,
        registerToVote: false,
        sharedChallenge: false,
      })
      .type(UserType.Hybrid)
      .build();

    return (
      <GlobalStylesProvider>
        <AlertsContextProvider>
          <MockUserContextProvider user={user} invitedBy={challenger2}>
            <ActionsPage />
          </MockUserContextProvider>
        </AlertsContextProvider>
      </GlobalStylesProvider>
    );
  },
};

export const RegisteredAndGotReminders: Story = {
  render: () => {
    const challenger1: ChallengerData = {
      challengerName: 'Barbara',
      challengerAvatar: '0',
      challengerInviteCode: createId(),
    };

    const challenger2: ChallengerData = {
      challengerName: 'Robert',
      challengerAvatar: '2',
      challengerInviteCode: createId(),
    };

    const user = Builder<User>()
      .contributedTo([challenger1, challenger2])
      .completedActions({
        electionReminders: true,
        registerToVote: true,
        sharedChallenge: false,
      })
      .type(UserType.Player)
      .build();

    return (
      <GlobalStylesProvider>
        <AlertsContextProvider>
          <MockUserContextProvider user={user} invitedBy={challenger2}>
            <ActionsPage />
          </MockUserContextProvider>
        </AlertsContextProvider>
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
        <AlertsContextProvider>
          <MockUserContextProvider user={user} invitedBy={challenger3}>
            <ActionsPage />
          </MockUserContextProvider>
        </AlertsContextProvider>
      </GlobalStylesProvider>
    );
  },
};

export const TakingTheChallengeFails: Story = {
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
        <AlertsContextProvider>
          <MockUserContextProvider
            user={user}
            invitedBy={invitedBy}
            forceTakeChallengeToFail
          >
            <ActionsPage />
          </MockUserContextProvider>
        </AlertsContextProvider>
      </GlobalStylesProvider>
    );
  },
};
