import { render, screen, cleanup } from '@testing-library/react';
import userEvent, { UserEvent } from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { ReviewRecommendedAddress } from '@/app/register/addresses/address-confirmation-modal/review-recommended-address';
import { MailingAddressForm } from '@/app/register/addresses/mailing-address/mailing-address-form';
import { clearAllPersistentFormElements } from 'fully-formed';

describe('ReviewRecommendedAddress', () => {
  let user: UserEvent;

  beforeEach(() => {
    user = userEvent.setup();
  });

  afterEach(() => {
    cleanup();
    clearAllPersistentFormElements();
  });

  it(`renders the number of the error out of the total number of errors.`, () => {
    render(
      <ReviewRecommendedAddress
        enteredAddress={{
          streetLine1: {
            value: '1600 Amphitheatre Pkwy',
            hasIssue: false,
          },
          city: {
            value: 'Montan View',
            hasIssue: true,
          },
          state: {
            value: 'CO',
            hasIssue: true,
          },
          zip: {
            value: '94043',
            hasIssue: false,
          },
        }}
        recommendedAddress={{
          streetLine1: {
            value: '1600 Amphitheatre Pkwy',
            hasIssue: false,
          },
          city: {
            value: 'Mountain View',
            hasIssue: true,
          },
          state: {
            value: 'CA',
            hasIssue: true,
          },
          zip: {
            value: '94043',
            hasIssue: false,
          },
        }}
        form={new MailingAddressForm()}
        errorNumber={1}
        errorCount={2}
        nextOrContinue={jest.fn()}
      />,
    );

    expect(screen.queryByText('1 / 2')).toBeInTheDocument();
  });

  it(`displays the word "Next" in the button if there are more errors.`, () => {
    render(
      <ReviewRecommendedAddress
        enteredAddress={{
          streetLine1: {
            value: '1600 Amphitheatre Pkwy',
            hasIssue: false,
          },
          city: {
            value: 'Montan View',
            hasIssue: true,
          },
          state: {
            value: 'CO',
            hasIssue: true,
          },
          zip: {
            value: '94043',
            hasIssue: false,
          },
        }}
        recommendedAddress={{
          streetLine1: {
            value: '1600 Amphitheatre Pkwy',
            hasIssue: false,
          },
          city: {
            value: 'Mountain View',
            hasIssue: true,
          },
          state: {
            value: 'CA',
            hasIssue: true,
          },
          zip: {
            value: '94043',
            hasIssue: false,
          },
        }}
        form={new MailingAddressForm()}
        errorNumber={1}
        errorCount={2}
        nextOrContinue={jest.fn()}
      />,
    );

    expect(screen.queryByText(/next/i)).toBeInTheDocument();
  });

  it(`displays the word "Continue" in the button if the error is the last error
  detected.`, () => {
    render(
      <ReviewRecommendedAddress
        enteredAddress={{
          streetLine1: {
            value: '1600 Amphitheatre Pkwy',
            hasIssue: false,
          },
          city: {
            value: 'Montan View',
            hasIssue: true,
          },
          state: {
            value: 'CO',
            hasIssue: true,
          },
          zip: {
            value: '94043',
            hasIssue: false,
          },
        }}
        recommendedAddress={{
          streetLine1: {
            value: '1600 Amphitheatre Pkwy',
            hasIssue: false,
          },
          city: {
            value: 'Mountain View',
            hasIssue: true,
          },
          state: {
            value: 'CA',
            hasIssue: true,
          },
          zip: {
            value: '94043',
            hasIssue: false,
          },
        }}
        form={new MailingAddressForm()}
        errorNumber={1}
        errorCount={1}
        nextOrContinue={jest.fn()}
      />,
    );

    expect(screen.queryByText(/continue/i)).toBeInTheDocument();
  });

  it(`updates the value of the form and then calls nextOrContinue if 
  'Use recommended' is selected and the user clicks the next or continue 
  button.`, async () => {
    const form = new MailingAddressForm();
    const nextOrContinue = jest.fn();

    const enteredAddress = {
      streetLine1: {
        value: '789 Oka Drvie',
        hasIssue: true,
      },
      streetLine2: {
        value: '300',
        hasIssue: true,
      },
      city: {
        value: 'Dalas',
        hasIssue: true,
      },
      zip: {
        value: '75021',
        hasIssue: true,
      },
      state: {
        value: 'TN',
        hasIssue: true,
      },
    };

    for (const [fieldName, { value }] of Object.entries(enteredAddress)) {
      form.fields[fieldName as keyof typeof form.fields].setValue(value);
    }

    const recommendedAddress = {
      streetLine1: {
        value: '789 Oak Drive',
        hasIssue: true,
      },
      streetLine2: {
        value: 'Suite 300',
        hasIssue: true,
      },
      city: {
        value: 'Dallas',
        hasIssue: true,
      },
      zip: {
        value: '75201',
        hasIssue: true,
      },
      state: {
        value: 'TX',
        hasIssue: true,
      },
    };

    render(
      <ReviewRecommendedAddress
        enteredAddress={enteredAddress}
        recommendedAddress={recommendedAddress}
        form={form}
        errorNumber={1}
        errorCount={2}
        nextOrContinue={nextOrContinue}
      />,
    );

    await user.click(screen.getByLabelText(/use recommended/i));
    await user.click(screen.getByText(/next/i));
    expect(form.state.value.streetLine1).toBe(
      recommendedAddress.streetLine1.value,
    );
    expect(form.state.value.streetLine2).toBe(
      recommendedAddress.streetLine2.value,
    );
    expect(form.state.value.city).toBe(recommendedAddress.city.value);
    expect(form.state.value.state).toBe(recommendedAddress.state.value);
    expect(form.state.value.zip).toBe(recommendedAddress.zip.value);

    expect(form.state.value.streetLine1).not.toBe(
      enteredAddress.streetLine1.value,
    );
    expect(form.state.value.streetLine2).not.toBe(
      enteredAddress.streetLine2.value,
    );
    expect(form.state.value.city).not.toBe(enteredAddress.city.value);
    expect(form.state.value.state).not.toBe(enteredAddress.state.value);
    expect(form.state.value.zip).not.toBe(enteredAddress.zip.value);
    expect(nextOrContinue).toHaveBeenCalled();
  });

  it(`updates the value of the form and then calls nextOrContinue if 
    'Use recommended' is selected and the user clicks the next or continue 
    button.`, async () => {
    const form = new MailingAddressForm();
    const nextOrContinue = jest.fn();

    const enteredAddress = {
      streetLine1: {
        value: '2390 Pearl St.',
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
      zip: {
        value: '80301',
        hasIssue: false,
      },
      state: {
        value: 'CO',
        hasIssue: false,
      },
    };

    for (const [fieldName, { value }] of Object.entries(enteredAddress)) {
      form.fields[fieldName as keyof typeof form.fields].setValue(value);
    }

    const recommendedAddress = {
      streetLine1: {
        value: '2390 Pearl St.',
        hasIssue: false,
      },
      city: {
        value: 'Boulder',
        hasIssue: false,
      },
      zip: {
        value: '80301',
        hasIssue: false,
      },
      state: {
        value: 'CO',
        hasIssue: false,
      },
    };

    render(
      <ReviewRecommendedAddress
        enteredAddress={enteredAddress}
        recommendedAddress={recommendedAddress}
        form={form}
        errorNumber={1}
        errorCount={2}
        nextOrContinue={nextOrContinue}
      />,
    );

    await user.click(screen.getByLabelText(/use recommended/i));
    await user.click(screen.getByText(/next/i));
    expect(form.state.value.streetLine2).toBe('');
    expect(form.state.value.streetLine2).not.toBe(
      enteredAddress.streetLine2.value,
    );
    expect(nextOrContinue).toHaveBeenCalled();
  });

  it(`calls nextOrContinue without updating the value of the form when "Use 
  what you entered" is selected and the user clicks the next or continue 
  button.`, async () => {
    const form = new MailingAddressForm();
    const nextOrContinue = jest.fn();

    const enteredAddress = {
      streetLine1: {
        value: '1600 Amphitheatre Pkwy',
        hasIssue: false,
      },
      city: {
        value: 'Montan View',
        hasIssue: true,
      },
      zip: {
        value: '94043',
        hasIssue: false,
      },
      state: {
        value: 'CO',
        hasIssue: true,
      },
    };

    for (const [fieldName, { value }] of Object.entries(enteredAddress)) {
      form.fields[fieldName as keyof typeof form.fields].setValue(value);
    }

    const recommendedAddress = {
      streetLine1: {
        value: '1600 Amphitheatre Pkwy',
        hasIssue: false,
      },
      city: {
        value: 'Mountain View',
        hasIssue: true,
      },
      state: {
        value: 'CA',
        hasIssue: true,
      },
      zip: {
        value: '94043',
        hasIssue: false,
      },
    };

    render(
      <ReviewRecommendedAddress
        enteredAddress={enteredAddress}
        recommendedAddress={recommendedAddress}
        form={form}
        errorNumber={1}
        errorCount={2}
        nextOrContinue={nextOrContinue}
      />,
    );

    await user.click(screen.getByLabelText(/use what you entered/i));
    await user.click(screen.getByText(/next/i));
    expect(form.state.value.city).toBe(enteredAddress.city.value);
    expect(form.state.value.state).toBe(enteredAddress.state.value);
    expect(form.state.value.city).not.toBe(recommendedAddress.city.value);
    expect(form.state.value.state).not.toBe(recommendedAddress.state.value);
    expect(nextOrContinue).toHaveBeenCalled();
  });
});
