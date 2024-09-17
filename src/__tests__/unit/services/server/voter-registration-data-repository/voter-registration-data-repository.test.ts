import { SupabaseVoterRegistrationDataRepository } from '@/services/server/voter-registration-data-repository/supabase-voter-registration-data-repository';
import { WebCryptoSubtleEncryptor } from '@/services/server/encryptor/web-crypto-subtle-encryptor';
import { resetAuthAndDatabase } from '@/utils/test/reset-auth-and-database';
import { SupabaseUserRecordBuilder } from '@/utils/test/supabase-user-record-builder';
import { createSupabaseServiceRoleClient } from '@/services/server/create-supabase-client/create-supabase-service-role-client';
import { v4 as uuid } from 'uuid';
import type {
  RegistrationData,
  VoterRegistrationDataRepository,
} from '@/services/server/voter-registration-data-repository/voter-registration-data-repository';
import type { SupabaseClient } from '@supabase/supabase-js';
import { ServerError } from '@/errors/server-error';

describe('SupabaseVoterRegistrationDataRepository', () => {
  let voterRegistrationDataRepository: VoterRegistrationDataRepository;

  beforeEach(() => {
    voterRegistrationDataRepository =
      new SupabaseVoterRegistrationDataRepository(
        createSupabaseServiceRoleClient,
        new WebCryptoSubtleEncryptor(),
      );
  });

  afterEach(() => {
    return resetAuthAndDatabase();
  });

  it(`returns null when getVoterRegistrationDataByUserId is called but no 
  record is found.`, async () => {
    const data =
      await voterRegistrationDataRepository.getVoterRegistrationDataByUserId(
        uuid(),
      );
    expect(data).toBeNull();
  });

  it('encrypts the data it receives and stores it in the database.', async () => {
    const { uid: userId } = await new SupabaseUserRecordBuilder(
      'user@example.com',
    ).build();

    const registrationData: RegistrationData = {
      us_state: 'FL',
      city: 'Davie',
      street: '2161 SW 152 Ter',
      name_first: 'John',
      name_last: 'Doe',
      dob: '09/20/2003',
      zip: '33027',
      email: 'test@me.come',
      citizen: 'yes',
      eighteen_plus: 'yes',
      party: 'Democrat',
      id_number: '123',
    };

    await voterRegistrationDataRepository.insertVoterRegistrationData(
      userId,
      registrationData,
    );

    // Verify that data has been encrypted.
    const supabase = createSupabaseServiceRoleClient();
    const retrievedData = await supabase
      .from('registration_information')
      .select()
      .eq('user_id', userId)
      .limit(1)
      .maybeSingle();

    expect(retrievedData).not.toBeNull();

    for (const [key, value] of Object.entries(retrievedData)) {
      if (key in registrationData) {
        expect(value).not.toEqual(
          registrationData[key as keyof typeof registrationData],
        );
      }
    }

    const decryptedData =
      await voterRegistrationDataRepository.getVoterRegistrationDataByUserId(
        userId,
      );

    expect(decryptedData).toEqual(registrationData);
  });

  it('throws a ServerError if the data cannot be inserted.', async () => {
    const errorMessage = 'Failed to insert data.';
    const status = 422;

    const createSupabaseClient = () => {
      return {
        from: () => ({
          insert: () => {
            return {
              error: new Error(errorMessage),
              status,
            };
          },
        }),
      } as unknown as SupabaseClient;
    };

    voterRegistrationDataRepository =
      new SupabaseVoterRegistrationDataRepository(
        createSupabaseClient,
        new WebCryptoSubtleEncryptor(),
      );

    await expect(
      voterRegistrationDataRepository.insertVoterRegistrationData(uuid(), {
        us_state: 'FL',
        city: 'Davie',
        street: '2161 SW 152 Ter',
        name_first: 'John',
        name_last: 'Doe',
        dob: '09/20/2003',
        zip: '33027',
        email: 'test@me.come',
        citizen: 'yes',
        eighteen_plus: 'yes',
        party: 'Democrat',
        id_number: '123',
      }),
    ).rejects.toThrow(new ServerError(errorMessage, status));
  });
});
