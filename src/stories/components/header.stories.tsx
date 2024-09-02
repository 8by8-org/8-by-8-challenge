import { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Header } from '../../components/header';
import {
  UserContext,
  UserContextType,
} from '../../contexts/user-context/user-context';
import { AlertsContextProvider } from '@/contexts/alerts-context';
import { GlobalStylesProvider } from '../global-styles-provider';
import { UserType } from '../../model/enums/user-type';
import type { User } from '../../model/types/user';
import { DateTime } from 'luxon';

const meta: Meta<typeof Header> = {
  component: Header,
};

export default meta;

type Story = StoryObj<typeof Header>;

export const UserIsSignedOut: Story = {
  render: () => (
    <GlobalStylesProvider>
      <AlertsContextProvider>
        <UserContext.Provider
          value={
            {
              user: null,
            } as UserContextType
          }
        >
          <Header />
        </UserContext.Provider>
      </AlertsContextProvider>
    </GlobalStylesProvider>
  ),
};

export const ChallengerIsSignedIn: Story = {
  render: () => {
    const [user, setUser] = useState<User | null>({
      uid: '123',
      email: 'challenger@example.com',
      name: 'Challenger',
      avatar: '0',
      type: UserType.Challenger,
      completedActions: {
        sharedChallenge: false,
        electionReminders: false,
        registerToVote: false,
      },
      badges: [],
      challengeEndTimestamp: DateTime.now().plus({ days: 8 }).toUnixInteger(),
      completedChallenge: false,
      contributedTo: [],
      inviteCode: '',
    });

    return (
      <GlobalStylesProvider>
        <AlertsContextProvider>
          <UserContext.Provider
            value={
              {
                user,
                signOut: () => setUser(null),
              } as UserContextType
            }
          >
            <Header />
          </UserContext.Provider>
        </AlertsContextProvider>
      </GlobalStylesProvider>
    );
  },
};

export const PlayerIsSignedIn: Story = {
  render: () => {
    const [user, setUser] = useState<User | null>({
      uid: '456',
      email: 'player@example.com',
      name: 'Player',
      avatar: '1',
      type: UserType.Player,
      completedActions: {
        sharedChallenge: false,
        electionReminders: false,
        registerToVote: false,
      },
      badges: [],
      challengeEndTimestamp: DateTime.now().plus({ days: 8 }).toUnixInteger(),
      completedChallenge: false,
      invitedBy: {
        inviteCode: '123',
        name: 'Challenger',
        avatar: '0',
      },
      contributedTo: [],
      inviteCode: '',
    });

    return (
      <GlobalStylesProvider>
        <AlertsContextProvider>
          <UserContext.Provider
            value={
              {
                user,
                signOut: () => setUser(null),
              } as UserContextType
            }
          >
            <Header />
          </UserContext.Provider>
        </AlertsContextProvider>
      </GlobalStylesProvider>
    );
  },
};

export const HybridUserIsSignedIn: Story = {
  render: () => {
    const [user, setUser] = useState<User | null>({
      uid: '456',
      email: 'hybrid@example.com',
      name: 'Hybrid',
      avatar: '2',
      type: UserType.Hybrid,
      completedActions: {
        sharedChallenge: false,
        electionReminders: false,
        registerToVote: false,
      },
      badges: [],
      challengeEndTimestamp: DateTime.now().plus({ days: 8 }).toUnixInteger(),
      completedChallenge: false,
      invitedBy: {
        inviteCode: '123',
        name: 'Challenger',
        avatar: '0',
      },
      contributedTo: [],
      inviteCode: '',
    });

    return (
      <GlobalStylesProvider>
        <AlertsContextProvider>
          <UserContext.Provider
            value={
              {
                user,
                signOut: () => setUser(null),
              } as UserContextType
            }
          >
            <Header />
          </UserContext.Provider>
        </AlertsContextProvider>
      </GlobalStylesProvider>
    );
  },
};
