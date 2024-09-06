import { render, cleanup, act } from '@testing-library/react';
import navigation from 'next/navigation';
import { usePrefetchOtherDetailsWithStateAndZip } from '@/app/register/addresses/hooks/use-prefetch-other-details-with-state-and-zip';
import { HomeAddressForm } from '@/app/register/addresses/home-address/home-address-form';
import { VoterRegistrationPathnames } from '@/app/register/constants/voter-registration-pathnames';
import {
  clearAllPersistentFormElements,
  Validity,
  ValidityUtils,
} from 'fully-formed';
import { Builder } from 'builder-pattern';
import { Field } from 'fully-formed';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import zipState from 'zip-state';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('usePrefetchOtherDetailsWithStateAndZip', () => {
  let router: AppRouterInstance;

  interface TestComponentProps {
    form: InstanceType<typeof HomeAddressForm>;
  }

  function TestComponent({ form }: TestComponentProps) {
    usePrefetchOtherDetailsWithStateAndZip(form);

    return null;
  }

  beforeEach(() => {
    router = Builder<AppRouterInstance>().prefetch(jest.fn()).build();
    jest.spyOn(navigation, 'useRouter').mockImplementation(() => router);
  });

  afterEach(() => {
    cleanup();
    clearAllPersistentFormElements();
  });

  it(`prefetches the other details page when the page loads if both the zip and 
  state fields are valid.`, () => {
    const zip = '94043';
    const state = zipState(zip);
    expect(state).toEqual(expect.stringMatching(/[A-Z]{2}/));

    const form = new HomeAddressForm(
      new Field({ name: 'zip', defaultValue: zip }),
    );

    expect(ValidityUtils.isValid(form.fields.zip)).toBe(true);
    expect(ValidityUtils.isValid(form.fields.state)).toBe(true);

    render(<TestComponent form={form} />);
    expect(router.prefetch).toHaveBeenCalledWith(
      VoterRegistrationPathnames.OTHER_DETAILS + `?state=${state}&zip=${zip}`,
    );
  });

  it(`prefetches the other details page when the page loads if both the zip and
  state fields are caution.`, () => {
    const zip = '94043';
    const state = zipState(zip);
    expect(state).toEqual(expect.stringMatching(/[A-Z]{2}/));

    const form = new HomeAddressForm(
      new Field({ name: 'zip', defaultValue: zip }),
    );

    form.fields.zip.setValidityAndMessages(Validity.Caution, []);
    form.fields.state.setValidityAndMessages(Validity.Caution, []);

    render(<TestComponent form={form} />);
    expect(router.prefetch).toHaveBeenCalledWith(
      VoterRegistrationPathnames.OTHER_DETAILS + `?state=${state}&zip=${zip}`,
    );
  });

  it(`prefetches the other details page when the page loads if the zip field is
  valid and the state field is caution.`, () => {
    const zip = '94043';
    const state = zipState(zip);
    expect(state).toEqual(expect.stringMatching(/[A-Z]{2}/));

    const form = new HomeAddressForm(
      new Field({ name: 'zip', defaultValue: zip }),
    );

    form.fields.state.setValidityAndMessages(Validity.Caution, []);

    render(<TestComponent form={form} />);
    expect(router.prefetch).toHaveBeenCalledWith(
      VoterRegistrationPathnames.OTHER_DETAILS + `?state=${state}&zip=${zip}`,
    );
  });

  it(`prefetches the other details page when the page loads if the zip field is
  caution and the state field is valid.`, () => {
    const zip = '94043';
    const state = zipState(zip);
    expect(state).toEqual(expect.stringMatching(/[A-Z]{2}/));

    const form = new HomeAddressForm(
      new Field({ name: 'zip', defaultValue: zip }),
    );

    form.fields.zip.setValidityAndMessages(Validity.Caution, []);

    render(<TestComponent form={form} />);
    expect(router.prefetch).toHaveBeenCalledWith(
      VoterRegistrationPathnames.OTHER_DETAILS + `?state=${state}&zip=${zip}`,
    );
  });

  it(`does not prefetch the other details page if the zip field is invalid.`, () => {
    const form = new HomeAddressForm(
      new Field({ name: 'zip', defaultValue: '' }),
    );

    expect(ValidityUtils.isInvalid(form.fields.zip)).toBe(true);

    render(<TestComponent form={form} />);
    expect(router.prefetch).not.toHaveBeenCalled();
  });

  it(`prefetches the other details page when the zip code field changes and is
  valid.`, () => {
    const form = new HomeAddressForm(
      new Field({ name: 'zip', defaultValue: '' }),
    );

    render(<TestComponent form={form} />);
    expect(router.prefetch).not.toHaveBeenCalled();

    act(() => form.fields.zip.setValue('94043'));
    expect(router.prefetch).toHaveBeenCalledWith(
      VoterRegistrationPathnames.OTHER_DETAILS +
        `?state=${form.state.value.state}&zip=${form.state.value.zip}`,
    );
  });

  it(`prefetches the other details page when the state field changes and the zip
  code field is valid.`, () => {
    const form = new HomeAddressForm(
      new Field({ name: 'zip', defaultValue: '94043' }),
    );

    render(<TestComponent form={form} />);

    act(() => form.fields.state.setValue('PA'));

    expect(router.prefetch).toHaveBeenCalledTimes(2);
    expect(router.prefetch).toHaveBeenLastCalledWith(
      VoterRegistrationPathnames.OTHER_DETAILS +
        `?state=${form.state.value.state}&zip=${form.state.value.zip}`,
    );
  });

  it(`prefetches the other details page when the state field changes and the zip
  code field is caution.`, () => {
    const form = new HomeAddressForm(
      new Field({ name: 'zip', defaultValue: '94043' }),
    );
    form.fields.zip.setValidityAndMessages(Validity.Caution, []);
    render(<TestComponent form={form} />);

    act(() => form.fields.state.setValue('PA'));

    expect(router.prefetch).toHaveBeenCalledTimes(2);
    expect(router.prefetch).toHaveBeenLastCalledWith(
      VoterRegistrationPathnames.OTHER_DETAILS +
        `?state=${form.state.value.state}&zip=${form.state.value.zip}`,
    );
  });

  it(`does not prefetch the other details page when the zip code field changes
  and is invalid.`, () => {
    const form = new HomeAddressForm(
      new Field({ name: 'zip', defaultValue: '' }),
    );
    render(<TestComponent form={form} />);

    act(() => form.fields.zip.setValue('1234'));

    expect(router.prefetch).not.toHaveBeenCalled();
  });

  it(`does not prefetch the other details page when the state field changes and
  the zip code field is invalid.`, () => {
    const form = new HomeAddressForm(
      new Field({ name: 'zip', defaultValue: '' }),
    );
    render(<TestComponent form={form} />);

    act(() => form.fields.state.setValue('NJ'));

    expect(router.prefetch).not.toHaveBeenCalled();
  });
});
