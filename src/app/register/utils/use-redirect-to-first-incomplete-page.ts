import { useLayoutEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { usePipe, ValidityUtils } from 'fully-formed';
import { VOTER_REGISTRATION_PATHNAMES } from '../constants/voter-registration-pathnames';
import type { VoterRegistrationForm } from '../voter-registration-form';

export function useRedirectToFirstIncompletePage(
  voterRegistrationForm: InstanceType<typeof VoterRegistrationForm>,
) {
  const router = useRouter();
  const pathname = usePathname();
  const firstIncompletePage = usePipe(voterRegistrationForm, () => {
    return getFirstIncompletePage(voterRegistrationForm);
  });

  useLayoutEffect(() => {
    const currentPageIndex = Array.from(VOTER_REGISTRATION_PATHNAMES.values())
    if (currentPage > firstIncompletePage) {
      router.push(VOTER_REGISTRATION_PATHNAMES[firstIncompletePage]);
    }
  }, [firstIncompletePage, pathname, router]);
}

function getFirstIncompletePage({
  fields,
}: InstanceType<typeof VoterRegistrationForm>) {
  if (!ValidityUtils.isValid(fields.eligibility)) {
    return 0;
  }

  if (!ValidityUtils.isValid(fields.names)) {
    return 1;
  }

  if (!ValidityUtils.isValid(fields.addresses)) {
    return 2;
  }

  return 3;
}
