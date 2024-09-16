import 'server-only';
import { VoterRepository, RegisterBody } from './voter-registration';
import { ServerError } from '@/errors/server-error';
import { SERVER_SERVICE_KEYS } from '../keys';
import { inject } from 'undecorated-di';
import { Encryptor } from '../encryptor/encryptor';
import type { CreateSupabaseClient } from '../create-supabase-client/create-supabase-client';
import { PRIVATE_ENVIRONMENT_VARIABLES } from '@/constants/private-environment-variables';

export const VoterRegistrationRepository = inject(
  /**
   * handles voter registration proccess
   * @example
   */
  class SupabaseVoterRepository implements VoterRepository {
    constructor(
      private createSupabaseClient: CreateSupabaseClient,
      private encryptor: Encryptor,
      private shouldEncrypt = (key: string): boolean => {
        return key !== 'user_id';
      },
    ) {}
    /**
     * @insertVoterRegistrationInfo
     * @param RegisterBody - Voter registration information to insert
     */
    async insertVoterRegistrationInfo(
      id: string,
      RegisterBody: RegisterBody,
    ): Promise<void> {
      const encryptor = this.encryptor;

      //helper function that encrypts the register body
      const encryptRegisterBody = async (
        obj: typeof RegisterBody,
      ): Promise<typeof RegisterBody> => {
        const cryptoKey = await PRIVATE_ENVIRONMENT_VARIABLES.CRYPTO_KEY;

        const encryptedObject = { ...obj };
        for (const [key, value] of Object.entries(encryptedObject)) {
          if (this.shouldEncrypt(key)) {
            const typedKey = key as keyof typeof encryptedObject;
            const encryptedValue = await encryptor.encrypt(value, cryptoKey);
            encryptedObject[typedKey] = encryptedValue;
          } else {
            encryptedObject['user_id'] = id;
          }
        }
        return encryptedObject;
      };

      const encryptedRegisterBody = await encryptRegisterBody(RegisterBody);
      const supabase = this.createSupabaseClient();

      const { error } = await supabase
        .from('registration_information')
        .insert(encryptedRegisterBody)
        .eq('user_id', id);
      if (error) {
        throw new ServerError(error.message, 500);
      }
    }
  },
  [
    SERVER_SERVICE_KEYS.createSupabaseServiceRoleClient,
    SERVER_SERVICE_KEYS.Encryptor,
  ],
);
