import { POST } from '@/app/api/signup-with-email/route';
import { serverContainer } from '@/services/server/container';
import { SERVER_SERVICE_KEYS } from '@/services/server/keys';
import { saveActualImplementation } from '@/utils/test/save-actual-implementation';
import { Builder } from 'builder-pattern';
import { NextRequest } from 'next/server';
import { UserType } from '@/model/enums/user-type';
import { ServerError } from '@/errors/server-error';
import type { Auth } from '@/services/server/auth/auth';
import type { CaptchaValidator } from '@/services/server/captcha-validator/captcha-validator';
import type { ICookies } from '@/services/server/cookies/i-cookies';

describe('POST', () => {
  const getActualService = saveActualImplementation(serverContainer, 'get');

  it(`calls Auth.signUpWithEmailAndSendOTP, sets a cookie to store the email to 
  which the OTP was sent and returns a response with a status code of 201 if 
  the user was successfully created.`, async () => {
    const email = 'user@example.com';
    const signUpWithEmailAndSendOTP = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    const setEmailForSignIn = jest.fn();

    const containerSpy = jest
      .spyOn(serverContainer, 'get')
      .mockImplementation(key => {
        if (key.name === SERVER_SERVICE_KEYS.Auth.name) {
          return Builder<Auth>()
            .signUpWithEmailAndSendOTP(signUpWithEmailAndSendOTP)
            .build();
        } else if (key.name === SERVER_SERVICE_KEYS.CaptchaValidator.name) {
          return Builder<CaptchaValidator>()
            .isHuman(() => Promise.resolve(true))
            .build();
        } else if (key.name === SERVER_SERVICE_KEYS.Cookies.name) {
          return Builder<ICookies>()
            .setEmailForSignIn(setEmailForSignIn)
            .build();
        } else return getActualService(key);
      });

    const request = new NextRequest(
      'https://challenge.8by8.us/sign-up-with-email',
      {
        method: 'POST',
        body: JSON.stringify({
          email,
          name: 'User',
          avatar: '0',
          type: UserType.Challenger,
          captchaToken: 'test-token',
        }),
      },
    );

    const response = await POST(request);
    expect(signUpWithEmailAndSendOTP).toHaveBeenCalledWith(
      email,
      'User',
      '0',
      UserType.Challenger,
    );
    expect(setEmailForSignIn).toHaveBeenCalledWith(email);
    expect(response.status).toBe(201);

    containerSpy.mockRestore();
  });

  it(`returns a response with a status code of 400 if the request body could 
  not be parsed.`, async () => {
    const containerSpy = jest
      .spyOn(serverContainer, 'get')
      .mockImplementation(key => {
        if (key.name === SERVER_SERVICE_KEYS.Auth.name) {
          return Builder<Auth>()
            .signUpWithEmailAndSendOTP(() => Promise.resolve())
            .build();
        } else if (key.name === SERVER_SERVICE_KEYS.CaptchaValidator.name) {
          return Builder<CaptchaValidator>()
            .isHuman(() => Promise.resolve(true))
            .build();
        } else if (key.name === SERVER_SERVICE_KEYS.Cookies.name) {
          return Builder<ICookies>().setEmailForSignIn(jest.fn()).build();
        } else return getActualService(key);
      });

    const request = new NextRequest(
      'https://challenge.8by8.us/sign-up-with-email',
      {
        method: 'POST',
        body: JSON.stringify({}),
      },
    );

    const response = await POST(request);
    expect(response.status).toBe(400);

    containerSpy.mockRestore();
  });

  it(`returns a response with a status code of 401 if the captcha token is 
  invalid.`, async () => {
    const containerSpy = jest
      .spyOn(serverContainer, 'get')
      .mockImplementation(key => {
        if (key.name === SERVER_SERVICE_KEYS.Auth.name) {
          return Builder<Auth>()
            .signUpWithEmailAndSendOTP(() => Promise.resolve())
            .build();
        } else if (key.name === SERVER_SERVICE_KEYS.CaptchaValidator.name) {
          return Builder<CaptchaValidator>()
            .isHuman(() => Promise.resolve(false))
            .build();
        } else if (key.name === SERVER_SERVICE_KEYS.Cookies.name) {
          return Builder<ICookies>().setEmailForSignIn(jest.fn()).build();
        } else return getActualService(key);
      });

    const request = new NextRequest(
      'https://challenge.8by8.us/sign-up-with-email',
      {
        method: 'POST',
        body: JSON.stringify({
          email: 'user@example.com',
          name: 'User',
          avatar: '0',
          type: UserType.Challenger,
          captchaToken: 'test-token',
        }),
      },
    );

    const response = await POST(request);
    expect(response.status).toBe(401);

    const responseBody = await response.json();
    expect(responseBody.error).toBe('Could not verify captcha token.');

    containerSpy.mockRestore();
  });

  it(`returns a response with a status code matching that of a ServerError 
  thrown by Auth.`, async () => {
    const containerSpy = jest
      .spyOn(serverContainer, 'get')
      .mockImplementation(key => {
        if (key.name === SERVER_SERVICE_KEYS.Auth.name) {
          return Builder<Auth>()
            .signUpWithEmailAndSendOTP(() => {
              throw new ServerError('User already exists.', 403);
            })
            .build();
        } else if (key.name === SERVER_SERVICE_KEYS.CaptchaValidator.name) {
          return Builder<CaptchaValidator>()
            .isHuman(() => Promise.resolve(true))
            .build();
        } else if (key.name === SERVER_SERVICE_KEYS.Cookies.name) {
          return Builder<ICookies>().setEmailForSignIn(jest.fn()).build();
        } else return getActualService(key);
      });

    const request = new NextRequest(
      'https://challenge.8by8.us/sign-up-with-email',
      {
        method: 'POST',
        body: JSON.stringify({
          email: 'user@example.com',
          name: 'User',
          avatar: '0',
          type: UserType.Challenger,
          captchaToken: 'test-token',
        }),
      },
    );

    const response = await POST(request);
    expect(response.status).toBe(403);

    const responseBody = await response.json();
    expect(responseBody.error).toBe('User already exists.');

    containerSpy.mockRestore();
  });
});
