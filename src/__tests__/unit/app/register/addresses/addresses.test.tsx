import { render, screen, cleanup, act } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import { clearAllPersistentFormElements } from 'fully-formed';
import { Addresses } from '@/app/register/addresses/addresses';
import { VoterRegistrationContext } from '@/app/register/voter-registration-context';
import { VoterRegistrationForm } from '@/app/register/voter-registration-form';
import { HomeAddressForm } from '@/app/register/addresses/home-address/home-address-form';
import { MailingAddressForm } from '@/app/register/addresses/mailing-address/mailing-address-form';
import { PreviousAddressForm } from '@/app/register/addresses/previous-address/previous-address-form';
import { Builder } from 'builder-pattern';
import navigation from 'next/navigation';
import { mockDialogMethods } from '@/utils/test/mock-dialog-methods';
import { mockScrollMethods } from '@/utils/test/mock-scroll-methods';
import { VoterRegistrationPathnames } from '@/app/register/constants/voter-registration-pathnames';
import { AddressErrorTypes } from '@/model/types/addresses/address-error-types';
import * as validateAddressesModule from '../../../../../../src/app/register/addresses/utils/validate-addresses';
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

describe('Addresses', () => {
  let router: AppRouterInstance;
  let voterRegistrationForm: InstanceType<typeof VoterRegistrationForm>;
  let AddressesWithContext: FunctionComponent;
  let user: UserEvent;
  let homeAddressForm: InstanceType<typeof HomeAddressForm>;
  let mailingAddressForm: InstanceType<typeof MailingAddressForm>;
  let previousAddressForm: InstanceType<typeof PreviousAddressForm>;

  beforeEach(() => {
    mockDialogMethods();
    mockScrollMethods();

    router = Builder<AppRouterInstance>()
      .push(jest.fn())
      .prefetch(jest.fn())
      .build();

    jest.spyOn(navigation, 'useRouter').mockImplementation(() => router);

    voterRegistrationForm = new VoterRegistrationForm(
      Builder<User>().email('user@example.com').build(),
    );

    homeAddressForm = voterRegistrationForm.fields.addresses.fields.homeAddress;
    mailingAddressForm =
      voterRegistrationForm.fields.addresses.fields.mailingAddress;
    previousAddressForm =
      voterRegistrationForm.fields.addresses.fields.previousAddress;

    AddressesWithContext = function AddressesWithContext() {
      return (
        <VoterRegistrationContext.Provider
          value={{
            voterRegistrationForm,
          }}
        >
          <Addresses />
        </VoterRegistrationContext.Provider>
      );
    };

    user = userEvent.setup();
    render(<AddressesWithContext />);
  });

  afterEach(() => {
    cleanup();
    clearAllPersistentFormElements();
  });

  it(`prefetches the next page when the state field of the home address form is 
  updated and is valid.`, async () => {
    act(() => homeAddressForm.fields.state.setValue('CA'));
    expect(router.prefetch).toHaveBeenLastCalledWith(
      VoterRegistrationPathnames.OTHER_DETAILS + '?state=CA',
    );
  });

  it(`displays the mailing address form when the user checks the corresponding
  checkbox.`, async () => {
    const fieldsets = document.getElementsByTagName('fieldset');
    expect(fieldsets.length).toBe(1);

    const showMailingAddress = screen.getByLabelText(
      'I get my mail at a different address from the one above',
    );
    await user.click(showMailingAddress);
    expect(fieldsets.length).toBe(2);

    const mailingAddress = fieldsets[1];
    expect(mailingAddress.children[0].textContent).toBe('Mailing Address');
  });

  it(`displays the previous address form when the user checks the corresponding
  checkbox.`, async () => {
    const fieldsets = document.getElementsByTagName('fieldset');
    expect(fieldsets.length).toBe(1);

    const showPreviousAddress = screen.getByLabelText(
      "I've changed my address since the last time I registered to vote",
    );
    await user.click(showPreviousAddress);
    expect(fieldsets.length).toBe(2);

    const previousAddress = fieldsets[1];
    expect(previousAddress.children[0].textContent).toBe('Previous Address');
  });

  it(`focuses on the first invalid input when the user attempts to submit the
  form while it is invalid.`, async () => {
    const showMailingAddress = screen.getByLabelText(
      'I get my mail at a different address from the one above',
    );
    await user.click(showMailingAddress);

    const showPreviousAddress = screen.getByLabelText(
      "I've changed my address since the last time I registered to vote",
    );
    await user.click(showPreviousAddress);

    const submitBtn = screen.getByText('Next');
    await user.click(submitBtn);
    expect(document.activeElement).toBe(
      document.getElementById(homeAddressForm.fields.streetLine1.id),
    );

    await user.keyboard('1600 Amphitheatre Pkwy');
    await user.click(submitBtn);
    expect(document.activeElement).toBe(
      document.getElementById(homeAddressForm.fields.city.id),
    );

    await user.keyboard('Mountain View');
    await user.click(submitBtn);
    expect(document.activeElement).toBe(
      document.getElementById(homeAddressForm.fields.zip.id),
    );

    await user.keyboard('94043');
    await user.click(submitBtn);
    expect(document.activeElement).toBe(
      document.getElementById(mailingAddressForm.fields.streetLine1.id),
    );

    await user.keyboard('500 W 2nd Street');
    await user.click(submitBtn);
    expect(document.activeElement).toBe(
      document.getElementById(mailingAddressForm.fields.city.id),
    );

    await user.keyboard('Austin');
    await user.click(submitBtn);
    expect(document.activeElement).toBe(
      document.getElementById(mailingAddressForm.fields.zip.id),
    );

    await user.keyboard('78701');
    await user.click(submitBtn);
    expect(document.activeElement).toBe(
      document.getElementById(previousAddressForm.fields.streetLine1.id),
    );

    await user.keyboard('PO Box 1108');
    await user.click(submitBtn);
    expect(document.activeElement).toBe(
      document.getElementById(previousAddressForm.fields.city.id),
    );

    await user.keyboard('Sterling');
    await user.click(submitBtn);
    expect(document.activeElement).toBe(
      document.getElementById(previousAddressForm.fields.zip.id),
    );
  });

  test(`When submitted while valid, it validates addresses and displays any 
  detected errors in a modal.`, async () => {
    const validateAddressesSpy = jest
      .spyOn(validateAddressesModule, 'validateAddresses')
      .mockImplementationOnce(() => {
        return Promise.resolve([
          {
            type: AddressErrorTypes.MissingSubpremise,
            form: 'homeAddress',
          },
        ]);
      });

    await user.type(
      document.getElementById(homeAddressForm.fields.streetLine1.id)!,
      '500 W 2nd St',
    );

    await user.type(
      document.getElementById(homeAddressForm.fields.city.id)!,
      'Austin',
    );

    await user.type(
      document.getElementById(homeAddressForm.fields.zip.id)!,
      '78701',
    );

    const submitBtn = screen.getByText('Next');
    await user.click(submitBtn);

    expect(validateAddressesSpy).toHaveBeenCalledTimes(1);
    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalledTimes(1);

    validateAddressesSpy.mockRestore();
  });

  it('closes the modal when the modal\'s "Edit address" button is clicked.', async () => {
    const validateAddressesSpy = jest
      .spyOn(validateAddressesModule, 'validateAddresses')
      .mockImplementationOnce(() => {
        return Promise.resolve([
          {
            type: AddressErrorTypes.UnconfirmedComponents,
            form: 'homeAddress',
            unconfirmedAddressComponents: {
              streetLine1: {
                value: '2930 Pearl St.',
                hasIssue: false,
              },
              streetLine2: {
                value: 'Suite 100',
                hasIssue: true,
              },
              city: {
                value: 'Boulder',
                hasIssue: false,
              },
              state: {
                value: 'CO',
                hasIssue: false,
              },
              zip: {
                value: '80301',
                hasIssue: false,
              },
            },
          },
        ]);
      });

    await user.type(
      document.getElementById(homeAddressForm.fields.streetLine1.id)!,
      '2930 Pearl St.',
    );

    await user.type(
      document.getElementById(homeAddressForm.fields.streetLine2.id)!,
      'Suite 100',
    );

    await user.type(
      document.getElementById(homeAddressForm.fields.city.id)!,
      'Boulder',
    );

    await user.type(
      document.getElementById(homeAddressForm.fields.zip.id)!,
      '80301',
    );

    const submitBtn = screen.getByText('Next');
    await user.click(submitBtn);

    expect(validateAddressesSpy).toHaveBeenCalledTimes(1);
    validateAddressesSpy.mockRestore();

    const returnToEditing = screen.getByText(/edit address/i);
    await user.click(returnToEditing);

    expect(HTMLDialogElement.prototype.close).toHaveBeenCalledTimes(1);
    validateAddressesSpy.mockRestore();
  });

  it("advances to the next page when the modal's Continue button is clicked.", async () => {
    const validateAddressesSpy = jest
      .spyOn(validateAddressesModule, 'validateAddresses')
      .mockImplementationOnce(() => {
        return Promise.resolve([
          {
            type: AddressErrorTypes.UnconfirmedComponents,
            form: 'homeAddress',
            unconfirmedAddressComponents: {
              streetLine1: {
                value: '2930 Pearl St.',
                hasIssue: false,
              },
              streetLine2: {
                value: 'Suite 100',
                hasIssue: true,
              },
              city: {
                value: 'Boulder',
                hasIssue: false,
              },
              state: {
                value: 'CO',
                hasIssue: false,
              },
              zip: {
                value: '80301',
                hasIssue: false,
              },
            },
          },
        ]);
      });

    await user.type(
      document.getElementById(homeAddressForm.fields.streetLine1.id)!,
      '2930 Pearl St.',
    );

    await user.type(
      document.getElementById(homeAddressForm.fields.streetLine2.id)!,
      'Suite 100',
    );

    await user.type(
      document.getElementById(homeAddressForm.fields.city.id)!,
      'Boulder',
    );

    await user.type(
      document.getElementById(homeAddressForm.fields.zip.id)!,
      '80301',
    );

    const submitBtn = screen.getByText('Next');
    await user.click(submitBtn);

    expect(validateAddressesSpy).toHaveBeenCalledTimes(1);
    validateAddressesSpy.mockRestore();

    const continueAnyway = screen.getByText(/continue anyway/i);
    await user.click(continueAnyway);

    expect(router.push).toHaveBeenCalledWith(
      VoterRegistrationPathnames.OTHER_DETAILS + '?state=CO',
    );
    validateAddressesSpy.mockRestore();
  });

  it('cannot be submitted while loading.', async () => {
    const promiseScheduler = new PromiseScheduler();

    const validateAddressesSpy = jest
      .spyOn(validateAddressesModule, 'validateAddresses')
      .mockImplementation(() => {
        return promiseScheduler.createScheduledPromise([]);
      });

    await user.type(
      document.getElementById(homeAddressForm.fields.streetLine1.id)!,
      '1600 Amphitheatre Pkwy',
    );

    await user.type(
      document.getElementById(homeAddressForm.fields.city.id)!,
      'Mountain View',
    );

    await user.type(
      document.getElementById(homeAddressForm.fields.zip.id)!,
      '94043',
    );

    const submitBtn = screen.getByText('Next');

    for (let i = 0; i < 5; i++) {
      await user.click(submitBtn);
    }

    expect(validateAddressesSpy).toHaveBeenCalledTimes(1);
    validateAddressesSpy.mockRestore();
  });

  it(`routes the user to the next page if the form is valid, the user submits it,
  and there are no address errors.`, async () => {
    const validateAddressesSpy = jest
      .spyOn(validateAddressesModule, 'validateAddresses')
      .mockImplementation(() => {
        return Promise.resolve([]);
      });

    await user.type(
      document.getElementById(homeAddressForm.fields.streetLine1.id)!,
      '1600 Amphitheatre Pkwy',
    );
    await user.type(
      document.getElementById(homeAddressForm.fields.city.id)!,
      'Mountain View',
    );
    await user.type(
      document.getElementById(homeAddressForm.fields.zip.id)!,
      '94043',
    );

    const submitBtn = screen.getByText('Next');
    await user.click(submitBtn);
    expect(router.push).toHaveBeenCalledWith(
      VoterRegistrationPathnames.OTHER_DETAILS + '?state=CA',
    );
    validateAddressesSpy.mockRestore();
  });
});
