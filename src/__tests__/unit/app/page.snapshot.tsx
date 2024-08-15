import { render, screen, cleanup } from '@testing-library/react';
import { mockDialogMethods } from '@/utils/test/mock-dialog-methods';
import Home from '@/app/page';

// describe('Home', () => {
describe('Home Page - Take the Challenge Button', () => {
  mockDialogMethods();
  afterEach(cleanup);

 // it('renders homepage unchanged', () => {
  it('renders the "Take the Challenge" button unchanged', () => {
    const { container } = render(<Home />);
    const challengeButton = screen.getByRole('button', { name: /Take the Challenge/i });
    expect(challengeButton).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});
