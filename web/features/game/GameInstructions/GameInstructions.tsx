import { FC } from 'react';
import Link from 'next/link';
import cn from 'classnames';
import styles from './GameInstructions.module.scss';

interface GameInstructionsProps {
  isSetupPhase: boolean;
  isRoundActive: boolean;
  isAttackerDone: boolean;
  isRunnerDone: boolean;
  isPlayerEliminated: boolean;
}

const GameInstructions: FC<GameInstructionsProps> = ({
  isSetupPhase,
  isRoundActive,
  isAttackerDone,
  isRunnerDone,
  isPlayerEliminated,
}) => {
  if (isPlayerEliminated)
    return (
      <div className={styles.status}>
        <div className={styles.eliminated}>
          You are eliminated. You can watch this game or{' '}
          <Link href="/" className="link">
            play new game
          </Link>
          .
        </div>
      </div>
    );

  if (!isRoundActive)
    return (
      <div className={styles.status}>
        <div className={styles.wait}>Wait for the round to start</div>
      </div>
    );

  return (
    <div className={styles.status}>
      <div className={cn(styles.runner, { [styles.runnerDone]: isRunnerDone })}>
        {isSetupPhase ? (
          <span className={styles.text}>
            Set up your running chip on the board
          </span>
        ) : (
          <span className={styles.text}>Make a move with a running chip</span>
        )}{' '}
        {isRunnerDone && <span className={styles.done}>Done</span>}
      </div>

      <div
        className={cn(styles.attacker, {
          [styles.attackerDone]: isAttackerDone,
        })}
      >
        {isSetupPhase ? (
          <span className={styles.text}>
            Set up your attacking chip on the board
          </span>
        ) : (
          <span className={styles.text}>
            Make a move with an attacking chip
          </span>
        )}{' '}
        {isAttackerDone && <span className={styles.done}>Done</span>}
      </div>
    </div>
  );
};

export default GameInstructions;
