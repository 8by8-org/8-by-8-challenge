import { render, cleanup } from '@testing-library/react';
import ErrorPage from '@/app/error';

describe('ErrorPage', () => {
  afterEach(cleanup);

  it('renders the ErrorPage unchange.', () => {
    const { container } = render(<ErrorPage />);
    expect(container).toMatchSnapshot();
  });
});
