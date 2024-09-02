import { useState } from 'react';
import { Chip } from '@/features/game/types';

export const useGameState = () => {
  const [chips, setChips] = useState<Chip[]>([]);
  const [isAttackerDone, setIsAttackerDone] = useState(false);
  const [isRunnerDone, setIsRunnerDone] = useState(false);
  const [currentRound, setCurrentRound] = useState(0);
  const [isGameActive, setIsGameActive] = useState(true);

  return {
    chips,
    setChips,
    isAttackerDone,
    setIsAttackerDone,
    isRunnerDone,
    setIsRunnerDone,
    currentRound,
    setCurrentRound,
    isGameActive,
    setIsGameActive,
  };
};
