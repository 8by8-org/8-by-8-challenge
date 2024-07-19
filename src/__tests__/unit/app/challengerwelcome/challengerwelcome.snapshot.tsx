import ChallengerWelcome from '@/app/challengerwelcome/page';
import { UserContext, type UserContextType } from '@/contexts/user-context';
import { cleanup, render } from '@testing-library/react';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    prefetch: jest.fn(),
    push: jest.fn(),
  }),
}));

describe('ChallengerWelcome', () => {
  afterEach(cleanup);

  it('renders challenger-welcome page unchanged', () => {
    const { container } = render(
      <UserContext.Provider value={{ user: null } as UserContextType}>
        <ChallengerWelcome />
      </UserContext.Provider>,
    );
    expect(container).toMatchSnapshot();
  });
});
