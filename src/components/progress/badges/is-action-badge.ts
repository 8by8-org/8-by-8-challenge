import type { ActionBadge } from '@/model/types/badges/action-badge';
import type { PlayerBadge } from '@/model/types/badges/player-badge';

export function isActionBadge(
  badge: ActionBadge | PlayerBadge,
): badge is ActionBadge {
  return 'action' in badge;
}
