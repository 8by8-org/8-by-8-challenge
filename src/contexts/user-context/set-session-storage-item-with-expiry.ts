import { DateTime } from 'luxon';

export function setSessionStorageItemWithExpiry(
  key: string,
  data: unknown,
  ttl: number,
) {
  const dataWithExpiry = {
    data,
    expiry: DateTime.now().toMillis() + ttl,
  };

  sessionStorage.setItem(key, JSON.stringify(dataWithExpiry));
}
