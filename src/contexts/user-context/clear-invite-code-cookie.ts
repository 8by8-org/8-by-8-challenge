import { createCSRFHeader } from '@/utils/csrf/create-csrf-header';

/**
 * The invite code cookie. Can only be called from client-side code.
 */
export async function clearInviteCode() {
  await fetch('/api/clear-invite-code-cookie', {
    method: 'DELETE',
    headers: createCSRFHeader(),
  });
}
