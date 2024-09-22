import { DELETE } from '@/app/api/clear-invite-code-cookie/route';
import { serverContainer } from '@/services/server/container';
import { SERVER_SERVICE_KEYS } from '@/services/server/keys';
import { saveActualImplementation } from '@/utils/test/save-actual-implementation';
import { Builder } from 'builder-pattern';
import type { ICookies } from '@/services/server/cookies/i-cookies';

describe('DELETE', () => {
  const getActualService = saveActualImplementation(serverContainer, 'get');
  let clearInviteCode: () => void;

  beforeEach(() => {
    clearInviteCode = jest.fn();

    jest.spyOn(serverContainer, 'get').mockImplementation(key => {
      if (key.name === SERVER_SERVICE_KEYS.Cookies.name) {
        return Builder<ICookies>().clearInviteCode(clearInviteCode).build();
      }

      return getActualService(key);
    });
  });

  it('removes the invite code cookie.', async () => {
    DELETE();
    expect(clearInviteCode).toHaveBeenCalled();
  });
});
