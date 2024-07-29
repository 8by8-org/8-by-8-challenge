import { render, cleanup } from '@testing-library/react';
import Why8by8 from '@/app/why8by8/page';

describe('Why8by8', () => {
  afterEach(cleanup);

  it('renders why8by8 page unchanged', () => {
    const { container } = render(<Why8by8 />);
    expect(container).toMatchSnapshot();
  });
});
