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
    const navbarHeight = '57px'; // Adjust this 
    const footerHeight = '40px'; // Adjust 
    const expectedMinHeight = `calc(100vh - ${navbarHeight} - ${footerHeight})`;

    console.log('Rendered min-height:', pageContainer.style.minHeight);

    expect(pageContainer).toHaveStyle(`min-height: ${expectedMinHeight}`);
  });
});
