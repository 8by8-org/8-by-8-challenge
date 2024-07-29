import '@testing-library/jest-dom';
import { render, cleanup, screen, act } from '@testing-library/react';
import { ConfettiAnimation } from '@/components/utils/confetti-animation';

describe('ConfettiAnimation', () => {
  afterEach(cleanup);

  it('renders a confetti animation component', () => {
    render(<ConfettiAnimation time={100} />);
    const confettiAnimation = screen.getByTestId('confetti');
    expect(confettiAnimation).toBeInTheDocument();
  });

  it('invokes setDimensions on render.', () => {
    window.innerWidth = 1000;
    render(<ConfettiAnimation time={100} />);
    act(() => {
      const resizeEvent = new Event('resize');
      window.dispatchEvent(resizeEvent);
    });
    const confettiAnimation = screen.getByTestId('confetti');
    expect(confettiAnimation).toHaveAttribute('width', '1000');
  });
});
