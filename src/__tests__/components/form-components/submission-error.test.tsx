import { render, screen, cleanup } from '@testing-library/react';
import { Alert } from '@/components/utils/alert';

describe('SubmissionError', () => {
  afterEach(cleanup);

  it(`renders an alert which contains the provided text.`, () => {
    const errorMessage = 'Oops. Something went wrong.';

    render(<Alert text={errorMessage} />);

    const alert = screen.getByRole('alert');
    expect(alert.textContent).toBe(errorMessage);
  });
});
