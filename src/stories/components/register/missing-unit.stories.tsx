import { Meta, StoryObj } from '@storybook/react';
import { Field, FormFactory, FormTemplate, useForm } from 'fully-formed';
import { Modal } from '@/components/utils/modal';
import { MissingSubpremise } from '@/app/register/addresses/address-confirmation-modal/missing-subpremise';
import { GlobalStylesProvider } from '@/stories/global-styles-provider';
import type { AddressForm } from '@/app/register/addresses/address-confirmation-modal/types/address-form';

const meta: Meta<typeof MissingSubpremise> = {
  component: MissingSubpremise,
};

export default meta;

type Story = StoryObj<typeof MissingSubpremise>;

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
        defaultValue: 'Mountain View',
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
          ariaLabel="Missing Information"
          theme="light"
          isOpen={true}
          closeModal={() => {}}
        >
          <MissingSubpremise
            form={form}
            errorNumber={2}
            errorCount={3}
            nextOrContinue={() => {}}
          />
        </Modal>
      </GlobalStylesProvider>
    );
  },
};
