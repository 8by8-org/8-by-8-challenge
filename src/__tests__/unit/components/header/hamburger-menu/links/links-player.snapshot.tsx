import { render, cleanup } from '@testing-library/react';
import { Builder } from 'builder-pattern';
import { UserContext, UserContextType } from '@/contexts/user-context';
import { AlertsContextProvider } from '@/contexts/alerts-context';
import { Links } from '@/components/header/hamburger-menu/links/links';
import { UserType } from '@/model/enums/user-type';
import {
  HeaderContext,
  type HeaderContextType,
} from '@/components/header/header-context';
import { mockDialogMethods } from '@/utils/test/mock-dialog-methods';
import type { User } from '@/model/types/user';

describe('Links--Player', () => {
  mockDialogMethods();

  afterEach(cleanup);

  it('renders player links unchanged', () => {
    const user = Builder<User>().type(UserType.Player).build();
    const headerCtxValue = Builder<HeaderContextType>().build();

    const { container } = render(
      <AlertsContextProvider>
        <UserContext.Provider value={{ user } as UserContextType}>
          <HeaderContext.Provider value={headerCtxValue}>
            <Links />
          </HeaderContext.Provider>
        </UserContext.Provider>
      </AlertsContextProvider>,
    );

    expect(container).toMatchSnapshot();
  });
});
