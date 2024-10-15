import { readCookie } from '@/utils/client/read-cookie';

describe('readCookie', () => {
  let setCookieSpy: any;
  let getCookiesSpy: any;
  let cookies = '';

  beforeAll(() => {
    setCookieSpy = jest
      .spyOn(document, 'cookie', 'set')
      .mockImplementation(cookie => {
        if (cookie.includes(';')) {
          cookies += cookie.slice(0, cookie.indexOf(';') + 1);
        } else {
          cookies += cookie + ';';
        }
      });

    getCookiesSpy = jest
      .spyOn(document, 'cookie', 'get')
      .mockImplementation(() => {
        return cookies;
      });
  });

  afterEach(() => {
    cookies = '';
  });

  afterAll(() => {
    setCookieSpy.mockRestore();
    getCookiesSpy.mockRestore();
  });

  it('returns the value of a cookie if one with the provided name is found.', () => {
    document.cookie = 'name=oeschger; SameSite=None; Secure';
    document.cookie = 'favorite_food=tripe; SameSite=None; Secure';
    expect(readCookie('favorite_food')).toBe('tripe');
  });

  it('returns an empty string if no cookie with the provided name is found.', () => {
    expect(readCookie('favorite_food')).toBe('');
  });
});
