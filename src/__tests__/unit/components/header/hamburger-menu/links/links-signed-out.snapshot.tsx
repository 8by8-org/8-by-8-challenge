import { render, cleanup } from '@testing-library/react';
import { Builder } from 'builder-pattern';
import { UserContextType, UserContext } from '@/contexts/user-context';
import { Links } from '@/components/header/hamburger-menu/links/links';
import {
  HeaderContext,
  type HeaderContextType,
} from '@/components/header/header-context';

describe('Links--Signed Out', () => {
  afterEach(cleanup);

  it('renders signed out links unchanged', () => {
    const userCtxValue = Builder<UserContextType>().user(null).build();
    const headerCtxValue = Builder<HeaderContextType>().build();
    const { container } = render(
      <UserContext.Provider value={userCtxValue}>
        <HeaderContext.Provider value={headerCtxValue}>
          <Links />
        </HeaderContext.Provider>
      </UserContext.Provider>,
    );
    expect(container).toMatchSnapshot();
  });
});
