import { useRedirectToFirstIncompletePage } from '@/app/register/utils/use-redirect-to-first-incomplete-page';
import { render, cleanup } from '@testing-library/react';
import navigation from 'next/navigation';
import { Validity } from 'fully-formed';
import { Builder } from 'builder-pattern';
import { VoterRegistrationForm } from '@/app/register/voter-registration-form';
import { EligibilityForm } from '@/app/register/eligibility/eligibility-form';
import { NamesForm } from '@/app/register/names/names-form';
import { AddressesForm } from '@/app/register/addresses/addresses-form';
import { OtherDetailsForm } from '@/app/register/other-details/other-details-form';
import { VoterRegistrationPathnames } from '@/app/register/constants/voter-registration-pathnames';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

interface TestComponentProps {
  form: InstanceType<typeof VoterRegistrationForm>;
}

function TestComponent(props: TestComponentProps) {
  useRedirectToFirstIncompletePage(props.form);
  return null;
}

interface MockFormParams {
  eligibilityValidity: Validity;
  namesValidity: Validity;
  addressesValidity: Validity;
  otherDetailsValidity: Validity;
}

function createMockForm(params: MockFormParams) {
  const form = Builder<InstanceType<typeof VoterRegistrationForm>>()
    .fields({
      eligibility: Builder<InstanceType<typeof EligibilityForm>>()
        .state({
          validity: params.eligibilityValidity,
        } as any)
        .build(),
      names: Builder<InstanceType<typeof NamesForm>>()
        .state({
          validity: params.namesValidity,
        } as any)
        .build(),
      addresses: Builder<InstanceType<typeof AddressesForm>>()
        .state({
          validity: params.addressesValidity,
        } as any)
        .build(),
      otherDetails: Builder<InstanceType<typeof OtherDetailsForm>>()
        .state({
          validity: params.otherDetailsValidity,
        } as any)
        .build(),
    })
    .subscribeToState(
      jest.fn().mockImplementation(() => ({ unsubscribe: jest.fn() })),
    )
    .build();

  return form;
}

describe('useRedirectToFirstIncompletePage', () => {
  let router: AppRouterInstance;

  beforeEach(() => {
    router = Builder<AppRouterInstance>().push(jest.fn()).build();
    jest.spyOn(navigation, 'useRouter').mockImplementation(() => router);
  });

  afterEach(cleanup);

  it(`redirects the user to the eligibility page if the eligibility form is 
  invalid and the user has navigated to any of the other pages in the voter 
  registration form.`, () => {
    const form = createMockForm({
      eligibilityValidity: Validity.Invalid,
      namesValidity: Validity.Invalid,
      addressesValidity: Validity.Invalid,
      otherDetailsValidity: Validity.Invalid,
    });

    const pathnames = [
      VoterRegistrationPathnames.NAMES,
      VoterRegistrationPathnames.ADDRESSES,
      VoterRegistrationPathnames.OTHER_DETAILS,
    ];

    for (const pathname of pathnames) {
      jest
        .spyOn(navigation, 'usePathname')
        .mockImplementationOnce(() => pathname);

      render(<TestComponent form={form} />);
      expect(router.push).toHaveBeenCalledTimes(1);
      expect(router.push).toHaveBeenCalledWith(
        VoterRegistrationPathnames.ELIGIBILITY,
      );

      cleanup();
      jest.clearAllMocks();
    }
  });

  it(`redirects the user to the names page if the names form is invalid, the
  eligibility form is valid, and the user has navigated to the addresses or
  other details pages.`, () => {
    const form = createMockForm({
      eligibilityValidity: Validity.Valid,
      namesValidity: Validity.Invalid,
      addressesValidity: Validity.Invalid,
      otherDetailsValidity: Validity.Invalid,
    });

    const pathnames = [
      VoterRegistrationPathnames.ADDRESSES,
      VoterRegistrationPathnames.OTHER_DETAILS,
    ];

    for (const pathname of pathnames) {
      jest
        .spyOn(navigation, 'usePathname')
        .mockImplementationOnce(() => pathname);

      render(<TestComponent form={form} />);
      expect(router.push).toHaveBeenCalledTimes(1);
      expect(router.push).toHaveBeenCalledWith(
        VoterRegistrationPathnames.NAMES,
      );

      cleanup();
      jest.clearAllMocks();
    }
  });

  it(`redirects the user to the addresses page if the addresses form is invalid,
  the eligibility and names forms are valid, and the user has navigated to the
  other details page.`, () => {
    const form = createMockForm({
      eligibilityValidity: Validity.Valid,
      namesValidity: Validity.Valid,
      addressesValidity: Validity.Invalid,
      otherDetailsValidity: Validity.Invalid,
    });

    jest
      .spyOn(navigation, 'usePathname')
      .mockImplementationOnce(() => VoterRegistrationPathnames.OTHER_DETAILS);

    render(<TestComponent form={form} />);
    expect(router.push).toHaveBeenCalledTimes(1);
    expect(router.push).toHaveBeenCalledWith(
      VoterRegistrationPathnames.ADDRESSES,
    );
  });

  it(`does not redirect the user to the eligibility page if the eligibility form
  is invalid, but the user is already on the eligibility page.`, () => {
    const form = createMockForm({
      eligibilityValidity: Validity.Invalid,
      namesValidity: Validity.Invalid,
      addressesValidity: Validity.Invalid,
      otherDetailsValidity: Validity.Invalid,
    });

    jest
      .spyOn(navigation, 'usePathname')
      .mockImplementationOnce(() => VoterRegistrationPathnames.ELIGIBILITY);

    render(<TestComponent form={form} />);
    expect(router.push).not.toHaveBeenCalled();
  });

  it(`does not redirect the user to the names page if it the names form is
  invalid and the eligibility form is valid, but the user has navigated to
  either the eligibility or names pages.`, () => {
    const form = createMockForm({
      eligibilityValidity: Validity.Valid,
      namesValidity: Validity.Invalid,
      addressesValidity: Validity.Invalid,
      otherDetailsValidity: Validity.Invalid,
    });

    const pathnames = [
      VoterRegistrationPathnames.ELIGIBILITY,
      VoterRegistrationPathnames.NAMES,
    ];

    for (const pathname of pathnames) {
      jest
        .spyOn(navigation, 'usePathname')
        .mockImplementationOnce(() => pathname);

      render(<TestComponent form={form} />);
      expect(router.push).not.toHaveBeenCalled();

      cleanup();
      jest.clearAllMocks();
    }
  });

  it(`does not redirect the user to the addresses page if the addresses form is
  invalid and the eligibility and names forms are valid, but the user has
  navigated to the eligibility, names, or addresses pages.`, () => {
    const form = createMockForm({
      eligibilityValidity: Validity.Valid,
      namesValidity: Validity.Valid,
      addressesValidity: Validity.Invalid,
      otherDetailsValidity: Validity.Invalid,
    });

    const pathnames = [
      VoterRegistrationPathnames.ELIGIBILITY,
      VoterRegistrationPathnames.NAMES,
      VoterRegistrationPathnames.ADDRESSES,
    ];

    for (const pathname of pathnames) {
      jest
        .spyOn(navigation, 'usePathname')
        .mockImplementationOnce(() => pathname);

      render(<TestComponent form={form} />);
      expect(router.push).not.toHaveBeenCalled();

      cleanup();
      jest.clearAllMocks();
    }
  });

  it(`does not redirect the user to the other details page.`, () => {
    const form = createMockForm({
      eligibilityValidity: Validity.Valid,
      namesValidity: Validity.Valid,
      addressesValidity: Validity.Valid,
      otherDetailsValidity: Validity.Invalid,
    });

    const pathnames = [
      VoterRegistrationPathnames.ELIGIBILITY,
      VoterRegistrationPathnames.NAMES,
      VoterRegistrationPathnames.ADDRESSES,
      VoterRegistrationPathnames.OTHER_DETAILS,
    ];

    for (const pathname of pathnames) {
      jest
        .spyOn(navigation, 'usePathname')
        .mockImplementationOnce(() => pathname);

      render(<TestComponent form={form} />);
      expect(router.push).not.toHaveBeenCalled();

      cleanup();
      jest.clearAllMocks();
    }
  });
});
