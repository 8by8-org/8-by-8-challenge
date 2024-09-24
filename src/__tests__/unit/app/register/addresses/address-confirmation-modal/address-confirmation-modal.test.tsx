import { render, screen, cleanup } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import '@testing-library/jest-dom';
import navigation from 'next/navigation';
import { AddressConfirmationModal } from '@/app/register/addresses/address-confirmation-modal';
import { AddressesForm } from '@/app/register/addresses/addresses-form';
import { AddressErrorTypes } from '@/model/types/addresses/address-error-types';
import { Field } from 'fully-formed';
import { Builder } from 'builder-pattern';
import { mockDialogMethods } from '@/utils/test/mock-dialog-methods';
import { clearAllPersistentFormElements } from 'fully-formed';
import type { AddressErrors } from '@/model/types/addresses/address-errors';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

jest.mock('next/navigation', () => {
  return {
    ...jest.requireActual('next/navigation'),
    useRouter: jest.fn(),
  };
});

describe('AddressConfirmationModal', () => {
  let router: AppRouterInstance;
  let user: UserEvent;

  beforeEach(() => {
    mockDialogMethods();
    user = userEvent.setup();
    router = Builder<AppRouterInstance>().push(jest.fn()).build();

    jest.spyOn(navigation, 'useRouter').mockImplementation(() => {
      return router;
    });
  });

  afterEach(() => {
    cleanup();
    clearAllPersistentFormElements();
  });

  it(`displays information about each error it receives one a time, together 
  with a button that advances to the next error, or to the next screen if 
  the last error is currently displayed.`, async () => {
    const errors: AddressErrors[] = [
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
      {
        type: AddressErrorTypes.ReviewRecommendedAddress,
        form: 'mailingAddress',
        enteredAddress: {
          streetLine1: {
            value: '1600 Amphitheatre',
            hasIssue: false,
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
        recommendedAddress: {
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
      {
        type: AddressErrorTypes.MissingSubpremise,
        form: 'previousAddress',
      },
    ];

    render(
      <AddressConfirmationModal
        addressesForm={
          new AddressesForm(new Field({ name: 'zip', defaultValue: '' }))
        }
        errors={errors}
        returnToEditing={jest.fn()}
      />,
    );

    expect(screen.queryByText('1 / 3')).toBeInTheDocument();

    await user.click(screen.getByText(/next/i));
    expect(screen.queryByText('2 / 3')).toBeInTheDocument();

    await user.click(screen.getByText(/next/i));
    expect(screen.queryByText('3 / 3')).toBeInTheDocument();

    await user.click(screen.getByText(/continue/i));
    expect(router.push).toHaveBeenCalled();
  });
});
