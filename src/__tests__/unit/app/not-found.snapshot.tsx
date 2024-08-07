import { render, cleanup } from '@testing-library/react';
import NotFound from '@/app/not-found';

describe('Not Found', () => {
    afterEach(cleanup);

    it('renders 404 page', () => {
        const { container } = render(<NotFound />);
        expect(container).toMatchSnapshot();
    });
});
