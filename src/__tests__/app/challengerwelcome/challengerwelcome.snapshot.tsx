import ChallengerWelcome from '@/app/challengerwelcome/page';
import { cleanup, render } from '@testing-library/react';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('ChallengerWelcome', () => {
  afterEach(cleanup);

  it('renders challenger-welcome page unchanged', () => {
    const { container } = render(<ChallengerWelcome />);
    expect(container).toMatchSnapshot();
  });
});
