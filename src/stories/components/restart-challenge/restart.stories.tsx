import { Meta, StoryObj } from '@storybook/react';
import { GlobalStylesProvider } from '@/stories/global-styles-provider';
import { RestartChallengeModal } from '@/contexts/user-context/restart-challenge-modal';
import { Builder } from 'builder-pattern';
import { UserContext, type UserContextType } from '@/contexts/user-context';
import type { User } from '@/model/types/user';
import { PropsWithChildren, useState } from 'react';
import { time } from 'console';
import { promise } from 'zod';
import { DateTime } from 'luxon';
import {
  AlertsContext,
  AlertsContextProvider,
} from '@/contexts/alerts-context';
const meta: Meta<typeof RestartChallengeModal> = {
  component: RestartChallengeModal,
};

export default meta;

type Story = StoryObj<typeof RestartChallengeModal>;

const createUserContext = () => {
  const user: User = Builder<User>().uid('1').challengeEndTimestamp(0).build();
};
function UserContextProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User>(
    Builder<User>().uid('1').challengeEndTimestamp(0).build(),
  );
  const restartChallenge = async () => {
    return new Promise<void>(resolve => {
      setTimeout(() => {
        setUser(
          Builder<User>()
            .uid('1')
            .challengeEndTimestamp(DateTime.now().plus({ days: 8 }).toMillis())
            .build(),
        );
        resolve();
      }, 3000);
    });
  };
  return (
    <AlertsContextProvider>
      <UserContext.Provider
        value={Builder<UserContextType>()
          .user(user)
          .restartChallenge(restartChallenge)
          .build()}
      >
        {children}
      </UserContext.Provider>
    </AlertsContextProvider>
  );
}
export const RestartChallenge: Story = {
  render: () => {
    return (
      <GlobalStylesProvider>
        <UserContextProvider>
          <RestartChallengeModal />
        </UserContextProvider>
      </GlobalStylesProvider>
    );
  },
};
