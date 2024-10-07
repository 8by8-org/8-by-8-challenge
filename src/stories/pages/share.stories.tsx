import { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { UserContext, type UserContextType } from '@/contexts/user-context';
import { GlobalStylesProvider } from '../global-styles-provider';
import { AlertsContextProvider } from '@/contexts/alerts-context';
import { Builder } from 'builder-pattern';
import { createId } from '@paralleldrive/cuid2';
import { SearchParams } from '@/constants/search-params';
import { Footer } from '@/components/footer';
import type { User } from '@/model/types/user';
import { Share } from '@/app/share/share';

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
            <Share shareLink={'http://localhost:3000/SHARE'} />
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
            <Share shareLink={'http://localhost:3000/SHARE'} hideShareButton />
            <Footer />
          </UserContext.Provider>
        </AlertsContextProvider>
      </GlobalStylesProvider>
    );
  },
};
