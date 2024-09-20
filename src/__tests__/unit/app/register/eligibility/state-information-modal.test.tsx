import { render, screen, cleanup, waitFor } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { useState } from 'react';
import navigation from 'next/navigation';
import { StateInformationModal } from '@/app/register/eligibility/state-information-modal';
import { US_STATE_ABBREVIATIONS } from '@/constants/us-state-abbreviations';
import { VoterRegistrationPathnames } from '@/app/register/constants/voter-registration-pathnames';
import { mockDialogMethods } from '@/utils/test/mock-dialog-methods';
import { Builder } from 'builder-pattern';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('StateInformationModal', () => {
  let user: UserEvent;
  let router: AppRouterInstance;

  function TestComponent({ stateAbbr }: { stateAbbr: string }) {
    const [showModal, setShowModal] = useState(true);

    return (
      <StateInformationModal
        stateAbbr={stateAbbr}
        showModal={showModal}
        setShowModal={setShowModal}
      />
    );
  }

  beforeEach(() => {
    mockDialogMethods();
    user = userEvent.setup();
    router = Builder<AppRouterInstance>().push(jest.fn()).build();
    jest.spyOn(navigation, 'useRouter').mockImplementation(() => router);
  });

  afterEach(cleanup);

  it('closes itself when the close button is clicked.', async () => {
    render(<TestComponent stateAbbr={US_STATE_ABBREVIATIONS.NORTH_DAKOTA} />);
    expect(screen.queryByRole('dialog')).toBeInTheDocument();

    await user.click(screen.getByLabelText(/close dialog/i));
    expect(HTMLDialogElement.prototype.close).toHaveBeenCalled();

    (
      await waitFor(() => expect(screen.queryByRole('dialog')))
    ).not.toBeInTheDocument();
  });

  it('closes itself when the "Nevermind" button is clicked.', async () => {
    render(<TestComponent stateAbbr={US_STATE_ABBREVIATIONS.NORTH_DAKOTA} />);
    expect(screen.queryByRole('dialog')).toBeInTheDocument();

    await user.click(screen.getByText(/nevermind/i));
    expect(HTMLDialogElement.prototype.close).toHaveBeenCalled();

    (
      await waitFor(() => expect(screen.queryByRole('dialog')))
    ).not.toBeInTheDocument();
  });

  it('advances the user to the next page when the "Keep going" button is clicked.', async () => {
    render(<TestComponent stateAbbr={US_STATE_ABBREVIATIONS.NORTH_DAKOTA} />);
    await user.click(screen.getByText(/keep going/i));
    expect(router.push).toHaveBeenCalledWith(VoterRegistrationPathnames.NAMES);
  });
});
