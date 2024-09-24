import { Meta, StoryObj } from '@storybook/react';
import { Field, FormFactory, FormTemplate, useForm } from 'fully-formed';
import { Modal } from '@/components/utils/modal';
import { ReviewRecommendedAddress } from '@/app/register/addresses/address-confirmation-modal/review-recommended-address';
import { GlobalStylesProvider } from '@/stories/global-styles-provider';
import type { AddressForm } from '@/app/register/addresses/address-confirmation-modal/types/address-form';

const meta: Meta<typeof ReviewRecommendedAddress> = {
  component: ReviewRecommendedAddress,
};

export default meta;

type Story = StoryObj<typeof ReviewRecommendedAddress>;

const MockAddressForm = FormFactory.createForm(
  class MockAddressFormTemplate extends FormTemplate {
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
    const form = useForm(new MockAddressForm() as unknown as AddressForm);

    return (
      <GlobalStylesProvider>
        <Modal
          ariaLabel="Confirm address"
          theme="light"
          isOpen={true}
          closeModal={() => {}}
        >
          <ReviewRecommendedAddress
            enteredAddress={{
              streetLine1: {
                value: '1600 Ampitheatre Parkway',
                hasIssue: false,
              },
              city: {
                value: 'Montan View',
                hasIssue: true,
              },
              state: {
                value: 'CA',
                hasIssue: false,
              },
              zip: {
                value: '94043',
                hasIssue: false,
              },
            }}
            recommendedAddress={{
              streetLine1: {
                value: '1600 Ampitheatre Parkway',
                hasIssue: false,
              },
              city: {
                value: 'Mountain View',
                hasIssue: true,
              },
              state: {
                value: 'CA',
                hasIssue: false,
              },
              zip: {
                value: '94043',
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
