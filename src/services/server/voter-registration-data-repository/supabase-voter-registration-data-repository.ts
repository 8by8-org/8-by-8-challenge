import 'server-only';
import {
  VoterRegistrationDataRepository,
  RegistrationData,
} from './voter-registration-data-repository';
import { ServerError } from '@/errors/server-error';
import { SERVER_SERVICE_KEYS } from '../keys';
import { inject } from 'undecorated-di';
import { Encryptor } from '../encryptor/encryptor';
import { PRIVATE_ENVIRONMENT_VARIABLES } from '@/constants/private-environment-variables';
import type { CreateSupabaseClient } from '../create-supabase-client/create-supabase-client';

export const SupabaseVoterRegistrationDataRepository = inject(
  /**
   * handles voter registration proccess
   * @example
   */
  class SupabaseVoterRegistrationDataRepository
    implements VoterRegistrationDataRepository
  {
    constructor(
      private createSupabaseClient: CreateSupabaseClient,
      private encryptor: Encryptor,
    ) {}

    /**
     * Retrieves a row from the registration_information table and decrypts it
     * if it is not null.
     *
     * @param userId - The user_id by which to query the database.
     */
    async getVoterRegistrationDataByUserId(
      userId: string,
    ): Promise<RegistrationData | null> {
      const supabase = this.createSupabaseClient();
      const { data } = await supabase
        .from('registration_information')
        .select()
        .eq('user_id', userId)
        .limit(1)
        .maybeSingle();

      if (!data) return null;

      return await this.decryptRegistrationData(data);
    }

    /**
     * @param registrationData - Voter registration information to insert
     */
    async insertVoterRegistrationData(
      userId: string,
      registrationData: RegistrationData,
    ): Promise<void> {
      const supabase = this.createSupabaseClient();
      const encryptedRegisterBody =
        await this.encryptRegistrationData(registrationData);

      const { error, status } = await supabase
        .from('registration_information')
        .insert({ ...encryptedRegisterBody, user_id: userId });

      if (error) {
        throw new ServerError(error.message, status);
      }
    }

    private async encryptRegistrationData(
      registrationData: RegistrationData,
    ): Promise<RegistrationData> {
      const cryptoKey =
        await PRIVATE_ENVIRONMENT_VARIABLES.VOTER_REGISTRATION_REPO_ENCRYPTION_KEY;

      const encryptedObject = { ...registrationData };

      for (const [key, value] of Object.entries(encryptedObject)) {
        const typedKey = key as keyof typeof encryptedObject;
        const encryptedValue = await this.encryptor.encrypt(value, cryptoKey);
        encryptedObject[typedKey] = encryptedValue;
      }

      return encryptedObject;
    }

    private async decryptRegistrationData(
      encryptedData: Record<string, unknown>,
    ) {
      const cryptoKey =
        await PRIVATE_ENVIRONMENT_VARIABLES.VOTER_REGISTRATION_REPO_ENCRYPTION_KEY;

      const decryptedData: Record<string, unknown> = {};

      await Promise.all(
        Object.entries(encryptedData)
          .filter(([key, value]) => {
            return (
              key !== 'id' && key !== 'user_id' && typeof value === 'string'
            );
          })
          .map(([key, value]) => {
            return new Promise<void>(async resolve => {
              const decrypted = await this.encryptor.decrypt(
                value as string,
                cryptoKey,
              );

              decryptedData[key] = decrypted;

              resolve();
            });
          }),
      );

      return decryptedData as RegistrationData;
    }
  },
  [
    SERVER_SERVICE_KEYS.createSupabaseServiceRoleClient,
    SERVER_SERVICE_KEYS.Encryptor,
  ],
);
