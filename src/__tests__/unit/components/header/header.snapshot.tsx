import { render, cleanup } from '@testing-library/react';
import { Header } from '@/components/header';
import { UserContext, UserContextType } from '@/contexts/user-context';
import { mockDialogMethods } from '@/utils/test/mock-dialog-methods';
import { AlertsContextProvider } from '@/contexts/alerts-context';

describe('Header', () => {
  mockDialogMethods();
  afterEach(cleanup);

  it('renders the header unchanged', () => {
    const { container } = render(
      <AlertsContextProvider>
        <UserContext.Provider value={{ user: null } as UserContextType}>
          <Header />
        </UserContext.Provider>
      </AlertsContextProvider>,
    );
    expect(container).toMatchSnapshot();
  });
});
