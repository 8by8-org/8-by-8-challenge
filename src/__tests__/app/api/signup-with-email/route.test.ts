import { POST } from '@/app/api/signup-with-email/route';
import { DummySecretKeys } from '@/constants/dummy-secret-keys';
import { UserType } from '@/model/enums/user-type';
import { NextRequest } from 'next/server';

describe('api/signup-with-email', () => {
  const { TURNSTILE_SECRET_KEY } = process.env;

  afterEach(() => {
    process.env.TURNSTILE_SECRET_KEY = TURNSTILE_SECRET_KEY;
  });

  it('returns a response with status 201.', async () => {
    const request = {
      json: async () => ({
        email: 'user@example.com',
        name: 'User',
        avatar: '1',
        type: UserType.Challenger,
        captchaToken: 'test-token',
      }),
    } as NextRequest;

    const response = await POST(request);
    expect(response.status).toBe(201);
    const json = await response.json();
    expect(json.message).toBe('User created successfully.');
  });

  it('returns a response with status 400 due to invalid token.', async () => {
    process.env.TURNSTILE_SECRET_KEY = DummySecretKeys.ALWAYS_BLOCKS;
    const request = {
      json: async () => ({
        email: 'user@example.com',
        name: 'User',
        avatar: '1',
        type: UserType.Challenger,
        captchaToken: 'test-token',
      }),
    } as NextRequest;

    const response = await POST(request);
    expect(response.status).toBe(401);
    const json = await response.json();
    expect(json.error).toBe('Token verification failed.');
  });

  it('returns a response with status 400 due to invalid schema.', async () => {
    const request = {
      json: async () => ({
        email: 'user@example.com',
        name: 'User',
        avatar: '1',
        type: UserType.Challenger,
      }),
    } as NextRequest;

    const response = await POST(request);
    expect(response.status).toBe(400);
  });
});
