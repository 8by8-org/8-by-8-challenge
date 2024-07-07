import { POST } from '@/app/api/verify-captcha-token/route';
import { Builder } from 'builder-pattern';
import { NextRequest } from 'next/server';
import * as isHumanModule from '@/utils/server/is-human';

/*
  Mock the module containing isHuman in order to make isHuman configurable 
  and enable it to be spied on.
*/
jest.mock('@/utils/server/is-human', () => {
  return {
    __esModule: true,
    ...jest.requireActual('@/utils/server/is-human'),
  };
});

describe('/api/verify-captcha-token', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it(`returns a response with a status code of 400 if there is a problem 
  parsing request as json.`, async () => {
    const request = Builder<NextRequest>()
      .json(() => {
        throw new Error('Malformed request body.');
      })
      .build();

    const response = await POST(request);

    expect(response.status).toBe(400);
  });

  it(`returns a response with a status code of 400 if the request body does 
  not include a captchaToken.`, async () => {
    const request = Builder<NextRequest>()
      .json(() => {
        return Promise.resolve({});
      })
      .build();

    const response = await POST(request);

    expect(response.status).toBe(400);
  });

  it(`returns a response with a status code of 400 if the request body includes 
  a captchaToken that is not of type string.`, async () => {
    const request = Builder<NextRequest>()
      .json(() => {
        return Promise.resolve({
          captchaToken: 12345,
        });
      })
      .build();

    const response = await POST(request);

    expect(response.status).toBe(400);
  });

  it(`returns a response with a status code of 400 if isHuman throws an 
  error.`, async () => {
    jest.spyOn(isHumanModule, 'isHuman').mockImplementationOnce(() => {
      throw new Error('Error thrown by isHuman.');
    });

    const request = Builder<NextRequest>()
      .json(() => {
        return Promise.resolve({
          captchaToken: 'test-token',
        });
      })
      .build();

    const response = await POST(request);

    expect(response.status).toBe(400);
  });

  it(`returns a response with a status code of 401 if isHuman returns 
  false.`, async () => {
    jest.spyOn(isHumanModule, 'isHuman').mockImplementationOnce(() => {
      return Promise.resolve(false);
    });

    const request = Builder<NextRequest>()
      .json(() => {
        return Promise.resolve({
          captchaToken: 'test-token',
        });
      })
      .build();

    const response = await POST(request);

    expect(response.status).toBe(401);
  });

  it(`returns a response with a status code of 200 if isHuman returns 
  true.`, async () => {
    jest.spyOn(isHumanModule, 'isHuman').mockImplementationOnce(() => {
      return Promise.resolve(true);
    });

    const request = Builder<NextRequest>()
      .json(() => {
        return Promise.resolve({
          captchaToken: 'test-token',
        });
      })
      .build();

    const response = await POST(request);

    expect(response.status).toBe(200);
  });
});
