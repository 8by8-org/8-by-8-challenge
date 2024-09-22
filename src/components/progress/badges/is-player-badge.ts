import type { ActionBadge } from '@/model/types/badges/action-badge';
import type { PlayerBadge } from '@/model/types/badges/player-badge';

export function isPlayerBadge(
  badge: ActionBadge | PlayerBadge,
): badge is PlayerBadge {
  return 'playerName' in badge && 'playerAvatar' in badge;
}
