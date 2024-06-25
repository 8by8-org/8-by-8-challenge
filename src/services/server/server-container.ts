import 'server-only';
import 'reflect-metadata';
import { Container } from 'inversify';
import { SERVER_SERVICE_KEYS } from './server-service-keys';
import { AbstractCAPTCHATokenValidator } from './abstract-captcha-token-validator';
import { CloudflareTurnstileTokenValidator } from './cloudflare-turnstile-token-validator';

const serverContainer = new Container();

serverContainer
  .bind<AbstractCAPTCHATokenValidator>(
    SERVER_SERVICE_KEYS.CAPTCHATokenValidator,
  )
  .to(CloudflareTurnstileTokenValidator);

export { serverContainer };
