import Home from '@/app/page';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import { mockDialogMethods } from '@/utils/test/mock-dialog-methods';
import navigation from 'next/navigation';
import { Builder } from 'builder-pattern';
import { UserContext, type UserContextType } from '@/contexts/user-context';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('Home Page', () => {
  mockDialogMethods();
  let router: AppRouterInstance;
  let user: UserEvent;

  beforeEach(() => {
    user = userEvent.setup();
    router = Builder<AppRouterInstance>()
      .push(jest.fn())
      .prefetch(jest.fn())
      .build();
    jest.spyOn(navigation, 'useRouter').mockImplementation(() => router);
  });

  afterEach(cleanup);

  it('navigates to /challengerwelcome when the challenge button is clicked.', async () => {
    render(
      <UserContext.Provider
        value={Builder<UserContextType>().user(null).build()}
      >
        <Home />
      </UserContext.Provider>,
    );
    const challengeButtons = screen.getAllByRole('button', {
      name: /Take the Challenge/i,
    });
    for (const button of challengeButtons) {
      await user.click(button);
    }
    expect(router.push).toHaveBeenCalledTimes(2);
    expect(router.push).toHaveBeenNthCalledWith(1, '/challengerwelcome');
    expect(router.push).toHaveBeenNthCalledWith(2, '/challengerwelcome');
  });

  it(`navigates to /playerwelcome when the challenge button is clicked if the 
  user has been invited by a challenger.`, async () => {
    render(
      <UserContext.Provider
        value={Builder<UserContextType>()
          .user(null)
          .invitedBy({
            challengerName: '',
            challengerInviteCode: '',
            challengerAvatar: '0',
          })
          .build()}
      >
        <Home />
      </UserContext.Provider>,
    );

    const challengeButtons = screen.getAllByRole('button', {
      name: /take action/i,
    });

    for (const button of challengeButtons) {
      await user.click(button);
    }

    expect(router.push).toHaveBeenCalledTimes(2);
    expect(router.push).toHaveBeenNthCalledWith(1, '/playerwelcome');
    expect(router.push).toHaveBeenNthCalledWith(2, '/playerwelcome');
  });
});
