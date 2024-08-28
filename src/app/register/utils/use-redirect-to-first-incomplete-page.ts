import { useLayoutEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { usePipe, ValidityUtils } from 'fully-formed';
import { VoterRegistrationPathNames } from '../constants/voter-registration-pathnames';
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
    const currentPageIndex = VoterRegistrationPathNames.getPathIndex(pathname);
    const firstIncompletePageIndex =
      VoterRegistrationPathNames.getPathIndex(firstIncompletePage);

    if (currentPageIndex > firstIncompletePageIndex) {
      router.push(firstIncompletePage);
    }
  }, [firstIncompletePage, pathname, router]);
}

function getFirstIncompletePage({
  fields,
}: InstanceType<typeof VoterRegistrationForm>) {
  if (!ValidityUtils.isValidOrCaution(fields.eligibility)) {
    return VoterRegistrationPathNames.ELIGIBILITY;
  }

  if (!ValidityUtils.isValidOrCaution(fields.names)) {
    return VoterRegistrationPathNames.NAMES;
  }

  if (!ValidityUtils.isValidOrCaution(fields.addresses)) {
    return VoterRegistrationPathNames.ADDRESSES;
  }

  return VoterRegistrationPathNames.OTHER_DETAILS;
}
