import { render, screen, cleanup, act } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { clearAllPersistentFormElements } from 'fully-formed';
import { OtherDetails } from '@/app/register/other-details/other-details';
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
import type { PoliticalPartiesAndOtherDetails } from '@/model/types/political-parties-and-other-details';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('OtherDetails', () => {
  let router: AppRouterInstance;
  let userContextValue: UserContextType;
  let voterRegistrationForm: InstanceType<typeof VoterRegistrationForm>;
  let otherDetailsForm: InstanceType<typeof OtherDetailsForm>;
  let OtherDetailsWithContext: FunctionComponent<PoliticalPartiesAndOtherDetails>;
  let user: UserEvent;

  const politicalParties = [
    'Democratic',
    'Republican',
    'Green',
    'No Affiliation',
    'Other',
  ];

  const raceOptions = [
    'Asian',
    'Black or African American',
    'Hispanic or Latino',
    'Native American or Alaskan Native',
    'Native Hawaiian or Other Pacific Islander',
    'Other',
    'Two or More Races',
    'White',
    'Decline to state',
  ];

  const idNumberMessage = "Please enter your driver's license number.";

  beforeEach(() => {
    mockDialogMethods();
    mockScrollMethods();

    router = Builder<AppRouterInstance>()
      .push(jest.fn())
      .prefetch(jest.fn())
      .build();

    jest.spyOn(navigation, 'useRouter').mockImplementation(() => router);

    const appUser = Builder<User>()
      .email('user@example.com')
      .completedActions({
        registerToVote: false,
        sharedChallenge: false,
        electionReminders: false,
      })
      .build();

    userContextValue = Builder<UserContextType>()
      .user(appUser)
      .registerToVote(jest.fn())
      .build();

    voterRegistrationForm = new VoterRegistrationForm(appUser);
    otherDetailsForm = voterRegistrationForm.fields.otherDetails;

    OtherDetailsWithContext = function OtherDetailsWithContext(
      props: PoliticalPartiesAndOtherDetails,
    ) {
      return (
        <AlertsContextProvider>
          <UserContext.Provider value={userContextValue}>
            <VoterRegistrationContext.Provider
              value={{
                voterRegistrationForm,
              }}
            >
              <OtherDetails {...props} />
            </VoterRegistrationContext.Provider>
          </UserContext.Provider>
        </AlertsContextProvider>
      );
    };

    user = userEvent.setup();

    render(
      <OtherDetailsWithContext
        politicalParties={politicalParties}
        raceOptions={raceOptions}
        idNumberMessage={idNumberMessage}
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

    act(() => otherDetailsForm.fields.party.setValue('Other'));

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
    act(() => otherDetailsForm.fields.party.setValue('Other'));
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
      document.getElementById(otherDetailsForm.fields.idNumber.id),
    );
    await user.keyboard('1234');
    await user.click(submitButton);

    expect(userContextValue.registerToVote).toHaveBeenCalledWith(
      voterRegistrationForm.state.value,
    );
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
    act(() => otherDetailsForm.fields.idNumber.setValue('1234'));

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
    act(() => otherDetailsForm.fields.idNumber.setValue('1234'));

    await user.click(screen.getByText(/submit/i));

    const alert = await screen.findByRole('alert');
    expect(alert.textContent).toBe('Something went wrong. Please try again.');
  });

  it(`toggles the value of hasStateIssuedLicenseOrID when the user clicks the 
  checkbox.`, async () => {
    expect(otherDetailsForm.fields.hasStateLicenseOrID.state.value).toBe(false);

    const hasStateIssuedLicenseOrID = screen.getByLabelText(
      "I have a state-issued driver's license or ID card",
    );

    await user.click(hasStateIssuedLicenseOrID);
    expect(otherDetailsForm.fields.hasStateLicenseOrID.state.value).toBe(true);

    await user.click(hasStateIssuedLicenseOrID);
    expect(otherDetailsForm.fields.hasStateLicenseOrID.state.value).toBe(false);
  });

  it('toggles the value of receiveEmailsFromRTV when the user clicks the checkbox.', async () => {
    expect(otherDetailsForm.fields.receiveEmailsFromRTV.state.value).toBe(
      false,
    );

    const receiveEmailsFromRTV = screen.getByLabelText(
      "I'd like to receive emails from Rock the Vote",
    );

    await user.click(receiveEmailsFromRTV);
    expect(otherDetailsForm.fields.receiveEmailsFromRTV.state.value).toBe(true);

    await user.click(receiveEmailsFromRTV);
    expect(otherDetailsForm.fields.receiveEmailsFromRTV.state.value).toBe(
      false,
    );
  });

  it('toggles the value of receiveSMSFromRTV when the user clicks the checkbox.', async () => {
    expect(otherDetailsForm.fields.receiveSMSFromRTV.state.value).toBe(false);

    const receiveSMSFromRTV = screen.getByLabelText(
      "I'd like to receive SMS messages from Rock the Vote",
    );
    await user.click(receiveSMSFromRTV);

    expect(otherDetailsForm.fields.receiveSMSFromRTV.state.value).toBe(true);

    await user.click(receiveSMSFromRTV);
    expect(otherDetailsForm.fields.receiveSMSFromRTV.state.value).toBe(false);
  });
});
