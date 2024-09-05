import { render, screen, cleanup, act } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { clearAllPersistentFormElements } from 'fully-formed';
import {
  OtherDetails,
  type OtherDetailsProps,
} from '@/app/register/other-details/other-details';
import { AlertsContextProvider } from '@/contexts/alerts-context';
import { UserContext, type UserContextType } from '@/contexts/user-context';
import { VoterRegistrationContext } from '@/app/register/voter-registration-context';
import { VoterRegistrationForm } from '@/app/register/voter-registration-form';
import { OtherDetailsForm } from '@/app/register/other-details/other-details-form';
import { Builder } from 'builder-pattern';
import navigation from 'next/navigation';
import { mockDialogMethods } from '@/utils/test/mock-dialog-methods';
import { mockScrollMethods } from '@/utils/test/mock-scroll-methods';
import { PromiseScheduler } from '@/utils/test/promise-scheduler';
import type { User } from '@/model/types/user';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import type { FunctionComponent } from 'react';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock(
  '../../../../../../src/app/register/addresses/utils/validate-addresses',
  () => ({
    __esModule: true,
    ...jest.requireActual(
      '../../../../../../src/app/register/addresses/utils/validate-addresses',
    ),
  }),
);

describe('OtherDetails', () => {
  let router: AppRouterInstance;
  let userContextValue: UserContextType;
  let voterRegistrationForm: InstanceType<typeof VoterRegistrationForm>;
  let otherDetailsForm: InstanceType<typeof OtherDetailsForm>;
  let OtherDetailsWithContext: FunctionComponent<OtherDetailsProps>;
  let user: UserEvent;

  const politicalParties = [
    'Democratic',
    'Republican',
    'Green',
    'No Affiliation',
  ];

  beforeEach(() => {
    mockDialogMethods();
    mockScrollMethods();

    router = Builder<AppRouterInstance>()
      .push(jest.fn())
      .prefetch(jest.fn())
      .build();

    jest.spyOn(navigation, 'useRouter').mockImplementation(() => router);

    userContextValue = Builder<UserContextType>()
      .registerToVote(jest.fn())
      .build();

    voterRegistrationForm = new VoterRegistrationForm(
      Builder<User>().email('user@example.com').build(),
    );

    otherDetailsForm = voterRegistrationForm.fields.otherDetails;

    OtherDetailsWithContext = function OtherDetailsWithContext({
      ballotQualifiedPoliticalParties,
    }: OtherDetailsProps) {
      return (
        <AlertsContextProvider>
          <UserContext.Provider value={userContextValue}>
            <VoterRegistrationContext.Provider
              value={{
                voterRegistrationForm,
              }}
            >
              <OtherDetails
                ballotQualifiedPoliticalParties={
                  ballotQualifiedPoliticalParties
                }
              />
            </VoterRegistrationContext.Provider>
          </UserContext.Provider>
        </AlertsContextProvider>
      );
    };

    user = userEvent.setup();

    render(
      <OtherDetailsWithContext
        ballotQualifiedPoliticalParties={politicalParties}
      />,
    );
  });

  afterEach(() => {
    cleanup();
    clearAllPersistentFormElements();
  });

  it(`renders a select component with a list of the political parties it 
  received as a prop.`, async () => {
    for (const party of politicalParties) {
      expect(screen.queryAllByText(party).length).toBeGreaterThan(0);
    }
  });

  it(`displays an input for the user to type in their political party when
  "Other" has been selected from the dropdown.`, async () => {
    const labelTextPattern = /if other, please specify\*/i;

    expect(screen.queryByLabelText(labelTextPattern)).not.toBeInTheDocument();

    act(() => otherDetailsForm.fields.party.setValue('other'));

    const other = await screen.findByLabelText(labelTextPattern);
    expect(other).toBeInTheDocument();
  });

  it(`focuses on the first non-valid field when the user submits the form while
  it is not valid and calls the registerToVote method of the user context when 
  submitted while valid.`, async () => {
    const submitButton = screen.getByText(/submit/i);
    await user.click(submitButton);

    expect(document.activeElement).toBe(
      document.getElementById(otherDetailsForm.fields.party.id),
    );
    act(() => otherDetailsForm.fields.party.setValue('other'));
    await user.click(submitButton);

    expect(document.activeElement).toBe(
      document.getElementById(otherDetailsForm.fields.otherParty.id),
    );
    await user.keyboard('Some other party');
    await user.click(submitButton);

    expect(document.activeElement).toBe(
      document.getElementById(otherDetailsForm.fields.race.id),
    );
    act(() => otherDetailsForm.fields.race.setValue('Decline to state'));
    await user.click(submitButton);

    expect(document.activeElement).toBe(
      document.getElementById(otherDetailsForm.fields.id.id),
    );
    await user.keyboard('1234');
    await user.click(submitButton);

    expect(userContextValue.registerToVote).toHaveBeenCalledWith(
      voterRegistrationForm.state.value,
    );
  });

  it('toggles the value of changedParties when the user clicks the checkbox.', async () => {
    expect(otherDetailsForm.fields.changedParties.state.value).toBe(false);

    const changedParties = screen.getByLabelText(
      "I've changed political parties",
    );
    await user.click(changedParties);

    expect(otherDetailsForm.fields.changedParties.state.value).toBe(true);

    await user.click(changedParties);
    expect(otherDetailsForm.fields.changedParties.state.value).toBe(false);
  });

  it('cannot be submitted if it is loading.', async () => {
    const promiseScheduler = new PromiseScheduler();
    const spy = jest
      .spyOn(userContextValue, 'registerToVote')
      .mockImplementation(() => {
        return promiseScheduler.createScheduledPromise<void>(undefined);
      });

    act(() => otherDetailsForm.fields.party.setValue('No affiliation'));
    act(() => otherDetailsForm.fields.race.setValue('Decline to state'));
    act(() => otherDetailsForm.fields.id.setValue('1234'));

    for (let i = 0; i < 5; i++) {
      await user.click(screen.getByText(/submit/i));
    }

    expect(userContextValue.registerToVote).toHaveBeenCalledTimes(1);
    spy.mockRestore();
  });

  it('displays an error message if submission fails.', async () => {
    const spy = jest
      .spyOn(userContextValue, 'registerToVote')
      .mockImplementation(() => {
        throw new Error('Something went wrong while registering to vote.');
      });

    act(() => otherDetailsForm.fields.party.setValue('No affiliation'));
    act(() => otherDetailsForm.fields.race.setValue('Decline to state'));
    act(() => otherDetailsForm.fields.id.setValue('1234'));

    await user.click(screen.getByText(/submit/i));

    const alert = await screen.findByRole('alert');
    expect(alert.textContent).toBe('Something went wrong. Please try again.');
  });
});
