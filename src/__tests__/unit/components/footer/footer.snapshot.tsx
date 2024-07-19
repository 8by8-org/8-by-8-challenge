import '@testing-library/jest-dom';
import { render, cleanup } from '@testing-library/react';
import { Footer } from '@/components/footer';

describe('Footer', () => {
  afterEach(cleanup);
  it('renders the Footer unchanged.', () => {
    const { container } = render(<Footer />);
    expect(container).toMatchSnapshot();
  });
});
