import { FirebaseInviteCodeRepository } from '@/services/server/firebase-invite-code-repository';
import { FirebaseAdminService } from '@/services/server/firebase-admin-service';
import { createId, isCuid } from '@paralleldrive/cuid2';
import { resetFirestore } from '@/../__mocks__/firebase-admin/firestore';

describe('FirebaseInviteCodeRepository', () => {
  let firebaseInviteCodeRepository: FirebaseInviteCodeRepository;
  let firebaseAdminService: FirebaseAdminService;

  beforeEach(() => {
    firebaseAdminService = new FirebaseAdminService();
    firebaseInviteCodeRepository = new FirebaseInviteCodeRepository(
      firebaseAdminService,
    );
  });

  afterEach(() => {
    resetFirestore();
  });

  it('creates a new invite code.', async () => {
    const inviteCode =
      await firebaseInviteCodeRepository.createInviteCodeWithUserId('0');
    expect(isCuid(inviteCode)).toBe(true);
  });

  it(`returns a user id when getUserIdFromInviteCode() is called with an 
  invite code that exists in the database.`, async () => {
    const userId = createId();
    const inviteCode =
      await firebaseInviteCodeRepository.createInviteCodeWithUserId(userId);
    const retrievedUserId =
      await firebaseInviteCodeRepository.getUserIdFromInviteCode(inviteCode);
    expect(retrievedUserId).toBe(userId);
  });

  it(`throws an error if getUserIdFromInviteCode() is called with an invite 
  code that does not exist in the database.`, () => {
    expect(
      async () =>
        await firebaseInviteCodeRepository.getUserIdFromInviteCode(createId()),
    ).rejects.toThrow();
  });
});
