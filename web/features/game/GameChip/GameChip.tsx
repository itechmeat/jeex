import React, { PropsWithChildren } from 'react';
import { ChipType } from '../types';
import styles from './GameChip.module.scss';
import cn from 'classnames';

interface GameChipProps {
  variant: ChipType;
  isActive: boolean;
  isDisabled: boolean;
  style?: React.CSSProperties;
  onClick: () => void;
}

const GameChip: React.FC<PropsWithChildren<GameChipProps>> = ({
  variant,
  isActive,
  isDisabled,
  style,
  children,
  onClick,
}) => {
  return (
    <div
      className={cn(styles.chip, styles[variant], {
        [styles.active]: isActive,
        [styles.disabled]: isDisabled,
      })}
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default GameChip;
