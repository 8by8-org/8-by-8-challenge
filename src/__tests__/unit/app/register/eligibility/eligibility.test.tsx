import { render, screen, cleanup, act } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { clearAllPersistentFormElements } from 'fully-formed';
import { Eligibility } from '@/app/register/eligibility/eligibility';
import { UserContext, type UserContextType } from '@/contexts/user-context';
import { VoterRegistrationContext } from '@/app/register/voter-registration-context';
import { VoterRegistrationForm } from '@/app/register/voter-registration-form';
import { EligibilityForm } from '@/app/register/eligibility/eligibility-form';
import { Builder } from 'builder-pattern';
import { DateTime } from 'luxon';
import navigation from 'next/navigation';
import { mockDialogMethods } from '@/utils/test/mock-dialog-methods';
import { mockScrollMethods } from '@/utils/test/mock-scroll-methods';
import { VoterRegistrationPathnames } from '@/app/register/constants/voter-registration-pathnames';
import { getPreregistrationInfo } from '@/app/register/eligibility/utils/get-preregistration-info';
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

describe('Eligibility', () => {
  let router: AppRouterInstance;
  let voterRegistrationForm: InstanceType<typeof VoterRegistrationForm>;
  let eligibilityForm: InstanceType<typeof EligibilityForm>;
  let EligibilityWithContext: FunctionComponent;
  let user: UserEvent;

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

    voterRegistrationForm = new VoterRegistrationForm(appUser);
    eligibilityForm = voterRegistrationForm.fields.eligibility;

    EligibilityWithContext = function EligibilityWithContext() {
      return (
        <UserContext.Provider
          value={Builder<UserContextType>().user(appUser).build()}
        >
          <VoterRegistrationContext.Provider
            value={{
              voterRegistrationForm,
            }}
          >
            <Eligibility />
          </VoterRegistrationContext.Provider>
        </UserContext.Provider>
      );
    };

    user = userEvent.setup();
    render(<EligibilityWithContext />);
  });

  afterEach(() => {
    cleanup();
    clearAllPersistentFormElements();
  });

  it('focuses on the first invalid field if submitted while invalid.', async () => {
    const getStarted = screen.getByText(/get started/i);
    await user.click(getStarted);

    expect(document.activeElement).toBe(
      document.getElementById(eligibilityForm.fields.zip.id),
    );

    await user.keyboard('94043');
    await user.click(getStarted);
    expect(document.activeElement).toBe(
      document.getElementById(eligibilityForm.fields.dob.id),
    );

    act(() => eligibilityForm.fields.dob.setValue('1990-01-01'));
    await user.click(getStarted);
    expect(document.activeElement).toBe(
      document.getElementById(eligibilityForm.fields.eighteenPlus.id),
    );

    await user.keyboard(' ');
    await user.click(getStarted);
    expect(document.activeElement).toBe(
      document.getElementById(eligibilityForm.fields.isCitizen.id),
    );
  });

  it(`displays a modal with a message about voting in North Dakota if the user 
  is from North Dakota and the form is submitted.`, async () => {
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await user.type(
      document.getElementById(eligibilityForm.fields.zip.id)!,
      '58001',
    );

    act(() => eligibilityForm.fields.dob.setValue('1990-01-01'));

    await user.click(
      document.getElementById(eligibilityForm.fields.eighteenPlus.id)!,
    );

    await user.click(
      document.getElementById(eligibilityForm.fields.isCitizen.id)!,
    );

    await user.click(screen.getByText(/get started/i));

    expect(screen.queryByRole('dialog')).toBeInTheDocument();
    expect(
      screen.queryByText("Hey there! Looks like you're from North Dakota."),
    ).toBeInTheDocument();
  });

  it(`displays a state-specific message about pre-registering to vote if the 
  user is under 18 and the form is submitted.`, async () => {
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await user.type(
      document.getElementById(eligibilityForm.fields.zip.id)!,
      '94043',
    );

    act(() =>
      eligibilityForm.fields.dob.setValue(
        DateTime.now().minus({ years: 16 }).toFormat('yyyy-MM-dd'),
      ),
    );

    await user.click(
      document.getElementById(eligibilityForm.fields.eighteenPlus.id)!,
    );

    await user.click(
      document.getElementById(eligibilityForm.fields.isCitizen.id)!,
    );

    await user.click(screen.getByText(/get started/i));

    expect(screen.queryByRole('dialog')).toBeInTheDocument();

    expect(
      screen.queryByText(/Looks like you're not 18 yet./),
    ).toBeInTheDocument();

    expect(
      screen.queryByText(getPreregistrationInfo('CA')),
    ).toBeInTheDocument();
  });

  it(`advances the user to the next page if all fields are valid and the user 
  is at least 18.`, async () => {
    await user.type(
      document.getElementById(eligibilityForm.fields.zip.id)!,
      '94043',
    );

    act(() =>
      eligibilityForm.fields.dob.setValue(
        DateTime.now().minus({ years: 18 }).toFormat('yyyy-MM-dd'),
      ),
    );

    await user.click(
      document.getElementById(eligibilityForm.fields.eighteenPlus.id)!,
    );

    await user.click(
      document.getElementById(eligibilityForm.fields.isCitizen.id)!,
    );

    await user.click(screen.getByText(/get started/i));
    expect(router.push).toHaveBeenCalledWith(VoterRegistrationPathnames.NAMES);
  });

  it('toggles the value of firstTimeRegistrant when the user clicks the checkbox.', async () => {
    expect(eligibilityForm.fields.firstTimeRegistrant.state.value).toBe(false);

    const firstTimeRegistrant = screen.getByLabelText(
      'This is my first time registering to vote',
    );

    await user.click(firstTimeRegistrant);
    expect(eligibilityForm.fields.firstTimeRegistrant.state.value).toBe(true);

    await user.click(firstTimeRegistrant);
    expect(eligibilityForm.fields.firstTimeRegistrant.state.value).toBe(false);
  });
});
