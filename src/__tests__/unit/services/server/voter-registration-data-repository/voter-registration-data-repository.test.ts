import { SupabaseVoterRegistrationDataRepository } from '@/services/server/voter-registration-data-repository/supabase-voter-registration-data-repository';
import { WebCryptoSubtleEncryptor } from '@/services/server/encryptor/web-crypto-subtle-encryptor';
import { resetAuthAndDatabase } from '@/utils/test/reset-auth-and-database';
import { SupabaseUserRecordBuilder } from '@/utils/test/supabase-user-record-builder';
import { createSupabaseServiceRoleClient } from '@/services/server/create-supabase-client/create-supabase-service-role-client';
import { v4 as uuid } from 'uuid';
import { ServerError } from '@/errors/server-error';
import type { VoterRegistrationDataRepository } from '@/services/server/voter-registration-data-repository/voter-registration-data-repository';
import type { SupabaseClient } from '@supabase/supabase-js';

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

  it('encrypts the data it receives and stores it in the database.', async () => {
    const { uid: userId } = await new SupabaseUserRecordBuilder(
      'user@example.com',
    ).build();

    const pdfUrl = 'test';

    await voterRegistrationDataRepository.savePDFUrl(userId, pdfUrl);

    // Verify that data has been encrypted.
    const supabase = createSupabaseServiceRoleClient();
    const { data } = await supabase
      .from('registration_information')
      .select('pdf_url')
      .eq('user_id', userId)
      .limit(1)
      .maybeSingle();

    expect(data).not.toBeNull();
    expect(data!.pdf_url).toEqual(expect.any(String));
    expect(data!.pdf_url.length).toBeGreaterThan(0);
    expect(data!.pdf_url).not.toBe(pdfUrl);

    const decryptedData =
      await voterRegistrationDataRepository.getPDFUrlByUserId(userId);

    expect(decryptedData).toBe(pdfUrl);
  });

  it(`returns an empty string when getPDFUrlByUserId is called but no record is 
  found.`, async () => {
    const data =
      await voterRegistrationDataRepository.getPDFUrlByUserId(uuid());
    expect(data).toBe('');
  });

  it(`throws a ServerError if an error is returned when selecting data from the 
  registration_information table.`, async () => {
    const errorMessage = 'Too many requests.';
    const status = 429;

    const createSupabaseClient = () => {
      return {
        from: () => ({
          select: () => ({
            eq: () => ({
              limit: () => ({
                maybeSingle: () => {
                  return Promise.resolve({
                    error: new Error(errorMessage),
                    status,
                  });
                },
              }),
            }),
          }),
        }),
      } as unknown as SupabaseClient;
    };

    voterRegistrationDataRepository =
      new SupabaseVoterRegistrationDataRepository(
        createSupabaseClient,
        new WebCryptoSubtleEncryptor(),
      );

    await expect(
      voterRegistrationDataRepository.getPDFUrlByUserId(uuid()),
    ).rejects.toThrow(new ServerError(errorMessage, status));
  });

  it(`throws a ServerError if an error if it fails to decrypt the data`, async () => {
    const createSupabaseClient = () => {
      return {
        from: () => ({
          select: () => ({
            eq: () => ({
              limit: () => ({
                maybeSingle: () => {
                  return Promise.resolve({
                    data: {
                      pdf_url: 'not encrypted',
                    },
                  });
                },
              }),
            }),
          }),
        }),
      } as unknown as SupabaseClient;
    };

    voterRegistrationDataRepository =
      new SupabaseVoterRegistrationDataRepository(
        createSupabaseClient,
        new WebCryptoSubtleEncryptor(),
      );

    await expect(
      voterRegistrationDataRepository.getPDFUrlByUserId(uuid()),
    ).rejects.toThrow(new ServerError('Could not decrypt PDF URL.', 400));
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
      voterRegistrationDataRepository.savePDFUrl(uuid(), 'test'),
    ).rejects.toThrow(new ServerError(errorMessage, status));
  });
});
