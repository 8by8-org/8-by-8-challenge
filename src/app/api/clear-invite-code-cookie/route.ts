import 'server-only';
import { serverContainer } from '@/services/server/container';
import { SERVER_SERVICE_KEYS } from '@/services/server/keys';
import { NextResponse } from 'next/server';

export function DELETE() {
  const cookies = serverContainer.get(SERVER_SERVICE_KEYS.Cookies);
  cookies.clearInviteCode();
  return NextResponse.json({ message: 'Delete successful.' }, { status: 200 });
}
