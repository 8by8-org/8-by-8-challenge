import '@testing-library/jest-dom';
import { render, screen, cleanup } from '@testing-library/react';
import { Builder } from 'builder-pattern';
import { UserContext, type UserContextType } from '@/contexts/user-context';
import { Greeting } from '@/components/header/hamburger-menu/greeting';
import type { User } from '@/model/types/user';

describe('Greeting', () => {
  afterEach(cleanup);
  it('Displays "Hi there!" when activeUser is null.', () => {
    const userCtxValue = Builder<UserContextType>().user(null).build();
    render(
      <UserContext.Provider value={userCtxValue}>
        <Greeting />
      </UserContext.Provider>,
    );
    const greeting = screen.queryByText('Hi there!');
    expect(greeting).toBeInTheDocument();
  });

  it("Displays the user's name when activeUser is not null.", () => {
    const user = Builder<User>().name('Test').build();
    const userCtxValue = Builder<UserContextType>().user(user).build();
    render(
      <UserContext.Provider value={userCtxValue}>
        <Greeting />
      </UserContext.Provider>,
    );
    const greeting = screen.queryByText(`Hi ${user.name}!`);
    expect(greeting).toBeInTheDocument();
  });

  it("Displays the user's avatar.", () => {
    const user = Builder<User>().name('Test').avatar(4).build();
    const userCtxValue = Builder<UserContextType>().user(user).build();
    render(
      <UserContext.Provider value={userCtxValue}>
        <Greeting />
      </UserContext.Provider>,
    );
    const avatar = screen.getByAltText('user avatar');
    expect(avatar).toHaveAttribute(
      'src',
      `/static/images/shared/avatars/avatar-${user.avatar}.svg`,
    );
  });
});
