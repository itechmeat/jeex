import { FC } from 'react';
import { PlayerChipsSet } from '../types';
import styles from './GameStat.module.scss';

interface GameStatProps {
  playerChips: PlayerChipsSet;
}

const GameStat: FC<GameStatProps> = ({ playerChips }) => {
  const roundToTwoDecimals = (num: number) => Math.round(num * 100) / 100;

  const attackerScore = playerChips.attacker
    ? roundToTwoDecimals(playerChips.attacker.score)
    : 0;
  const runnerScore = playerChips.runner
    ? roundToTwoDecimals(playerChips.runner.score)
    : 0;

  return (
    <div className={styles.stat}>
      <div className={styles.attacker}>
        <div className={styles.label}>Attacker</div>
        <div className={styles.score}>{attackerScore}</div>
      </div>
      <div className={styles.runner}>
        <div className={styles.label}>Runner</div>
        <div className={styles.score}>{runnerScore}</div>
      </div>
      <div className={styles.sum}>
        <div className={styles.label}>Sum</div>
        <div className={styles.score}>
          {roundToTwoDecimals(attackerScore + runnerScore)}
        </div>
      </div>
    </div>
  );
};

export default GameStat;
