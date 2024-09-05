import { FC, useMemo } from 'react';
import styles from './GameProgress.module.scss';
import {
  ROUND_BREAK_DURATION,
  ROUND_DURATION,
} from '@/features/game/constants';

interface GameProgressProps {
  currentRound: number;
  isSetupPhase: boolean;
  isRoundActive: boolean;
  timeLeft: number;
}

const GameProgress: FC<GameProgressProps> = ({
  currentRound,
  isSetupPhase,
  isRoundActive,
  timeLeft,
}) => {
  const progress = useMemo(() => {
    if (!timeLeft) return 100;

    if (!isRoundActive) {
      return Math.round((timeLeft / ROUND_BREAK_DURATION) * 1000 * 100);
    }

    return Math.round(100 - (timeLeft / ROUND_DURATION) * 1000 * 100);
  }, [isRoundActive, timeLeft]);

  if (!timeLeft && currentRound === 0)
    return <span className="loading loading-spinner text-primary loading-md" />;

  return (
    <div className={styles.timer}>
      <div className={styles.text}>
        {isSetupPhase
          ? `${timeLeft} seconds to place your chips`
          : timeLeft > 0
          ? `${timeLeft} seconds until the ${
              isRoundActive ? 'end' : 'start'
            } of the round`
          : 'Round is finished'}
      </div>

      <div className={styles.progress}>
        <div
          className={styles.percent}
          style={{ width: `${progress + 0.1}%` }}
        />
      </div>
    </div>
  );
};

export default GameProgress;
