import { render, screen, cleanup } from '@testing-library/react';
import userEvent, { UserEvent } from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { MissingSubpremise } from '@/app/register/addresses/address-confirmation-modal/missing-subpremise';
import { MailingAddressForm } from '@/app/register/addresses/mailing-address/mailing-address-form';
import { clearAllPersistentFormElements } from 'fully-formed';

describe('MissingSubpremise', () => {
  let user: UserEvent;

  beforeEach(() => {
    user = userEvent.setup();
  });

  afterEach(() => {
    cleanup();
    clearAllPersistentFormElements();
  });

  it(`renders an input which the user can use to update the streetLine2 field 
  of the form.`, async () => {
    const form = new MailingAddressForm();

    render(
      <MissingSubpremise
        form={form}
        errorNumber={1}
        errorCount={1}
        nextOrContinue={jest.fn()}
      />,
    );

    const input = screen.getByLabelText(/address line 2/i);
    const updatedValue = 'Apartment 3';
    await user.type(input, updatedValue);
    expect(form.fields.streetLine2.state.value).toBe(updatedValue);
  });

  it(`renders the number of the error out of the total number of errors.`, () => {
    render(
      <MissingSubpremise
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
      <MissingSubpremise
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
      <MissingSubpremise
        form={new MailingAddressForm()}
        errorNumber={1}
        errorCount={1}
        nextOrContinue={jest.fn()}
      />,
    );

    expect(screen.queryByText(/continue/i)).toBeInTheDocument();
  });

  it(`calls nextOrContinue when the Next or Continue button is clicked.`, async () => {
    const nextOrContinue = jest.fn();

    render(
      <MissingSubpremise
        form={new MailingAddressForm()}
        errorNumber={1}
        errorCount={2}
        nextOrContinue={nextOrContinue}
      />,
    );

    await user.click(screen.getByText(/next/i));
    expect(nextOrContinue).toHaveBeenCalled();
  });
});
