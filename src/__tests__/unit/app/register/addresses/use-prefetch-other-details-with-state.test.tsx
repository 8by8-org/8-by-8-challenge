import { render, cleanup, act } from '@testing-library/react';
import navigation from 'next/navigation';
import { usePrefetchOtherDetailsWithState } from '@/app/register/addresses/hooks/use-prefetch-other-details-with-state';
import { HomeAddressForm } from '@/app/register/addresses/home-address/home-address-form';
import { VoterRegistrationPathnames } from '@/app/register/constants/voter-registration-pathnames';
import { clearAllPersistentFormElements } from 'fully-formed';
import { Builder } from 'builder-pattern';
import { Field } from 'fully-formed';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import zipState from 'zip-state';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('usePrefetchOtherDetailsWithState', () => {
  let router: AppRouterInstance;

  interface TestComponentProps {
    form: InstanceType<typeof HomeAddressForm>;
  }

  function TestComponent({ form }: TestComponentProps) {
    usePrefetchOtherDetailsWithState(form);

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

  it(`prefetches the other details page when the page loads.`, () => {
    const zip = '94043';
    const state = zipState(zip);
    expect(state).toEqual(expect.stringMatching(/[A-Z]{2}/));

    const form = new HomeAddressForm(
      new Field({ name: 'zip', defaultValue: zip }),
    );

    render(<TestComponent form={form} />);
    expect(router.prefetch).toHaveBeenCalledWith(
      VoterRegistrationPathnames.OTHER_DETAILS + `?state=${state}`,
    );
  });

  it(`prefetches the other details page when the state field changes.`, () => {
    const form = new HomeAddressForm(
      new Field({ name: 'zip', defaultValue: '94043' }),
    );

    render(<TestComponent form={form} />);

    act(() => form.fields.state.setValue('PA'));

    expect(router.prefetch).toHaveBeenCalledTimes(2);
    expect(router.prefetch).toHaveBeenLastCalledWith(
      VoterRegistrationPathnames.OTHER_DETAILS +
        `?state=${form.state.value.state}`,
    );
  });
});
