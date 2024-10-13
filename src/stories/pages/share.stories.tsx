import { Meta, StoryObj } from '@storybook/react';
import { Share } from '@/app/share/share';
import { useState } from 'react';
import { UserContext, type UserContextType } from '@/contexts/user-context';
import { GlobalStylesProvider } from '../global-styles-provider';
import { AlertsContextProvider } from '@/contexts/alerts-context';
import { Builder } from 'builder-pattern';
import { createId } from '@paralleldrive/cuid2';
import { Footer } from '@/components/footer';
import { UserType } from '@/model/enums/user-type';
import type { User } from '@/model/types/user';
import type { ChallengerData } from '@/model/types/challenger-data';

const meta: Meta<typeof Share> = {
  component: Share,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
};

export default meta;

type Story = StoryObj<typeof Share>;

export const ShowShareButton: Story = {
  render: () => {
    const [user, setUser] = useState(
      Builder<User>()
        .inviteCode(createId())
        .completedActions({
          sharedChallenge: false,
          electionReminders: false,
          registerToVote: false,
        })
        .build(),
    );

    const userContextValue = Builder<UserContextType>()
      .user(user)
      .shareChallenge(() => {
        return new Promise(resolve => {
          setTimeout(() => {
            setUser({
              ...user,
              completedActions: {
                ...user.completedActions,
                sharedChallenge: true,
              },
            });
            resolve();
          }, 1000);
        });
      })
      .build();

    return (
      <GlobalStylesProvider>
        <AlertsContextProvider>
          <UserContext.Provider value={userContextValue}>
            <Share />
            <Footer />
          </UserContext.Provider>
        </AlertsContextProvider>
      </GlobalStylesProvider>
    );
  },
};

export const HideShareButton: Story = {
  render: () => {
    const [user, setUser] = useState(
      Builder<User>()
        .inviteCode(createId())
        .completedActions({
          sharedChallenge: false,
          electionReminders: false,
          registerToVote: false,
        })
        .build(),
    );

    const userContextValue = Builder<UserContextType>()
      .user(user)
      .shareChallenge(() => {
        return new Promise(resolve => {
          setTimeout(() => {
            setUser({
              ...user,
              completedActions: {
                ...user.completedActions,
                sharedChallenge: true,
              },
            });
            resolve();
          }, 1000);
        });
      })
      .build();

    return (
      <GlobalStylesProvider>
        <AlertsContextProvider>
          <UserContext.Provider value={userContextValue}>
            <Share hideShareButton />
            <Footer />
          </UserContext.Provider>
        </AlertsContextProvider>
      </GlobalStylesProvider>
    );
  },
};

export const WonTheChallenge: Story = {
  render: () => {
    const userContextValue = Builder<UserContextType>()
      .user(
        Builder<User>()
          .inviteCode(createId())
          .completedChallenge(true)
          .completedActions({
            sharedChallenge: true,
            electionReminders: true,
            registerToVote: true,
          })
          .build(),
      )
      .shareChallenge(() => {
        return Promise.resolve();
      })
      .build();

    return (
      <GlobalStylesProvider>
        <AlertsContextProvider>
          <UserContext.Provider value={userContextValue}>
            <Share />
            <Footer />
          </UserContext.Provider>
        </AlertsContextProvider>
      </GlobalStylesProvider>
    );
  },
};

export const IsPlayer: Story = {
  render: () => {
    const [user, setUser] = useState(
      Builder<User>()
        .type(UserType.Player)
        .completedActions({
          sharedChallenge: false,
          electionReminders: false,
          registerToVote: false,
        })
        .build(),
    );

    const invitedBy: ChallengerData = {
      challengerName: 'John',
      challengerInviteCode: createId(),
      challengerAvatar: '1',
    };

    const userContextValue = Builder<UserContextType>()
      .user(user)
      .invitedBy(invitedBy)
      .shareChallenge(() => {
        return new Promise(resolve => {
          setTimeout(() => {
            setUser({
              ...user,
              completedActions: {
                ...user.completedActions,
                sharedChallenge: true,
              },
            });
            resolve();
          }, 1000);
        });
      })
      .build();

    return (
      <GlobalStylesProvider>
        <AlertsContextProvider>
          <UserContext.Provider value={userContextValue}>
            <Share />
            <Footer />
          </UserContext.Provider>
        </AlertsContextProvider>
      </GlobalStylesProvider>
    );
  },
};
