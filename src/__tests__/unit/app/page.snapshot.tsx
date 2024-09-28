import Home from '@/app/page';
import { render, cleanup } from '@testing-library/react';
import { mockDialogMethods } from '@/utils/test/mock-dialog-methods';
import { UserContext, type UserContextType } from '@/contexts/user-context';
import { Builder } from 'builder-pattern';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    prefetch: jest.fn(),
    push: jest.fn(),
  }),
}));

describe('Home', () => {
  mockDialogMethods();
  afterEach(cleanup);

  it('renders homepage unchanged', () => {
    const { container } = render(
      <UserContext.Provider
        value={Builder<UserContextType>().user(null).build()}
      >
        <Home />
      </UserContext.Provider>,
    );
    expect(container).toMatchSnapshot();
  });
});
