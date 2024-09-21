import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { HomeAddressForm } from '../home-address/home-address-form';
import { ValidityUtils } from 'fully-formed';
import { VoterRegistrationPathnames } from '../../constants/voter-registration-pathnames';

/**
 * Prefetches the JavaScript for the other details page when the value of the
 * state field changes.
 *
 * This ensures that the correct political party options are rendered by the
 * other details page while preventing a flicker when the user advances to
 * the page.
 *
 * @param homeAddressForm - An instance of {@link HomeAddressForm}.
 */
export function usePrefetchOtherDetailsWithState(
  homeAddressForm: InstanceType<typeof HomeAddressForm>,
) {
  const router = useRouter();

  useEffect(() => {
    if (ValidityUtils.isValidOrCaution(homeAddressForm.fields.state)) {
      router.prefetch(
        VoterRegistrationPathnames.OTHER_DETAILS +
          `?state=${homeAddressForm.state.value.state}`,
      );
    }

    const usStateSubscription = homeAddressForm.fields.state.subscribeToState(
      ({ value, validity, didPropertyChange }) => {
        if (
          ValidityUtils.isValidOrCaution(validity) &&
          didPropertyChange('value')
        ) {
          router.prefetch(
            VoterRegistrationPathnames.OTHER_DETAILS + `?state=${value}`,
          );
        }
      },
    );

    return () => {
      usStateSubscription.unsubscribe();
    };
  }, [homeAddressForm, router]);
}
