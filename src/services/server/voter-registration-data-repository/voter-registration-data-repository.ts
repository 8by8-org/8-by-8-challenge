import { z } from 'zod';
import { requestBodySchema } from '@/app/api/register-to-vote/request-body-schema';

export type RegistrationData = Omit<
  z.infer<typeof requestBodySchema>,
  'eighteenPlus' | 'idNumber' | 'state'
> & {
  us_state: string;
  eighteen_plus: string;
  id_number: string;
};

export interface VoterRegistrationDataRepository {
  getVoterRegistrationDataByUserId(
    userId: string,
  ): Promise<RegistrationData | null>;
  insertVoterRegistrationData(
    userId: string,
    registrationData: RegistrationData,
  ): Promise<void>;
}
