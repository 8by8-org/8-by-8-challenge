import { z } from 'zod';
import { supabaseRegisterBodySchema } from '@/app/api/register-to-vote/register-body-schema';

export type RegisterBody = z.infer<typeof supabaseRegisterBodySchema>;

export interface VoterRepository {
  insertVoterRegistrationInfo(
    id: string,
    encryptedRegisterBody: RegisterBody,
  ): Promise<void>;
}
