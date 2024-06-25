import ChallengerWelcome from '@/app/challengerwelcome/page';
import '@testing-library/jest-dom';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import mockRouter from 'next-router-mock';

jest.mock('next/navigation', () => require('next-router-mock'));

describe('ChallengerWelcome', () => {
  afterEach(cleanup);
  it('opens the signup page when the first button is clicked', async () => {
    mockRouter.push('/initial-path');
    const user = userEvent.setup();

    render(<ChallengerWelcome />);

    const fgetStartedbtn = screen.getAllByRole('button')[0];
    await user.click(fgetStartedbtn);
    expect(mockRouter).toMatchObject({ asPath: '/signup' });
  });

  it('opens the signup page when the second button is clicked', async () => {
    mockRouter.push('/initial-path');
    const user = userEvent.setup();

    render(<ChallengerWelcome />);

    const sgetStartedbtn = screen.getAllByRole('button')[1];
    await user.click(sgetStartedbtn);
    expect(mockRouter).toMatchObject({ asPath: '/signup' });
  });
});
