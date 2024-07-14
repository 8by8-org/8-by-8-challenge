import { Meta, StoryObj } from '@storybook/react';
import Progress from '@/app/progress/page';
import {
  UserContext,
  UserContextType,
} from '../../contexts/user-context/user-context';
import { UserType } from '../../model/enums/user-type';
import type { User } from '../../model/types/user';
import { GlobalStylesProvider } from '../global-styles-provider';
import { DateTime } from 'luxon';
import { Actions } from '@/model/enums/actions';

const meta: Meta<typeof Progress> = {
  component: Progress,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
};

export default meta;

type Story = StoryObj<typeof Progress>;

export const DaysLeftChallenge: Story = {
  render: () => {
    const user: User = {
      uid: '123',
      email: 'challenger1@example.com',
      name: 'Challenger1',
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
    };
    return (
      <GlobalStylesProvider>
        <UserContext.Provider value={{ user } as UserContextType}>
          <Progress />
        </UserContext.Provider>
      </GlobalStylesProvider>
    );
  },
};

export const NoDaysLeftChallenge: Story = {
  render: () => {
    const user: User = {
      uid: '456',
      email: 'challenger2@example.com',
      name: 'Challenger2',
      avatar: '1',
      type: UserType.Challenger,
      completedActions: {
        sharedChallenge: true,
        electionReminders: false,
        registerToVote: true,
      },
      badges: [
        { action: Actions.VoterRegistration },
        { action: Actions.SharedChallenge },
        { playerName: 'Player', playerAvatar: '0' },
      ],
      challengeEndTimestamp: DateTime.now().toUnixInteger(),
      completedChallenge: false,
      contributedTo: [],
      inviteCode: '',
    };
    return (
      <GlobalStylesProvider>
        <UserContext.Provider value={{ user } as UserContextType}>
          <Progress />
        </UserContext.Provider>
      </GlobalStylesProvider>
    );
  },
};

export const CompletedChallenge: Story = {
  render: () => {
    const user: User = {
      uid: '789',
      email: 'challenger3@example.com',
      name: 'Challenger3',
      avatar: '2',
      type: UserType.Challenger,
      completedActions: {
        sharedChallenge: true,
        electionReminders: true,
        registerToVote: true,
      },
      badges: [
        { action: Actions.VoterRegistration },
        { action: Actions.SharedChallenge },
        { playerName: 'Player1', playerAvatar: '0' },
        { playerName: 'Player2', playerAvatar: '1' },
        { playerName: 'Player3', playerAvatar: '2' },
        { playerName: 'Player4', playerAvatar: '3' },
        { playerName: 'Player5', playerAvatar: '0' },
        { playerName: 'Player6', playerAvatar: '1' },
      ],
      challengeEndTimestamp: DateTime.now().toUnixInteger(),
      completedChallenge: true,
      contributedTo: [],
      inviteCode: '',
    };
    return (
      <GlobalStylesProvider>
        <UserContext.Provider value={{ user } as UserContextType}>
          <Progress />
        </UserContext.Provider>
      </GlobalStylesProvider>
    );
  },
};
