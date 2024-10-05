import { render, screen, cleanup, act } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import { clearAllPersistentFormElements } from 'fully-formed';
import { Names } from '@/app/register/names/names';
import { UserContext, type UserContextType } from '@/contexts/user-context';
import { VoterRegistrationContext } from '@/app/register/voter-registration-context';
import { VoterRegistrationForm } from '@/app/register/voter-registration-form';
import { YourNameForm } from '@/app/register/names/your-name/your-name-form';
import { PreviousNameForm } from '@/app/register/names/previous-name/previous-name-form';
import { Builder } from 'builder-pattern';
import navigation from 'next/navigation';
import { mockDialogMethods } from '@/utils/test/mock-dialog-methods';
import { mockScrollMethods } from '@/utils/test/mock-scroll-methods';
import { VoterRegistrationPathnames } from '@/app/register/constants/voter-registration-pathnames';
import type { User } from '@/model/types/user';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import type { FunctionComponent } from 'react';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('Names', () => {
  let router: AppRouterInstance;
  let voterRegistrationForm: InstanceType<typeof VoterRegistrationForm>;
  let NamesWithContext: FunctionComponent;
  let yourNameForm: InstanceType<typeof YourNameForm>;
  let previousNameForm: InstanceType<typeof PreviousNameForm>;
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
    yourNameForm = voterRegistrationForm.fields.names.fields.yourName;
    previousNameForm = voterRegistrationForm.fields.names.fields.previousName;

    NamesWithContext = function NamesWithContext() {
      return (
        <UserContext.Provider
          value={Builder<UserContextType>().user(appUser).build()}
        >
          <VoterRegistrationContext.Provider
            value={{
              voterRegistrationForm,
            }}
          >
            <Names />
          </VoterRegistrationContext.Provider>
        </UserContext.Provider>
      );
    };

    user = userEvent.setup();
    render(<NamesWithContext />);
  });

  afterEach(() => {
    cleanup();
    clearAllPersistentFormElements();
  });

  it(`displays the previous name form when the "I've changed my name" checkbox 
  is checked.`, async () => {
    const fieldsets = document.getElementsByTagName('fieldset');
    expect(fieldsets.length).toBe(1);

    const changedName = screen.getByLabelText(/I've changed my name/i);
    await user.click(changedName);

    expect(fieldsets.length).toBe(2);

    const previousName = fieldsets[1];
    expect(previousName.children[0].textContent).toBe('Previous Name');
  });

  it(`focuses on the first invalid field when the "Next" button is clicked
  while there are invalid fields and advances the user to the next page when 
  all fields are complete.`, async () => {
    const changedName = screen.getByLabelText(/I've changed my name/i);
    await user.click(changedName);

    const nextButton = screen.getByText(/next/i);

    await user.click(nextButton);
    expect(document.activeElement).toBe(
      document.getElementById(yourNameForm.fields.title.id),
    );

    act(() => yourNameForm.fields.title.setValue('Mr.'));
    await user.click(nextButton);
    expect(document.activeElement).toBe(
      document.getElementById(yourNameForm.fields.first.id),
    );

    await user.keyboard('Test');
    await user.click(nextButton);
    expect(document.activeElement).toBe(
      document.getElementById(yourNameForm.fields.last.id),
    );

    await user.keyboard('User');
    await user.click(nextButton);
    expect(document.activeElement).toBe(
      document.getElementById(previousNameForm.fields.title.id),
    );

    act(() => previousNameForm.fields.title.setValue('Mr.'));
    await user.click(nextButton);
    expect(document.activeElement).toBe(
      document.getElementById(previousNameForm.fields.first.id),
    );

    await user.keyboard('Test');
    await user.click(nextButton);
    expect(document.activeElement).toBe(
      document.getElementById(previousNameForm.fields.last.id),
    );

    await user.keyboard('User');
    await user.click(nextButton);
    expect(router.push).toHaveBeenCalledWith(
      VoterRegistrationPathnames.ADDRESSES,
    );
  });
});
