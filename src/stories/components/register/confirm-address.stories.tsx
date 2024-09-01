import { Meta, StoryObj } from '@storybook/react';
import { Field, FormFactory, FormTemplate, useForm } from 'fully-formed';
import { Modal } from '@/components/utils/modal';
import { ConfirmAddress } from '@/app/register/addresses/address-confirmation-modal/confirm-address';
import { GlobalStylesProvider } from '@/stories/global-styles-provider';

const meta: Meta<typeof ConfirmAddress> = {
  component: ConfirmAddress,
};

export default meta;

type Story = StoryObj<typeof ConfirmAddress>;

const AddressForm = FormFactory.createForm(
  class AddressFormTemplate extends FormTemplate {
    public readonly fields = [
      new Field({
        name: 'streetLine1',
        defaultValue: '1600 Ampitheatre Parkway',
      }),
      new Field({
        name: 'streetLine2',
        defaultValue: '',
      }),
      new Field({
        name: 'city',
        defaultValue: 'Montan View',
      }),
      new Field({
        name: 'state',
        defaultValue: 'CA',
      }),
      new Field({
        name: 'zip',
        defaultValue: '94043',
      }),
    ] as const;
  },
);

export const Default: Story = {
  render: () => {
    const form = useForm(new AddressForm());

    return (
      <GlobalStylesProvider>
        <Modal
          ariaLabel="Confirm address"
          theme="light"
          isOpen={true}
          closeModal={() => {}}
        >
          <ConfirmAddress
            enteredAddress={{
              streetLine1: {
                text: '1600 Ampitheatre Parkway',
                hasIssue: false,
              },
              city: {
                text: 'Montan View',
                hasIssue: true,
              },
              state: {
                text: 'CA',
                hasIssue: false,
              },
              zip: {
                text: '94043',
                hasIssue: false,
              },
            }}
            recommendedAddress={{
              streetLine1: {
                text: '1600 Ampitheatre Parkway',
                hasIssue: false,
              },
              city: {
                text: 'Mountain View',
                hasIssue: true,
              },
              state: {
                text: 'CA',
                hasIssue: false,
              },
              zip: {
                text: '94043',
                hasIssue: false,
              },
            }}
            form={form}
            errorNumber={1}
            errorCount={3}
            nextOrContinue={() => {}}
          />
        </Modal>
      </GlobalStylesProvider>
    );
  },
};
