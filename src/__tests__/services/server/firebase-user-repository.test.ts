import { FirebaseUserRepository } from '@/services/server/firebase-user-repository';
import { FirebaseInviteCodeRepository } from '@/services/server/firebase-invite-code-repository';
import { FirebaseAdminService } from '@/services/server/firebase-admin-service';
import { UserType } from '@/model/enums/user-type';
import { calculateDaysRemaining } from '@/utils/progress/calculate-days-remaining';
import { resetAuth } from '@/../__mocks__/firebase-admin/auth';
import { resetFirestore } from '@/../__mocks__/firebase-admin/firestore';
import type { User } from '@/model/types/user';

describe('FirebaseUserRepository', () => {
  let firebaseUserRepository: FirebaseUserRepository;
  let firebaseAdminService: FirebaseAdminService;

  beforeEach(() => {
    firebaseAdminService = new FirebaseAdminService();
    firebaseUserRepository = new FirebaseUserRepository(
      firebaseAdminService,
      new FirebaseInviteCodeRepository(firebaseAdminService),
    );
  });

  afterEach(() => {
    resetAuth();
    resetFirestore();
  });

  it('creates a new user in the database.', async () => {
    const email = 'user@example.com';

    await firebaseUserRepository.createUserWithEmail({
      email,
      name: 'user',
      avatar: '0',
      type: UserType.Challenger,
    });

    const authUser = await firebaseAdminService.auth.getUserByEmail(email);
    const appUserRef = await firebaseAdminService.firestore
      .collection('users')
      .doc(authUser.uid)
      .get();
    const appUser = appUserRef.data() as User;

    expect(authUser.email).toBe(email);

    expect(appUser).toStrictEqual({
      uid: '0',
      email,
      name: 'user',
      type: UserType.Challenger,
      avatar: '0',
      badges: [],
      completedActions: {
        sharedChallenge: false,
        electionReminders: false,
        registerToVote: false,
      },
      challengeEndTimestamp: expect.any(Number),
      completedChallenge: false,
      redeemedAward: false,
      contributedTo: [],
      inviteCode: expect.any(String),
    });
  });

  it('creates a user whose challengeEndTimestamp is 8 days from now.', async () => {
    const email = 'user@example.com';

    await firebaseUserRepository.createUserWithEmail({
      email,
      name: 'user',
      avatar: '0',
      type: UserType.Challenger,
    });

    const authUser = await firebaseAdminService.auth.getUserByEmail(email);
    const appUserRef = await firebaseAdminService.firestore
      .collection('users')
      .doc(authUser.uid)
      .get();
    const appUser = appUserRef.data() as User;

    expect(calculateDaysRemaining(appUser)).toBe(8);
  });

  it('throws an error if a user with the provided email already exists.', async () => {
    const email = 'user@example.com';

    await firebaseUserRepository.createUserWithEmail({
      email,
      name: 'user',
      avatar: '0',
      type: UserType.Challenger,
    });

    expect(
      async () =>
        await firebaseUserRepository.createUserWithEmail({
          email,
          name: 'user',
          avatar: '0',
          type: UserType.Challenger,
        }),
    ).rejects.toThrow();
  });
});
