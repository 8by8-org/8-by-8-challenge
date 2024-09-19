export async function clearInviteCode() {
  await fetch('/api/clear-invite-code-cookie', {
    method: 'DELETE',
  });
}
