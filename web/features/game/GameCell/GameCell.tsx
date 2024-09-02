import { FC } from 'react';
import GameChip from '../GameChip/GameChip';
import { Chip } from '../types';
import styles from './GameCell.module.scss';

interface GameCellProps {
  x: number;
  y: number;
  cell: Chip | null;
  activeChip: Chip | null;
  attackers: number;
  runners: number;
  isRoundActive: boolean;
  isAttackerDone: boolean;
  isRunnerDone: boolean;
  isAdjacentCell: boolean;
  onCellClick: (x: number, y: number) => void;
}

const GameCell: FC<GameCellProps> = ({
  x,
  y,
  cell,
  activeChip,
  attackers,
  runners,
  isRoundActive,
  isAttackerDone,
  isRunnerDone,
  isAdjacentCell,
  onCellClick,
}) => {
  const getRandomPercentage = () => `calc(${10 + Math.random() * 70}% - 4px)`;

  return (
    <div
      className={`${styles.cell} ${
        activeChip && isAdjacentCell && isRoundActive && !cell
          ? styles[`highlight-${activeChip.type}`]
          : ''
      }`}
      onClick={() => {
        onCellClick(x, y);
      }}
    >
      {attackers > 0 &&
        Array(attackers)
          .fill(null)
          .map((_, index) => (
            <div
              key={index}
              className={styles.attacker}
              style={{
                top: getRandomPercentage(),
                left: getRandomPercentage(),
              }}
            />
          ))}

      {runners > 0 &&
        Array(runners)
          .fill(null)
          .map((_, index) => (
            <div
              key={index}
              className={styles.runner}
              style={{
                top: getRandomPercentage(),
                left: getRandomPercentage(),
              }}
            />
          ))}

      {cell && (
        <GameChip
          variant={cell.type}
          isActive={activeChip?.id === cell.id}
          isDisabled={
            !isRoundActive ||
            (isRunnerDone && cell.type === 'runner') ||
            (isAttackerDone && cell.type === 'attacker')
          }
        />
      )}
      <div className={styles.coord}>{`${String.fromCharCode(65 + y)}${
        x + 1
      }`}</div>
    </div>
  );
};

export default GameCell;
