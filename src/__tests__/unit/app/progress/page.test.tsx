import { render, cleanup, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { mockDialogMethods } from '@/utils/test/mock-dialog-methods';
import Progress from '@/app/progress/page';
import { UserType } from '@/model/enums/user-type';
import { UserContext, UserContextType } from '@/contexts/user-context';
import type { User } from '@/model/types/user';
import { DateTime } from 'luxon';
import { Actions } from '@/model/enums/actions';
import userEvent from '@testing-library/user-event';
import { getErrorThrownByComponent } from '@/utils/test/get-error-thrown-by-component';

jest.mock('next/navigation', () => require('next-router-mock'));

describe('ProgressTest', () => {
  mockDialogMethods();
  afterEach(cleanup);

  let appUser: User = {
    uid: '456',
    email: 'challenger2@example.com',
    name: 'Challenger2',
    avatar: '2',
    type: UserType.Challenger,
    completedActions: {
      sharedChallenge: true,
      electionReminders: false,
      registerToVote: false,
    },
    badges: [
      { action: Actions.SharedChallenge },
      { playerName: 'Player', playerAvatar: '1' },
    ],
    challengeEndTimestamp: DateTime.now().toUnixInteger(),
    completedChallenge: true,
    contributedTo: [],
    inviteCode: '',
  };

  it('tests for Modal close.', async () => {
    appUser.challengeEndTimestamp = DateTime.now().toUnixInteger();

    const user = userEvent.setup();
    render(
      <UserContext.Provider value={{ user: appUser } as UserContextType}>
        <Progress />
      </UserContext.Provider>,
    );

    expect(screen.getByText(/Oops, times up/i)).toBeInTheDocument();

    const closeBtn = screen.getByLabelText('close dialog');
    await user.click(closeBtn);
    await waitFor(() =>
      expect(HTMLDialogElement.prototype.close).toHaveBeenCalled(),
    );
  });

  it('renders user when all badges are completed.', () => {
    for (let i = 2; i < 8; i++) {
      appUser.badges[i] = { playerName: `test${i}`, playerAvatar: '1' };
    }

    render(
      <UserContext.Provider value={{ user: appUser } as UserContextType}>
        <Progress />
      </UserContext.Provider>,
    );

    expect(screen.getByText(/You completed all/i)).toBeInTheDocument();
  });

  it('renders without error if user is null.', () => {
    const error = getErrorThrownByComponent(
      <UserContext.Provider value={{ user: null } as UserContextType}>
        <Progress />
      </UserContext.Provider>,
    );
    expect(error).toBe(null);
  });
});
