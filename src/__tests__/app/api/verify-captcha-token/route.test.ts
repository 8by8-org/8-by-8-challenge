import { POST } from '@/app/api/verify-captcha-token/route';
import { DummySecretKeys } from '@/constants/dummy-secret-keys';
import type { NextRequest } from 'next/server';

describe('api/signup-with-email', () => {
  const { TURNSTILE_SECRET_KEY } = process.env;

  afterEach(() => {
    process.env.TURNSTILE_SECRET_KEY = TURNSTILE_SECRET_KEY;
  });

  it(`returns a response with status 400 if the body does not include a 
  token.`, async () => {
    const request = {
      json: async () => ({}),
    } as NextRequest;

    const response = await POST(request);
    expect(response.ok).toBe(false);
    expect(response.status).toBe(400);
  });

  it(`returns a response with status 200 if the captchaToken is 
  valid.`, async () => {
    process.env.TURNSTILE_SECRET_KEY = DummySecretKeys.ALWAYS_PASSES;

    const request = {
      json: async () => ({
        captchaToken: 'test-token',
      }),
    } as NextRequest;

    const response = await POST(request);
    expect(response.ok).toBe(true);
    expect(response.status).toBe(200);
  });

  it(`returns a response with status 401 if the token cannot be 
  verified.`, async () => {
    process.env.TURNSTILE_SECRET_KEY = DummySecretKeys.ALWAYS_BLOCKS;

    const request = {
      json: async () => ({
        captchaToken: 'test-token',
      }),
    } as NextRequest;

    const response = await POST(request);
    expect(response.ok).toBe(false);
    expect(response.status).toBe(401);
  });

  it(`returns a response with status 401 if the token has already been 
  spent.`, async () => {
    process.env.TURNSTILE_SECRET_KEY = DummySecretKeys.ALREADY_SPENT;

    const request = {
      json: async () => ({
        captchaToken: 'test-token',
      }),
    } as NextRequest;

    const response = await POST(request);
    expect(response.ok).toBe(false);
    expect(response.status).toBe(401);
  });
});
