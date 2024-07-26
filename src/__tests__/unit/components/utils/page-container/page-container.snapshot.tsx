import '@testing-library/jest-dom';
import { render, cleanup } from '@testing-library/react';
import { PageContainer } from '@/components/utils/page-container';

describe('PageContainer', () => {
  afterEach(cleanup);
  it('renders the PageContainer unchanged.', () => {
    const { container } = render(<PageContainer />);
    expect(container).toMatchSnapshot();
  });
  it('applies the correct min-height style.', () => {
    const { getByTestId } = render(<PageContainer />);
    const pageContainer = getByTestId('page-container');
    const navbarHeight = '57px'; 
    const footerHeight = '60px'; //footer padding 30x top and bottom
    const expectedMinHeight = `calc(100vh - ${navbarHeight} - ${footerHeight})`;

    expect(pageContainer).toHaveStyle(`min-height: ${expectedMinHeight}`);
  });
});
