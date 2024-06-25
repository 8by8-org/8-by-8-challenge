'use client';
import { Reward } from '@/model/types/reward.type';
import { createNamedContext } from '../../hooks/functions/create-named-context';

interface RewardsContextType {
  rewards: Array<Reward>;
  getSpecificReward(rewardName: string): Reward;
  getAllAvailableRewards(): Array<Reward>;
}

const RewardsContext = createNamedContext<RewardsContextType>('RewardsContext');

export { RewardsContext, type RewardsContextType };
