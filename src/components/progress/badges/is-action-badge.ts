import type { ActionBadge } from '@/model/types/action-badge';
import type { PlayerBadge } from '@/model/types/player-badge';

export function isActionBadge(
  badge: ActionBadge | PlayerBadge,
): badge is ActionBadge {
  return 'action' in badge;
}
