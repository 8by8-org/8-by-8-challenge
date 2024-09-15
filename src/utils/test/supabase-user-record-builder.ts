import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { Actions } from '@/model/enums/actions';
import { UserType } from '@/model/enums/user-type';
import { DateTime } from 'luxon';
import { init } from '@paralleldrive/cuid2';
import { isActionBadge } from '@/components/progress/badges/is-action-badge';
import { PUBLIC_ENVIRONMENT_VARIABLES } from '@/constants/public-environment-variables';
import { PRIVATE_ENVIRONMENT_VARIABLES } from '@/constants/private-environment-variables';
import { UserRecordParser } from '@/services/server/user-record-parser/user-record-parser';
import type { User } from '@/model/types/user';
import type { Avatar } from '@/model/types/avatar';
import type { Badge } from '@/model/types/badge';

interface UserRecord {
  email: string;
  user_name: string;
  avatar: Avatar;
  user_type: UserType;
  challenge_end_timestamp: number;
  completed_challenge: boolean;
  invite_code: string;
}

interface CompletedActions {
  electionReminders?: boolean;
  registerToVote?: boolean;
  sharedChallenge?: boolean;
}

interface CompletedActionsRecord {
  election_reminders: boolean;
  register_to_vote: boolean;
  shared_challenge: boolean;
}

interface ActionBadgeRecord {
  action_type: Actions;
}

interface PlayerBadgeRecord {
  player_name: string;
  player_avatar: Avatar;
}

interface InvitedBy {
  inviteCode: string;
  name: string;
  avatar: Avatar;
}

interface InvitedByRecord {
  challenger_invite_code: string;
  challenger_name: string;
  challenger_avatar: Avatar;
}

interface ContributedTo {
  name: string;
  inviteCode: string;
  avatar: Avatar;
}

interface ContributedToRecord {
  challenger_name: string;
  challenger_invite_code: string;
  challenger_avatar: Avatar;
}

/**
 * A builder that can insert records into the Supabase database and then return
 * the resultant {@link User}.
 */
export class SupabaseUserRecordBuilder {
  private userRecord: UserRecord;
  private badgeRecords: Array<PlayerBadgeRecord | ActionBadgeRecord> = [];
  private contributedToRecords: Array<ContributedToRecord> = [];
  private completedActionsRecord?: CompletedActionsRecord;
  private invitedByRecord?: InvitedByRecord;

  constructor(email: string) {
    this.userRecord = {
      email,
      user_name: '',
      avatar: '0',
      user_type: UserType.Challenger,
      challenge_end_timestamp: DateTime.now().plus({ days: 8 }).toUnixInteger(),
      completed_challenge: false,
      invite_code: init({ length: 10 })(),
    };
  }

  name(name: string) {
    this.userRecord.user_name = name;
    return this;
  }

  avatar(avatar: Avatar) {
    this.userRecord.avatar = avatar;
    return this;
  }

  type(type: UserType) {
    this.userRecord.user_type = type;
    return this;
  }

  inviteCode(inviteCode: string) {
    this.userRecord.invite_code = inviteCode;
    return this;
  }

  challengeEndTimestamp(challengeEndTimestamp: number) {
    this.userRecord.challenge_end_timestamp = challengeEndTimestamp;
    return this;
  }

  completedChallenge(completedChallenge: boolean) {
    this.userRecord.completed_challenge = completedChallenge;
    return this;
  }

  badges(badges: Array<Badge>) {
    this.badgeRecords = badges.map(badge => {
      if (isActionBadge(badge)) {
        return {
          action_type: badge.action,
        };
      }

      return {
        player_name: badge.playerName,
        player_avatar: badge.playerAvatar,
      };
    });

    return this;
  }

  completedActions(completedActions: CompletedActions) {
    this.completedActionsRecord = {
      election_reminders: !!completedActions.electionReminders,
      register_to_vote: !!completedActions.registerToVote,
      shared_challenge: !!completedActions.sharedChallenge,
    };

    return this;
  }

  invitedBy(invitedBy: InvitedBy) {
    this.invitedByRecord = {
      challenger_invite_code: invitedBy.inviteCode,
      challenger_name: invitedBy.name,
      challenger_avatar: invitedBy.avatar,
    };

    return this;
  }

  contributedTo(contributedTo: Array<ContributedTo>) {
    this.contributedToRecords = contributedTo.map(
      ({ name, inviteCode, avatar }) => {
        return {
          challenger_name: name,
          challenger_invite_code: inviteCode,
          challenger_avatar: avatar,
        };
      },
    );

    return this;
  }

  async build(): Promise<User> {
    const supabase = createClient(
      PUBLIC_ENVIRONMENT_VARIABLES.NEXT_PUBLIC_SUPABASE_URL,
      PRIVATE_ENVIRONMENT_VARIABLES.SUPABASE_SERVICE_ROLE_KEY,
    );

    const userMetadata = {
      name: this.userRecord.user_name,
      type: this.userRecord.user_type,
      avatar: this.userRecord.avatar,
      invite_code: this.userRecord.invite_code,
    };

    const { data: userData, error: userInsertionError } =
      await supabase.auth.admin.createUser({
        email: this.userRecord.email,
        email_confirm: true,
        user_metadata: userMetadata,
      });

    /* istanbul ignore next */
    if (userInsertionError) {
      throw new Error(userInsertionError.message);
    }

    const { error: updateUserError } = await supabase
      .from('users')
      .update({
        challenge_end_timestamp: this.userRecord.challenge_end_timestamp,
        completed_challenge: this.userRecord.completed_challenge,
      })
      .eq('id', userData.user.id);

    /* istanbul ignore next */
    if (updateUserError) {
      throw new Error(updateUserError.message);
    }

    for (const badgeRecord of this.badgeRecords) {
      const { error: badgeInsertionError } = await supabase
        .from('badges')
        .insert({
          challenger_id: userData.user.id,
          ...badgeRecord,
        });

      /* istanbul ignore next */
      if (badgeInsertionError) {
        throw new Error(badgeInsertionError.message);
      }
    }

    for (const contributedToRecord of this.contributedToRecords) {
      const { error: contributedToInsertionError } = await supabase
        .from('contributed_to')
        .insert({
          player_id: userData.user.id,
          ...contributedToRecord,
        });

      /* istanbul ignore next */
      if (contributedToInsertionError) {
        throw new Error(contributedToInsertionError.message);
      }
    }

    if (this.completedActionsRecord) {
      const { error: completedActionsInsertionRecord } = await supabase
        .from('completed_actions')
        .update(this.completedActionsRecord)
        .eq('user_id', userData.user.id);

      /* istanbul ignore next */
      if (completedActionsInsertionRecord) {
        throw new Error(completedActionsInsertionRecord.message);
      }
    }

    if (this.invitedByRecord) {
      const { error: invitedByInsertionError } = await supabase
        .from('invited_by')
        .insert({
          player_id: userData.user.id,
          ...this.invitedByRecord,
        });

      /* istanbul ignore next */
      if (invitedByInsertionError) {
        throw new Error(invitedByInsertionError.message);
      }
    }

    const { data: userRecord, error: getUserError } = await supabase.rpc(
      'get_user_by_id',
      {
        user_id: userData.user.id,
      },
    );

    /* istanbul ignore next */
    if (getUserError) {
      throw new Error(getUserError.message);
    }

    const user = new UserRecordParser().parseUserRecord(userRecord);
    return user;
  }
}
