import { render, cleanup } from '@testing-library/react';
import { Builder } from 'builder-pattern';
import { UserContext, UserContextType } from '@/contexts/user-context';
import { Links } from '@/components/header/hamburger-menu/links/links';
import { UserType } from '@/model/enums/user-type';
import {
  HeaderContext,
  type HeaderContextType,
} from '@/components/header/header-context';
import type { User } from '@/model/types/user';

describe('Links--Challenger', () => {
  afterEach(cleanup);

  it('renders challenger links unchanged', () => {
    const user = Builder<User>().type(UserType.Challenger).build();
    const headerCtxValue = Builder<HeaderContextType>().build();
    const { container } = render(
      <UserContext.Provider value={{ user } as UserContextType}>
        <HeaderContext.Provider value={headerCtxValue}>
          <Links />
        </HeaderContext.Provider>
      </UserContext.Provider>,
    );
    expect(container).toMatchSnapshot();
  });
});
