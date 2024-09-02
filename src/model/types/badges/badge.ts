import type { ActionBadge } from './action-badge';
import type { PlayerBadge } from './player-badge';

/**
 * Represents a badge awarded to the user either through their own actions, or
 * due to an action taken by a player they invited.
 */
export type Badge = ActionBadge | PlayerBadge;
