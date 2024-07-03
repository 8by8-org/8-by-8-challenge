import type { ActionBadge } from '@/model/types/action-badge';
import type { PlayerBadge } from '@/model/types/player-badge';

export function isPlayerBadge(
  badge: ActionBadge | PlayerBadge,
): badge is PlayerBadge {
  return 'playerName' in badge && 'playerAvatar' in badge;
}
