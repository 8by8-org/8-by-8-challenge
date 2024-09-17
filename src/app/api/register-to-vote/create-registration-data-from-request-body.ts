import { requestBodySchema } from './request-body-schema';
import type { z } from 'zod';
import type { RegistrationData } from '@/services/server/voter-registration-data-repository/voter-registration-data-repository';

export function createRegistrationDataFromRequestBody(
  body: z.infer<typeof requestBodySchema>,
): RegistrationData {
  const registrationData: Record<string, unknown> = {};

  const bodyToRegistrationDataKeyMappings = {
    idNumber: 'id_number',
    eighteenPlus: 'eighteen_plus',
    state: 'us_state',
  };

  for (let [key, value] of Object.entries(body)) {
    if (key in bodyToRegistrationDataKeyMappings) {
      key =
        bodyToRegistrationDataKeyMappings[
          key as keyof typeof bodyToRegistrationDataKeyMappings
        ];
    }

    registrationData[key] = value;
  }

  return registrationData as RegistrationData;
}
