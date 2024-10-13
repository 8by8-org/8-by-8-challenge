import { SignedOutLinks } from '@/components/header/hamburger-menu/links/signed-out-links';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { UserContext, type UserContextType } from '@/contexts/user-context';
import {
  HeaderContext,
  type HeaderContextType,
} from '@/components/header/header-context';
import { Builder } from 'builder-pattern';

describe('SignedOutLinks', () => {
  let user: UserEvent;

  beforeEach(() => {
    user = userEvent.setup();
  });

  afterEach(cleanup);

  it(`displays a link to /challengerwelcome if the user has not been invited by 
  a challenger.`, async () => {
    render(
      <UserContext.Provider
        value={Builder<UserContextType>().user(null).invitedBy(null).build()}
      >
        <HeaderContext.Provider value={Builder<HeaderContextType>().build()}>
          <SignedOutLinks />
        </HeaderContext.Provider>
      </UserContext.Provider>,
    );

    const takeTheChallengeLink = screen.getByText(
      /take the challenge/i,
    ) as HTMLAnchorElement;
    expect(takeTheChallengeLink.href).toContain('/challengerwelcome');
  });

  it(`displays a link to /playerwelcome if the user has been invited by a 
  challenger.`, async () => {
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
        <HeaderContext.Provider value={Builder<HeaderContextType>().build()}>
          <SignedOutLinks />
        </HeaderContext.Provider>
      </UserContext.Provider>,
    );

    const takeActionLink = screen.getByText(
      /take action/i,
    ) as HTMLAnchorElement;
    expect(takeActionLink.href).toContain('/playerwelcome');
  });
});
