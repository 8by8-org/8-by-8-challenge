import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { HomeAddressForm } from '../home-address/home-address-form';
import { ValidityUtils } from 'fully-formed';
import { VoterRegistrationPathnames } from '../../constants/voter-registration-pathnames';

/**
 * Prefetches the JavaScript for the other details page when the value of either
 * the state field of the home address form or the zip field of the same form
 * changes and the form is not invalid.
 *
 * This ensures that the correct political party options are rendered by the
 * other details page while preventing a flicker when the user advances to
 * the page.
 *
 * @param homeAddressForm - An instance of {@link HomeAddressForm}.
 */
export function usePrefetchOtherDetailsWithStateAndZip(
  homeAddressForm: InstanceType<typeof HomeAddressForm>,
) {
  const router = useRouter();

  useEffect(() => {
    if (
      ValidityUtils.isValidOrCaution(homeAddressForm.fields.state) &&
      ValidityUtils.isValidOrCaution(homeAddressForm.fields.zip)
    ) {
      router.prefetch(
        VoterRegistrationPathnames.OTHER_DETAILS +
          `?state=${homeAddressForm.state.value.state}&zip=${homeAddressForm.state.value.zip}`,
      );
    }

    const usStateSubscription = homeAddressForm.fields.state.subscribeToState(
      ({ value, validity, didPropertyChange }) => {
        if (
          ValidityUtils.isValidOrCaution(validity) &&
          ValidityUtils.isValidOrCaution(homeAddressForm.fields.zip) &&
          didPropertyChange('value')
        ) {
          router.prefetch(
            VoterRegistrationPathnames.OTHER_DETAILS +
              `?state=${value}&zip=${homeAddressForm.state.value.zip}`,
          );
        }
      },
    );

    const zipSubscription = homeAddressForm.fields.zip.subscribeToState(
      ({ value, validity, didPropertyChange }) => {
        if (
          ValidityUtils.isValidOrCaution(validity) &&
          ValidityUtils.isValidOrCaution(homeAddressForm.fields.state) &&
          didPropertyChange('value')
        ) {
          router.prefetch(
            VoterRegistrationPathnames.OTHER_DETAILS +
              `?state=${homeAddressForm.state.value.state}&zip=${value}`,
          );
        }
      },
    );

    return () => {
      usStateSubscription.unsubscribe();
      zipSubscription.unsubscribe();
    };
  }, [homeAddressForm, router]);
}
