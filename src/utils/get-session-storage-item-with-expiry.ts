import { DateTime } from 'luxon';
import { z, type Schema } from 'zod';

export function getSessionStorageItemWithExpiry<T extends Schema>(
  key: string,
  dataSchema: T,
): ReturnType<T['parse']> | null {
  const dataWithExpiry = sessionStorage.getItem(key);
  if (!dataWithExpiry) return null;

  try {
    const { data, expiry } = z
      .object({ data: z.string(), expiry: z.number() })
      .parse(JSON.parse(dataWithExpiry));
    const isExpired = DateTime.now().toMillis() > expiry;

    if (isExpired) {
      sessionStorage.removeItem(key);
      return null;
    }

    return dataSchema.parse(data);
  } catch (e) {
    return null;
  }
}
