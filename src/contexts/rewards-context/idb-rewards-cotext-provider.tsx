'use client';
import { Reward } from '@/model/types/reward.type';
import { useState, type PropsWithChildren } from 'react';
import { RewardsContext } from './rewards-context';

const exampleRewards: Array<Reward> = [
  // Reward available
  {
    businessDescription:
      'At Chefus, everything we do is to bring a chef-made meal with fresh ingredients to your table at an incredible price.',
    businessLink: 'https://www.chefus.com/',
    businessType: 'Online deliveries',
    locationDescription: 'Online',
    locationType: 'Online',
    logo: '/assets/partner-logos/chefus.png',
    name: 'Chefus',
    redemptionDescription: 'Use code CHEFUS8BY8 at checkout.',
    rewardAvailable: true,
    rewardConditions: 'CHEFUS8BY8',
    rewardDescription: 'Get $10 off on orders of $20+.',
    rewardEndDate: undefined,
    rewardLink: 'https://www.chefus.com/',
    rewardStartDate: new Date('2022-08-01'),
    rewardType: 'Online',
  },
  // Reward no longer available
  {
    businessDescription:
      'At Chefus, everything we do is to bring a chef-made meal with fresh ingredients to your table at an incredible price.',
    businessLink: 'https://www.chefus.com/',
    businessType: 'Online deliveries',
    locationDescription: 'Online',
    locationType: 'Online',
    logo: '/assets/partner-logos/chefus.png',
    name: 'Chefus Not Avaiable',
    redemptionDescription: 'Use code CHEFUS8BY8 at checkout.',
    rewardAvailable: false,
    rewardConditions: 'CHEFUS8BY8',
    rewardDescription: 'Get $10 off on orders of $20+.',
    rewardEndDate: new Date('2050-09-01'),
    rewardLink: 'https://www.chefus.com/',
    rewardStartDate: new Date('2022-08-01'),
    rewardType: 'Online',
  },
  // Expired Reward
  {
    businessDescription:
      'At Chefus, everything we do is to bring a chef-made meal with fresh ingredients to your table at an incredible price.',
    businessLink: 'https://www.chefus.com/',
    businessType: 'Online deliveries',
    locationDescription: 'Online',
    locationType: 'Online',
    logo: '/assets/partner-logos/chefus.png',
    name: 'Chefus Expired',
    redemptionDescription: 'Use code CHEFUS8BY8 at checkout.',
    rewardAvailable: false,
    rewardConditions: 'CHEFUS8BY8',
    rewardDescription: 'Get $10 off on orders of $20+.',
    rewardEndDate: new Date('20524-01-01'),
    rewardLink: 'https://www.chefus.com/',
    rewardStartDate: new Date('2022-08-01'),
    rewardType: 'Online',
  },
];

/**
 * An implementation of RewardsContext.Provider. Intended for local development only.
 */
export function IDBRewardsContextProvider({ children }: PropsWithChildren) {
  const [rewardsArray, setRewardsArray] =
    useState<Array<Reward>>(exampleRewards);

  /**
   * Returns the information about the reward that was chosen by the user.
   *
   * @param rewardName - The name of the reward that the user has chosen.
   */
  const getSpecificReward = (rewardName: string): Reward => {
    let rewardInfo = {};
    for (let reward of exampleRewards) {
      if (reward.name === rewardName) rewardInfo = reward;
    }

    return rewardInfo as Reward;
  };

  /**
   * Returns the information about the reward that was chosen by the user.
   */
  const getAllAvailableRewards = (): Array<Reward> => {
    const availableRewards: Array<Reward> = [];

    for (let reward of exampleRewards) {
      if (reward.rewardAvailable === true) availableRewards.push(reward);
    }

    return availableRewards;
  };

  return (
    <RewardsContext.Provider
      value={{
        rewards: rewardsArray,
        getSpecificReward,
        getAllAvailableRewards,
      }}
    >
      {children}
    </RewardsContext.Provider>
  );
}
