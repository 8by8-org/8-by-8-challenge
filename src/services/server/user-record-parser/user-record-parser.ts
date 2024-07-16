import 'server-only';
import { inject } from 'undecorated-di';
import { z } from 'zod';
import { UserType } from '@/model/enums/user-type';
import { Actions } from '@/model/enums/actions';
import type { IUserRecordParser } from './i-user-record-parser';
import type { User } from '@/model/types/user';

interface DBActionBadge {
  action: Actions.VoterRegistration | Actions.SharedChallenge;
  player_name: null;
  player_avatar: null;
}

/**
 * An implementation of {@link IUserRecordParser}. Parses an object returned
 * by an ORM into a {@link User}.
 */
export const UserRecordParser = inject(
  class UserRecordParser implements IUserRecordParser {
    private dbCompletedActionsSchema = z.object({
      election_reminders: z.boolean(),
      register_to_vote: z.boolean(),
      shared_challenge: z.boolean(),
    });

    private dbBadgeSchema = z.union([
      z.object({
        action: z.enum([Actions.VoterRegistration, Actions.SharedChallenge]),
        player_name: z.null(),
        player_avatar: z.null(),
      }),
      z.object({
        player_name: z.string(),
        player_avatar: z.enum(['0', '1', '2', '3']),
        action: z.null(),
      }),
    ]);

    private isDBActionBadge(
      badge: z.infer<typeof this.dbBadgeSchema>,
    ): badge is DBActionBadge {
      return !!badge.action;
    }

    private dbInvitedBySchema = z.object({
      challenger_invite_code: z.string(),
      challenger_name: z.string(),
      challenger_avatar: z.enum(['0', '1', '2', '3']),
    });

    private dbContributedToSchema = z.object({
      challenger_name: z.string(),
      challenger_avatar: z.enum(['0', '1', '2', '3']),
    });

    private dbUserSchema = z.object({
      id: z.string(),
      email: z.string(),
      name: z.string(),
      avatar: z.enum(['0', '1', '2', '3']),
      type: z.nativeEnum(UserType),
      challenge_end_timestamp: z.number(),
      completed_challenge: z.boolean(),
      invite_code: z.string(),
      completed_actions: this.dbCompletedActionsSchema,
      badges: z.array(this.dbBadgeSchema),
      invited_by: this.dbInvitedBySchema.nullable(),
      contributed_to: z.array(this.dbContributedToSchema),
    });

    public parseUserRecord(dbUser: object): User {
      const validatedDBUser = this.dbUserSchema.parse(dbUser);

      const user: User = {
        uid: validatedDBUser.id,
        email: validatedDBUser.email,
        name: validatedDBUser.name,
        avatar: validatedDBUser.avatar,
        type: validatedDBUser.type,
        completedActions: {
          electionReminders:
            validatedDBUser.completed_actions.election_reminders,
          registerToVote: validatedDBUser.completed_actions.register_to_vote,
          sharedChallenge: validatedDBUser.completed_actions.shared_challenge,
        },
        badges: validatedDBUser.badges.map(badge => {
          if (this.isDBActionBadge(badge)) {
            return {
              action: badge.action,
            };
          } else {
            return {
              playerName: badge.player_name,
              playerAvatar: badge.player_avatar,
            };
          }
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
        inviteCode: validatedDBUser.invite_code,
      };

      return user;
    }
  },
  [],
);
