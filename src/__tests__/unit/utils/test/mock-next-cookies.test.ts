import { MockNextCookies } from '@/utils/test/mock-next-cookies';

describe('MockNextCookies', () => {
  let mockCookies: ReturnType<MockNextCookies['cookies']>;

  beforeEach(() => {
    mockCookies = new MockNextCookies().cookies();
  });

  it('sets a cookie.', () => {
    mockCookies.set('test-cookie', 'test-value');

    expect(mockCookies.get('test-cookie')).toEqual({
      name: 'test-cookie',
      value: 'test-value',
    });
  });

  it('returns true when has() is called with a cookie that has been set.', () => {
    mockCookies.set('test-cookie', 'test-value');
    expect(mockCookies.has('test-cookie')).toBe(true);
  });

  it('returns false when has() is called with a cookie that has not been set.', () => {
    expect(mockCookies.has('test-cookie')).toBe(false);
  });

  it(`deletes multiple cookies when an array of cookie names is passed into 
  delete().`, () => {
    const cookies = Array.from(
      (function* () {
        for (let i = 0; i < 10; i++) {
          yield [`cookie-${i}`, `value-${i}`] as [string, string];
        }
      })(),
    );

    for (const cookie of cookies) {
      mockCookies.set(...cookie);
    }

    expect(mockCookies.size).toBe(10);

    const cookiesToDelete = cookies.slice(0, 5).map(([name]) => name);

    mockCookies.delete(cookiesToDelete);

    expect(mockCookies.size).toBe(5);
    expect(mockCookies.getAll()).toStrictEqual(
      cookies.slice(5).map(([name, value]) => ({ name, value })),
    );
  });

  it('is iterable.', () => {
    const cookies = Array.from(
      (function* () {
        for (let i = 0; i < 10; i++) {
          yield [`cookie-${i}`, `value-${i}`] as [string, string];
        }
      })(),
    );

    for (const cookie of cookies) {
      mockCookies.set(...cookie);
    }

    let i = 0;
    for (const cookie of mockCookies) {
      const [name, value] = cookies[i++];
      expect(cookie).toEqual([name, { name, value }]);
    }
  });
});
