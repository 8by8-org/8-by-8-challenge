import { POST } from '@/app/api/resend-otp-to-email/route';
import { NextRequest } from 'next/server';

describe('POST', () => {
  it(`returns a response with a status code of 400 if the request cannot be 
  parsed.`, async () => {
    const request = new NextRequest(
      'https://challenge.8by8.us/api/resend-otp-to-email',
      {
        method: 'POST',
        body: JSON.stringify({}),
      },
    );

    const response = await POST(request);
    expect(response.status).toBe(400);
  });
});
