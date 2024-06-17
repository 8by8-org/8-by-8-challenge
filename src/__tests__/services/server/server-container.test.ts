import { serverContainer } from '@/services/server/server-container';
import { SERVER_SERVICE_KEYS } from '@/services/server/server-service-keys';
import { AbstractFirebaseAdminService } from '@/services/server/abstract-firebase-admin-service';
import { AbstractUserRepository } from '@/services/server/abstract-user-repository';
import { AbstractInviteCodeRepository } from '@/services/server/abstract-invite-code-repository';
import { AbstractValidateCloudflareTurnstile } from '@/services/server/abstract-validate-cloudflare-turnstile';

describe('serverContainer', () => {
  it('provides an instance of AbstractFirebaseAdminService.', () => {
    const firebaseAdminService =
      serverContainer.get<AbstractFirebaseAdminService>(
        SERVER_SERVICE_KEYS.FirebaseAdminService,
      );
    expect(firebaseAdminService).toBeInstanceOf(AbstractFirebaseAdminService);
  });

  it('provides an instance of AbstractUserRepository.', () => {
    const userRepo = serverContainer.get<AbstractUserRepository>(
      SERVER_SERVICE_KEYS.UserRepository,
    );
    expect(userRepo).toBeInstanceOf(AbstractUserRepository);
  });

  it('provides an instance of AbstractInviteCodeRepository.', () => {
    const inviteCodeRepo = serverContainer.get<AbstractInviteCodeRepository>(
      SERVER_SERVICE_KEYS.InviteCodeRepository,
    );
    expect(inviteCodeRepo).toBeInstanceOf(AbstractInviteCodeRepository);
  });

  it('provides an instance of AbstractValidateCloudflareTurnstile.', () => {
    const cloudflareTurnstile =
      serverContainer.get<AbstractValidateCloudflareTurnstile>(
        SERVER_SERVICE_KEYS.CloudflareTurnstile,
      );
    expect(cloudflareTurnstile).toBeInstanceOf(
      AbstractValidateCloudflareTurnstile,
    );
  });
});
