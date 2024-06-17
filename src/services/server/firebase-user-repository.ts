import 'server-only';
import { injectable, inject } from 'inversify';
import { DateTime } from 'luxon';
import {
  AbstractUserRepository,
  CreateUserWithEmailParams,
} from './abstract-user-repository';
import { SERVER_SERVICE_KEYS } from './server-service-keys';
import type { AbstractFirebaseAdminService } from './abstract-firebase-admin-service';
import type { AbstractInviteCodeRepository } from './abstract-invite-code-repository';
import type { User } from '@/model/types/user';

/**
 * An implementation of {@link AbstractUserRepository} that persists data in
 * a Firebase Firestore database.
 */
@injectable()
export class FirebaseUserRepository extends AbstractUserRepository {
  public constructor(
    @inject(SERVER_SERVICE_KEYS.FirebaseAdminService)
    private firebaseAdmin: AbstractFirebaseAdminService,
    @inject(SERVER_SERVICE_KEYS.InviteCodeRepository)
    private inviteCodeRepository: AbstractInviteCodeRepository,
  ) {
    super();
  }

  public async createUserWithEmail({
    email,
    name,
    avatar,
    type,
  }: CreateUserWithEmailParams): Promise<void> {
    const { uid } = await this.firebaseAdmin.auth.createUser({ email });
    const inviteCode =
      await this.inviteCodeRepository.createInviteCodeWithUserId(uid);
    const user: User = {
      uid,
      email,
      name,
      type,
      avatar,
      badges: [],
      completedActions: {
        sharedChallenge: false,
        electionReminders: false,
        registerToVote: false,
      },
      challengeEndTimestamp: DateTime.now().plus({ days: 8 }).toUnixInteger(),
      completedChallenge: false,
      redeemedAward: false,
      contributedTo: [],
      inviteCode: inviteCode,
    };

    await this.firebaseAdmin.firestore.collection('users').doc(uid).set(user);
  }
} /* istanbul ignore next */ // Ignore the branch created when decorated constructor params are compiled
