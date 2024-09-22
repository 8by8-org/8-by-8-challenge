import RemindersPage from '@/app/reminders/page';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { UserContext, type UserContextType } from '@/contexts/user-context';
import { AlertsContextProvider } from '@/contexts/alerts-context';
import { Builder } from 'builder-pattern';
import type { User } from '@/model/types/user';

jest.mock('next/navigation', () => require('next-router-mock'));

describe('RemindersPage', () => {
  afterEach(cleanup);

  it('renders.', () => {
    const user = Builder<User>()
      .completedActions({
        electionReminders: false,
        registerToVote: false,
        sharedChallenge: false,
      })
      .build();

    const userContextValue = Builder<UserContextType>()
      .user(user)
      .gotElectionReminders(() => Promise.resolve())
      .build();

    render(
      <AlertsContextProvider>
        <UserContext.Provider value={userContextValue}>
          <RemindersPage />
        </UserContext.Provider>
      </AlertsContextProvider>,
    );
  });
});
