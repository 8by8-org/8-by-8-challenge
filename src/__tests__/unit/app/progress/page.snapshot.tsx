import { render, cleanup } from '@testing-library/react';
import { mockDialogMethods } from '@/utils/test/mock-dialog-methods';
import Progress from '@/app/progress/page';
import { UserType } from '@/model/enums/user-type';
import { UserContext, UserContextType } from '@/contexts/user-context';
import type { User } from '@/model/types/user';
import { DateTime } from 'luxon';

jest.mock('next/navigation', () => require('next-router-mock'));

describe('Progress', () => {
  mockDialogMethods();
  afterEach(cleanup);

  it('renders progress page unchanged', () => {
    const user: User = {
      uid: '123',
      email: 'challenger1@example.com',
      name: 'Challenger1',
      avatar: '1',
      type: UserType.Challenger,
      completedActions: {
        sharedChallenge: false,
        electionReminders: false,
        registerToVote: false,
      },
      badges: [],
      challengeEndTimestamp: DateTime.fromFormat(
        '12-31-2025',
        'MM-dd-yyyy',
      ).toUnixInteger(),
      completedChallenge: false,
      contributedTo: [],
      inviteCode: '',
    };

    const { container } = render(
      <UserContext.Provider value={{ user } as UserContextType}>
        <Progress />
      </UserContext.Provider>,
    );
    expect(container).toMatchSnapshot();
  });
});
