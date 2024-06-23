import { z } from 'zod';
import { UserType } from '@/model/enums/user-type';
import { Actions } from '@/model/enums/actions';
import type { User } from '@/model/types/user';
import type { Avatar } from '@/model/types/avatar';

interface DBActionBadge {
  action: Actions.VoterRegistration | Actions.SharedChallenge;
}

interface DBPlayerBadge {
  player_name: string;
  player_avatar: Avatar;
}

/**
 * Adapts a user record as stored in the database into a {@link User}.
 */
export class DBUserAdapter {
  private static dbCompletedActionsSchema = z.object({
    election_reminders: z.boolean(),
    register_to_vote: z.boolean(),
    shared_challenge: z.boolean(),
  });

  private static dbBadgeSchema = z
    .object({
      action: z.enum([Actions.VoterRegistration, Actions.SharedChallenge]),
      player_name: z.string(),
      player_avatar: z.enum(['0', '1', '2', '3']),
    })
    .partial();

  private static isDBActionBadge(
    badge: z.infer<typeof this.dbBadgeSchema>,
  ): badge is DBActionBadge {
    return !!badge.action;
  }

  private static isDBPlayerBadge(
    badge: z.infer<typeof this.dbBadgeSchema>,
  ): badge is DBPlayerBadge {
    return !!badge.player_name && !!badge.player_avatar;
  }

  private static dbInvitedBySchema = z.object({
    challenger_invite_code: z.string(),
    challenger_name: z.string(),
    challenger_avatar: z.enum(['0', '1', '2', '3']),
  });

  private static dbContributedToSchema = z.object({
    challenger_invite_code: z.string(),
    challenger_name: z.string(),
    challenger_avatar: z.enum(['0', '1', '2', '3']),
  });

  private static dbUserSchema = z.object({
    id: z.string(),
    email: z.string(),
    name: z.string(),
    avatar: z.enum(['0', '1', '2', '3']),
    type: z.nativeEnum(UserType),
    challenge_end_timestamp: z.number(),
    completed_challenge: z.boolean(),
    redeemed_award: z.boolean(),
    invite_code: z.string(),
    completed_actions: this.dbCompletedActionsSchema,
    badges: z.array(this.dbBadgeSchema),
    invited_by: this.dbInvitedBySchema.nullable(),
    contributed_to: z.array(this.dbContributedToSchema),
  });

  public static adaptDBUser(dbUser: object): User {
    const validatedDBUser = this.dbUserSchema.parse(dbUser);

    const user: User = {
      uid: validatedDBUser.id,
      email: validatedDBUser.email,
      name: validatedDBUser.name,
      avatar: validatedDBUser.avatar,
      type: validatedDBUser.type,
      completedActions: {
        electionReminders: validatedDBUser.completed_actions.election_reminders,
        registerToVote: validatedDBUser.completed_actions.register_to_vote,
        sharedChallenge: validatedDBUser.completed_actions.shared_challenge,
      },
      badges: validatedDBUser.badges.map(badge => {
        if (this.isDBActionBadge(badge)) return badge;
        else if (this.isDBPlayerBadge(badge))
          return {
            playerName: badge.player_name,
            playerAvatar: badge.player_avatar,
          };
        else
          throw new Error(
            'Badge is neither an action badge nor a player badge.',
          );
      }),
      invitedBy:
        validatedDBUser.invited_by ?
          {
            inviteCode: validatedDBUser.invited_by.challenger_invite_code,
            name: validatedDBUser.invited_by.challenger_name,
            avatar: validatedDBUser.invited_by.challenger_avatar,
          }
        : undefined,
      contributedTo: validatedDBUser.contributed_to.map(contributedTo => ({
        name: contributedTo.challenger_name,
        avatar: contributedTo.challenger_avatar,
      })),
      challengeEndTimestamp: validatedDBUser.challenge_end_timestamp,
      completedChallenge: validatedDBUser.completed_challenge,
      redeemedAward: validatedDBUser.redeemed_award,
      inviteCode: validatedDBUser.invite_code,
    };

    return user;
  }
}
