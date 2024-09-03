import { Meta, StoryObj } from '@storybook/react';
import { useLayoutEffect } from 'react';
import { useForm, Field } from 'fully-formed';
import { AddressConfirmationModal } from '@/app/register/addresses/address-confirmation-modal/address-confirmation-modal';
import { AddressesForm } from '@/app/register/addresses/addresses-form';
import { GlobalStylesProvider } from '@/stories/global-styles-provider';
import { AddressErrorTypes } from '@/model/types/addresses/address-error-types';

const meta: Meta<typeof AddressConfirmationModal> = {
  component: AddressConfirmationModal,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
};

export default meta;

type Story = StoryObj<typeof AddressConfirmationModal>;

export const AllErrorTypes: Story = {
  render: () => {
    const form = useForm(
      new AddressesForm(new Field({ name: 'zip', defaultValue: '94043' })),
    );

    useLayoutEffect(() => {
      form.fields.homeAddress.fields.streetLine1.setValue('123 Mapel Lane');
      form.fields.homeAddress.fields.city.setValue('Springfield');
      form.fields.homeAddress.fields.zip.setValue('62701');
      form.fields.homeAddress.fields.state.setValue('IL');

      form.fields.mailingAddress.setExclude(false);
      form.fields.mailingAddress.fields.streetLine1.setValue('789 Elm St');
      form.fields.mailingAddress.fields.city.setValue('Brookside');
      form.fields.mailingAddress.fields.zip.setValue('10001');
      form.fields.mailingAddress.fields.state.setValue('NY');

      form.fields.previousAddress.setExclude(false);
      form.fields.previousAddress.fields.streetLine1.setValue(
        '456 Oakwood Ave',
      );
      form.fields.previousAddress.fields.city.setValue('Riverton');
      form.fields.previousAddress.fields.zip.setValue('90210');
      form.fields.previousAddress.fields.state.setValue('CA');
    }, [form]);

    return (
      <GlobalStylesProvider>
        <AddressConfirmationModal
          addressesForm={form}
          errors={[
            {
              type: AddressErrorTypes.ReviewRecommendedAddress,
              form: 'homeAddress',
              enteredAddress: {
                streetLine1: {
                  value: '123 Mapel Lane',
                  hasIssue: true,
                },
                city: {
                  value: 'Springfield',
                  hasIssue: false,
                },
                state: {
                  value: 'IL',
                  hasIssue: false,
                },
                zip: {
                  value: '62701',
                  hasIssue: false,
                },
              },
              recommendedAddress: {
                streetLine1: {
                  value: '123 Maple Lane',
                  hasIssue: true,
                },
                city: {
                  value: 'Springfield',
                  hasIssue: false,
                },
                state: {
                  value: 'IL',
                  hasIssue: false,
                },
                zip: {
                  value: '62701',
                  hasIssue: false,
                },
              },
            },
            {
              type: AddressErrorTypes.MissingSubpremise,
              form: 'mailingAddress',
            },
            {
              type: AddressErrorTypes.UnconfirmedComponents,
              form: 'previousAddress',
              unconfirmedAddressComponents: {
                streetLine1: {
                  value: '456 Oakwood Ave',
                  hasIssue: false,
                },
                city: {
                  value: 'Riverton',
                  hasIssue: true,
                },
                state: {
                  value: 'CA',
                  hasIssue: false,
                },
                zip: {
                  value: '90210',
                  hasIssue: false,
                },
              },
            },
          ]}
          returnToEditing={() => {}}
        />
      </GlobalStylesProvider>
    );
  },
};

export const FailedToValidate: Story = {
  render: () => {
    const form = useForm(
      new AddressesForm(new Field({ name: 'zip', defaultValue: '94043' })),
    );

    useLayoutEffect(() => {
      form.fields.homeAddress.fields.streetLine1.setValue('123 Mapel Lane');
      form.fields.homeAddress.fields.city.setValue('Springfield');
      form.fields.homeAddress.fields.zip.setValue('62701');
      form.fields.homeAddress.fields.state.setValue('IL');

      form.fields.mailingAddress.setExclude(false);
      form.fields.mailingAddress.fields.streetLine1.setValue('789 Elm St');
      form.fields.mailingAddress.fields.city.setValue('Brookside');
      form.fields.mailingAddress.fields.zip.setValue('10001');
      form.fields.mailingAddress.fields.state.setValue('NY');

      form.fields.previousAddress.setExclude(false);
      form.fields.previousAddress.fields.streetLine1.setValue(
        '456 Oakwood Ave',
      );
      form.fields.previousAddress.fields.city.setValue('Riverton');
      form.fields.previousAddress.fields.zip.setValue('90210');
      form.fields.previousAddress.fields.state.setValue('CA');
    }, [form]);

    return (
      <GlobalStylesProvider>
        <AddressConfirmationModal
          addressesForm={form}
          errors={[{ type: AddressErrorTypes.ValidationFailed }]}
          returnToEditing={() => {}}
        />
      </GlobalStylesProvider>
    );
  },
};
