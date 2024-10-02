import Page from '@/app/playerwelcome/page';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { UserContext, UserContextType } from '@/contexts/user-context';
import { Builder } from 'builder-pattern';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import navigation from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('PlayerWelcome', () => {
  let router: AppRouterInstance;
  let user: UserEvent;

  beforeEach(() => {
    router = Builder<AppRouterInstance>()
      .push(jest.fn())
      .prefetch(jest.fn())
      .build();
    jest.spyOn(navigation, 'useRouter').mockImplementation(() => router);

    user = userEvent.setup();
  });

  afterEach(cleanup);

  it("renders text including the challenger's name.", () => {
    const challengerName = 'John Smith';

    render(
      <UserContext.Provider
        value={Builder<UserContextType>()
          .user(null)
          .invitedBy({
            challengerName,
            challengerAvatar: '2',
            challengerInviteCode: '',
          })
          .build()}
      >
        <Page />
      </UserContext.Provider>,
    );

    expect(
      screen.queryByText(
        `Help ${challengerName} win their 8by8 Challenge by registering to vote or taking other actions to #stopasianhate!`,
      ),
    ).toBeInTheDocument();
  });

  it('calls router.push(/signup) when the user presses the Get Started buttons.', async () => {
    render(
      <UserContext.Provider
        value={Builder<UserContextType>()
          .user(null)
          .invitedBy({
            challengerName: 'John Smith',
            challengerAvatar: '2',
            challengerInviteCode: '',
          })
          .build()}
      >
        <Page />
      </UserContext.Provider>,
    );

    const buttons = screen.getAllByText(/^Get Started$/i);
    for (const button of buttons) {
      await user.click(button);
      expect(router.push).toHaveBeenLastCalledWith('/signup');
    }
  });
});
