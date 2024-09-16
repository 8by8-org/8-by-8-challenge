import { VoterRegistrationRepository } from '@/services/server/voter-registration-repository/voter-registration-repository';
import type { CreateSupabaseClient } from '@/services/server/create-supabase-client/create-supabase-client';
import { PRIVATE_ENVIRONMENT_VARIABLES } from '@/constants/private-environment-variables';
import { WebCryptoSubtleEncryptor } from '@/services/server/encryptor/web-crypto-subtle-encryptor';
import { SupabaseUserRepository } from '@/services/server/user-repository/supabase-user-repository';
import { resetAuthAndDatabase } from '@/utils/test/reset-auth-and-database';
import { SupabaseClient } from '@supabase/supabase-js';
import { ServerError } from '@/errors/server-error';
import {
  createSupabseClientFunction,
  createUserRepository,
  createUser,
} from '@/utils/test/create-user';

describe('VoterRegistrationRepository class', () => {
  let userRepository: InstanceType<typeof SupabaseUserRepository>;
  let createSupabaseClient: CreateSupabaseClient;
  let dataEncryptor = new WebCryptoSubtleEncryptor();
  let authChallenger: any;
  let supabase: SupabaseClient<any, 'public', any>;

  beforeEach(async () => {
    createSupabaseClient = createSupabseClientFunction();
    userRepository = createUserRepository(createSupabaseClient);
    supabase = createSupabaseClient();
    authChallenger = await createUser(supabase);
  });

  afterEach(() => {
    return resetAuthAndDatabase();
  });

  it('inserts encrypted register body onto supabase', async () => {
    const user = await userRepository.getUserById(authChallenger.id);
    if (!user) {
      throw new Error(`No user found with id: ${authChallenger.id}`);
    }

    const registerBody = {
      user_id: user.uid,
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

    const voterRegistrationRepository = new VoterRegistrationRepository(
      createSupabaseClient,
      dataEncryptor,
    );
    await voterRegistrationRepository.insertVoterRegistrationInfo(
      user.uid,
      registerBody,
    );

    const newUser = await userRepository.getUserById(user.uid);
    if (!newUser) {
      throw new Error(`No newUser found with id: ${user.uid}`);
    }

    const { data: dbUser, error } = await supabase
      .from('users')
      .select(
        `*,
      registration_information (user_id, us_state, city, street, name_first, name_last, dob, zip, email, citizen, eighteen_plus, party, id_number)`,
      )
      .eq('id', newUser.uid)
      .limit(1)
      .maybeSingle();

    if (error) {
      throw new ServerError(error.message, 500);
    }
    if (!dbUser) throw new Error('no user found');

    const decryptInformation = async (encryptedObject: typeof registerBody) => {
      const cryptoKey = await PRIVATE_ENVIRONMENT_VARIABLES.CRYPTO_KEY;

      const decryptedObject = { ...encryptedObject };
      for (const [key, value] of Object.entries(decryptedObject)) {
        if (key === 'user_id') {
          decryptedObject['user_id'] = encryptedObject['user_id'];
        } else {
          const typedKey = key as keyof typeof encryptedObject;
          const encryptedValueAsString = encryptedObject[typedKey];
          const decryptedValue = await dataEncryptor.decrypt(
            encryptedValueAsString,
            cryptoKey,
          );
          decryptedObject[typedKey] = decryptedValue;
        }
      }
      return decryptedObject;
    };

    const decryptedObject = await decryptInformation(
      dbUser.registration_information[0],
    );
    expect(decryptedObject).toEqual(registerBody);
  });

  it('throws server error when id is not valid', async () => {
    const user = await userRepository.getUserById(authChallenger.id);
    if (!user) {
      throw new Error(`No user found with id: ${authChallenger.id}`);
    }

    const registerBody = {
      user_id: user.uid,
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

    const voterRegistrationRepository = new VoterRegistrationRepository(
      createSupabaseClient,
      dataEncryptor,
    );
    await expect(
      voterRegistrationRepository.insertVoterRegistrationInfo('', registerBody),
    ).rejects.toThrow(
      new ServerError('invalid input syntax for type uuid: ""', 500),
    );
  });
});
