import '@testing-library/jest-dom';
import { render, cleanup } from '@testing-library/react';
import { LoadingWheel } from '@/components/utils/loading-wheel';

describe('LoadingWheel', () => {
  afterEach(cleanup);

  it('renders the Spinner unchanged.', () => {
    const { container } = render(<LoadingWheel />);
    expect(container).toMatchSnapshot();
  });
});
