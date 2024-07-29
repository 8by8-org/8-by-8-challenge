import type {
  RequestCookie,
  ResponseCookie,
} from 'next/dist/compiled/@edge-runtime/cookies';

export class MockNextCookies {
  private cookieStore = new Map<string, RequestCookie>();

  public cookies() {
    const self = this;

    return {
      get(name: string) {
        return self.cookieStore.get(name);
      },
      getAll() {
        return Array.from(self.cookieStore.values());
      },
      set(name: string, value: string, options?: Partial<ResponseCookie>) {
        self.cookieStore.set(name, {
          name,
          value,
          ...options,
        });

        return self.cookies();
      },
      has(name: string) {
        return self.cookieStore.has(name);
      },
      delete(names: string | string[]) {
        if (Array.isArray(names)) {
          const deleted = names.map(name => {
            return self.cookieStore.delete(name);
          });
          return deleted;
        } else {
          return self.cookieStore.delete(names);
        }
      },
      clear() {
        self.cookieStore.clear();

        return self.cookies();
      },
      get size() {
        return self.cookieStore.size;
      },
      *[Symbol.iterator]() {
        const entries = Array.from(self.cookieStore.entries());

        for (let i = 0; i < entries.length; i++) {
          yield entries[i];
        }
      },
    };
  }
}
