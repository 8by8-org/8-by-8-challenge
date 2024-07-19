import '@testing-library/jest-dom';
import { render, cleanup } from '@testing-library/react';
import { PageContainer } from '@/components/utils/page-container';

describe('PageContainer', () => {
  afterEach(cleanup);
  it('renders the PageContainer unchanged.', () => {
    const { container } = render(<PageContainer />);
    expect(container).toMatchSnapshot();
  });
});
