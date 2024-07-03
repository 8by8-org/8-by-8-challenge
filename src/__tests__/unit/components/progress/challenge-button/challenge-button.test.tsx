import '@testing-library/jest-dom';
import { render, cleanup, screen, fireEvent } from '@testing-library/react';
import { ChallengeButton } from '@/components/progress/challenge-button';
import type { User } from '@/model/types/user';
import { Dispatch, RefObject, SetStateAction } from 'react';

describe('ChallengeComplete', () => {
  let toggleInvite: RefObject<() => null>;
  let restartChallenge: () => null;
  let setOpenModal: Dispatch<SetStateAction<boolean>>;

  beforeEach(() => {
    toggleInvite = { current: jest.fn() };
    restartChallenge = jest.fn();
    setOpenModal = jest.fn();
  });

  afterEach(cleanup);

  it('renders a Invite friends button as default invokes toggleInvite when clicked.', () => {
    const user: User = { completedChallenge: false } as User;
    const daysLeft = 2;
    render(
      <ChallengeButton
        user={user}
        daysLeft={daysLeft}
        toggleInvite={toggleInvite}
        restartChallenge={restartChallenge}
        setOpenModal={setOpenModal}
      />,
    );

    expect(screen.getByText('Invite friends')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Invite friends'));
    expect(toggleInvite.current).toHaveBeenCalled();
  });

  it('renders a Share button when challenge is completed and invokes toggleInvite when clicked.', () => {
    const user: User = { completedChallenge: true } as User;
    const daysLeft = 0;
    render(
      <ChallengeButton
        user={user}
        daysLeft={daysLeft}
        toggleInvite={toggleInvite}
        restartChallenge={restartChallenge}
        setOpenModal={setOpenModal}
      />,
    );

    expect(screen.getByText('Share')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Share'));
    expect(toggleInvite.current).toHaveBeenCalled();
  });

  it('renders a Restart Challenge button when challenge is not completed and daysLeft is 0.', () => {
    const user: User = { completedChallenge: false } as User;
    const daysLeft = 0;
    render(
      <ChallengeButton
        user={user}
        daysLeft={daysLeft}
        toggleInvite={toggleInvite}
        restartChallenge={restartChallenge}
        setOpenModal={setOpenModal}
      />,
    );

    expect(screen.getByText('Restart Challenge')).toBeInTheDocument();
  });

  it('invokes restartChallenge, and setOpenModal when Restart Challenge button is clicked.', () => {
    const user: User = { completedChallenge: false } as User;
    const daysLeft = 0;
    render(
      <ChallengeButton
        user={user}
        daysLeft={daysLeft}
        toggleInvite={toggleInvite}
        restartChallenge={restartChallenge}
        setOpenModal={setOpenModal}
      />,
    );

    fireEvent.click(screen.getByText('Restart Challenge'));
    expect(restartChallenge).toHaveBeenCalled();
    expect(setOpenModal).toHaveBeenCalled();
  });

  it('sets button to an Invite friends button when Restart Challenge button is clicked and invokes toggleInvite when Invite friends button is clicked.', () => {
    const user: User = { completedChallenge: false } as User;
    const daysLeft = 0;
    render(
      <ChallengeButton
        user={user}
        daysLeft={daysLeft}
        toggleInvite={toggleInvite}
        restartChallenge={restartChallenge}
        setOpenModal={setOpenModal}
      />,
    );

    fireEvent.click(screen.getByText('Restart Challenge'));
    expect(screen.getByText('Invite friends')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Invite friends'));
    expect(toggleInvite.current).toHaveBeenCalled();
  });
});
