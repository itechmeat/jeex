import React from 'react';
import { ChipType } from '../types';
import styles from './GameChip.module.scss';
import cn from 'classnames';

interface GameChipProps {
  variant: ChipType;
  isActive: boolean;
  isDisabled: boolean;
}

const GameChip: React.FC<GameChipProps> = ({
  variant,
  isActive,
  isDisabled,
}) => {
  return (
    <div
      className={cn(styles.chip, styles[variant], {
        [styles.active]: isActive,
        [styles.disabled]: isDisabled,
      })}
    />
  );
};

export default GameChip;
