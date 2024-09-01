import { Meta, StoryObj } from '@storybook/react';
import { Field, FormFactory, FormTemplate, useForm } from 'fully-formed';
import { Modal } from '@/components/utils/modal';
import { MissingUnit } from '@/app/register/addresses/address-confirmation-modal/missing-unit';
import { GlobalStylesProvider } from '@/stories/global-styles-provider';

const meta: Meta<typeof MissingUnit> = {
  component: MissingUnit,
};

export default meta;

type Story = StoryObj<typeof MissingUnit>;

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
    const form = new AddressForm();

    return (
      <GlobalStylesProvider>
        <Modal
          ariaLabel="Missing Information"
          theme="light"
          isOpen={true}
          closeModal={() => {}}
        >
          <MissingUnit
            enteredAddress={{
              streetLine1: form.state.value.streetLine1,
              city: form.state.value.city,
              state: form.state.value.state,
              zip: form.state.value.zip,
            }}
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
