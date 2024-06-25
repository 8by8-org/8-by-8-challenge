import { IDBRewardsContextProvider } from '@/contexts/rewards-context/idb-rewards-cotext-provider';
import { RewardsContext } from '@/contexts/rewards-context/rewards-context';
import { useContextSafely } from '@/hooks/functions/use-context-safely';
import { Reward } from '@/model/types/reward.type';
import '@testing-library/jest-dom';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { useEffect, useState } from 'react';

describe('RewardsContextProvider', () => {
  afterEach(cleanup);

  it('displays the names of the dummy rewards', () => {
    function RewardNamesComponent() {
      const { rewards } = useContextSafely(RewardsContext, 'TestComponent');
      return (
        <div data-testid="test">
          <p data-testid="reward1">{rewards[0].name}</p>
          <p data-testid="reward2">{rewards[1].name}</p>
          <p data-testid="reward3">{rewards[2].name}</p>
        </div>
      );
    }

    render(
      <IDBRewardsContextProvider>
        <RewardNamesComponent />
      </IDBRewardsContextProvider>,
    );

    const reward1 = screen.queryByTestId('reward1');
    expect(reward1).toHaveTextContent('Chefus');

    const reward2 = screen.queryByTestId('reward2');
    expect(reward2).toHaveTextContent('Chefus Not Avaiable');

    const reward3 = screen.queryByTestId('reward3');
    expect(reward3).toHaveTextContent('Chefus Expired');
  });

  it('displays the info of the reward chosen by the user', async () => {
    function RewardInfoComponent() {
      const { getSpecificReward } = useContextSafely(
        RewardsContext,
        'TestComponent',
      );
      const [chosenReward, setChosenReward] = useState<Reward>({
        businessDescription: '',
        businessLink: '',
        businessType: '',
        locationDescription: 'Online',
        locationType: 'Online',
        logo: '',
        name: '',
        redemptionDescription: '',
        rewardAvailable: true,
        rewardConditions: '',
        rewardDescription: '',
        rewardEndDate: undefined,
        rewardLink: '',
        rewardStartDate: new Date(),
        rewardType: 'Online',
      });

      useEffect(() => {
        setChosenReward(getSpecificReward('Chefus'));
      }, [chosenReward, getSpecificReward]);

      return (
        <div>
          <p data-testid="test">
            {chosenReward.redemptionDescription} Expires{' '}
            {chosenReward.rewardEndDate === undefined ?
              ' never'
            : chosenReward.rewardEndDate.toLocaleDateString()}
            . Availability and terms subject to change.
          </p>
        </div>
      );
    }

    render(
      <IDBRewardsContextProvider>
        <RewardInfoComponent />
      </IDBRewardsContextProvider>,
    );

    const rewardinfo = screen.queryByTestId('test');
    expect(rewardinfo).toHaveTextContent(
      'Use code CHEFUS8BY8 at checkout. Expires never. Availability and terms subject to change',
    );
  });

  it('displays the info of all the available rewards', async () => {
    function AvailableRewardsComponent() {
      const { rewards, getAllAvailableRewards } = useContextSafely(
        RewardsContext,
        'TestComponent',
      );
      const [availableRewards, setAvailableRewards] = useState<Array<Reward>>(
        [],
      );
      const rewardComponents = availableRewards.map((reward, index) => (
        <p key={index}>{reward.name}</p>
      ));

      useEffect(() => {
        setAvailableRewards(getAllAvailableRewards());
      }, [getAllAvailableRewards]);

      return <div>{rewardComponents}</div>;
    }

    render(
      <IDBRewardsContextProvider>
        <AvailableRewardsComponent />
      </IDBRewardsContextProvider>,
    );

    expect(screen.queryByText('Chefus')).toBeInTheDocument();
    expect(screen.queryByText('Chefus Not Avaiable')).not.toBeInTheDocument();
    expect(screen.queryByText('Chefus Expired')).not.toBeInTheDocument();
  });
});
