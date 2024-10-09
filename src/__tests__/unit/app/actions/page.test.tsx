import ActionsPage from '@/app/actions/page';
import { render, cleanup } from '@testing-library/react';
import { AlertsContextProvider } from '@/contexts/alerts-context';
import { UserContext, type UserContextType } from '@/contexts/user-context';
import { UserType } from '@/model/enums/user-type';
import { Builder } from 'builder-pattern';
import { mockDialogMethods } from '@/utils/test/mock-dialog-methods';
import navigation from 'next/navigation';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import type { User } from '@/model/types/user';
import type { ChallengerData } from '@/model/types/challenger-data';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('ActionsPage', () => {
  let router: AppRouterInstance;

  beforeEach(() => {
    mockDialogMethods();

    router = Builder<AppRouterInstance>()
      .push(jest.fn())
      .prefetch(jest.fn())
      .build();
    jest.spyOn(navigation, 'useRouter').mockImplementation(() => router);
  });
  afterEach(cleanup);

  it('renders', () => {
    const challenger: ChallengerData = {
      challengerName: 'Challenger',
      challengerAvatar: '0',
      challengerInviteCode: '',
    };

    const user = Builder<User>()
      .type(UserType.Player)
      .completedActions({
        registerToVote: false,
        electionReminders: false,
        sharedChallenge: false,
      })
      .contributedTo([challenger])
      .build();

    render(
      <AlertsContextProvider>
        <UserContext.Provider
          value={Builder<UserContextType>()
            .user(user)
            .invitedBy(challenger)
            .takeTheChallenge(jest.fn())
            .build()}
        >
          <ActionsPage />
        </UserContext.Provider>
      </AlertsContextProvider>,
    );
  });
});
