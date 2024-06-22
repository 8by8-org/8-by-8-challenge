import { serverContainer } from '@/services/server/server-container';
import { SERVER_SERVICE_KEYS } from '@/services/server/server-service-keys';
import { AbstractUserRepository } from '@/services/server/abstract-user-repository';
import { AbstractInviteCodeRepository } from '@/services/server/abstract-invite-code-repository';
import { AbstractCAPTCHATokenValidator } from '@/services/server/abstract-captcha-token-validator';

describe('serverContainer', () => {
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
      serverContainer.get<AbstractCAPTCHATokenValidator>(
        SERVER_SERVICE_KEYS.CAPTCHATokenValidator,
      );
    expect(cloudflareTurnstile).toBeInstanceOf(AbstractCAPTCHATokenValidator);
  });
});
