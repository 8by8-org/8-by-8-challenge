import 'server-only';
import 'reflect-metadata';
import { Container } from 'inversify';
import { AbstractFirebaseAdminService } from './abstract-firebase-admin-service';
import { SERVER_SERVICE_KEYS } from './server-service-keys';
import { FirebaseAdminService } from './firebase-admin-service';
import { AbstractInviteCodeRepository } from './abstract-invite-code-repository';
import { FirebaseInviteCodeRepository } from './firebase-invite-code-repository';
import { AbstractUserRepository } from './abstract-user-repository';
import { FirebaseUserRepository } from './firebase-user-repository';
import { AbstractValidateCloudflareTurnstile } from './abstract-validate-cloudflare-turnstile';
import { ValidateCloudflareTurnstile } from './validate-cloudflare-turnstile';

const serverContainer = new Container();

serverContainer
  .bind<AbstractFirebaseAdminService>(SERVER_SERVICE_KEYS.FirebaseAdminService)
  .to(FirebaseAdminService);

serverContainer
  .bind<AbstractInviteCodeRepository>(SERVER_SERVICE_KEYS.InviteCodeRepository)
  .to(FirebaseInviteCodeRepository);

serverContainer
  .bind<AbstractUserRepository>(SERVER_SERVICE_KEYS.UserRepository)
  .to(FirebaseUserRepository);

serverContainer
  .bind<AbstractValidateCloudflareTurnstile>(
    SERVER_SERVICE_KEYS.CloudflareTurnstile,
  )
  .to(ValidateCloudflareTurnstile);

export { serverContainer };
