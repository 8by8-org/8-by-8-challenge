import { AVATARS } from '@/constants/avatars';

/**
 * The id of the user's avatar.
 */
export type Avatar = Extract<keyof typeof AVATARS, `${number}`>;
