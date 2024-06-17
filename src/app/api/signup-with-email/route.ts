import { z } from 'zod';
import { UserType } from '@/model/enums/user-type';
import { serverContainer } from '@/services/server/server-container';
import { AbstractUserRepository } from '@/services/server/abstract-user-repository';
import { SERVER_SERVICE_KEYS } from '@/services/server/server-service-keys';
import { NextResponse, NextRequest } from 'next/server';
import { AbstractValidateCloudflareTurnstile } from '@/services/server/abstract-validate-cloudflare-turnstile';

const SignupSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1, 'Must provide a name'),
  avatar: z.enum(['0', '1', '2', '3']),
  type: z.nativeEnum(UserType),
  turnstileToken: z.string().min(1, 'Must provide a token'),
});

/**
 * Handles the POST request for user signup.
 *
 * @param req - The Next.js request object
 *
 * @returns A Next.js response indicating the result
 *
 * @remarks
 * This route performs the following
 * 1. Parses and validates the request body against 'SignupSchema'
 * 2. Verifies the Cloudflare Turnstile token
 * 3. Creates a new user
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    const data = SignupSchema.parse(body);

    const validateTurnstile =
      serverContainer.get<AbstractValidateCloudflareTurnstile>(
        SERVER_SERVICE_KEYS.CloudflareTurnstile,
      );
    const isValidToken = await validateTurnstile.verifyToken(data);

    if (!isValidToken) {
      return NextResponse.json(
        { error: 'Token verification failed' },
        { status: 400 },
      );
    }

    const userRepository = serverContainer.get<AbstractUserRepository>(
      SERVER_SERVICE_KEYS.UserRepository,
    );
    await userRepository.createUserWithEmail(data);

    return NextResponse.json(
      { message: 'User created successfully' },
      { status: 201 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Error: ' + error.message },
      { status: 400 },
    );
  }
}
