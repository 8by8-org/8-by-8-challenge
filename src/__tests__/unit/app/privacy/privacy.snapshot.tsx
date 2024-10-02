import PrivacyPolicyPage from '@/app/privacy/page';
import { render, cleanup } from '@testing-library/react';

describe('PrivacyPolicyPage', () => {
  afterEach(cleanup);

  it('renders the privacy policy page unchanged.', () => {
    const { container } = render(<PrivacyPolicyPage />);
    expect(container).toMatchSnapshot();
  });
});
