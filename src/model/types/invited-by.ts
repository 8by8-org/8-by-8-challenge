import type { Avatar } from './avatar';

export interface InvitedBy {
  challengerInviteCode: string;
  challengerName: string;
  challengerAvatar: Avatar;
}
