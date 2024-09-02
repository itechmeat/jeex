import { FC, PropsWithChildren } from 'react';
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
  isAdjacentCell: boolean;
  onCellClick: (x: number, y: number) => void;
}

const GameCell: FC<PropsWithChildren<GameCellProps>> = ({
  children,
  x,
  y,
  cell,
  activeChip,
  attackers,
  runners,
  isRoundActive,
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

      {children}

      <div className={styles.coord}>{`${String.fromCharCode(65 + y)}${
        x + 1
      }`}</div>
    </div>
  );
};

export default GameCell;
