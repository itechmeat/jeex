'use client';

import { useState, useEffect, useCallback, FC } from 'react';
import GameBoard from '@/features/game/GameBoard/GameBoard';
import { ApiGame, Chip, Coordinates } from '@/features/game/types';
import { generateGameInitialPlayers } from '../utils';

const initialPlayers = generateGameInitialPlayers(99);

const ROUND_DURATION = 10000;
const ROUND_BREAK_DURATION = 5000;
const TOTAL_ROUNDS = 10;

interface GameWrapperProps {
  game: ApiGame;
}

const GameWrapper: FC<GameWrapperProps> = ({ game }) => {
  const [chips, setChips] = useState<Chip[]>([]);
  const [isAttackerDone, setIsAttackerDone] = useState(false);
  const [isRunnerDone, setIsRunnerDone] = useState(false);
  const [currentRound, setCurrentRound] = useState(0);
  const [roundStartTime, setRoundStartTime] = useState<number>(Date.now());
  const [roundEndTime, setRoundEndTime] = useState<number>(
    Date.now() + ROUND_DURATION
  );
  const [isGameActive, setIsGameActive] = useState(true);
  console.log('🚀 ~ initialPlayers:', initialPlayers);

  const startNextRound = useCallback(() => {
    if (currentRound < TOTAL_ROUNDS - 1) {
      const now = Date.now();
      setCurrentRound((prev) => prev + 1);
      setRoundStartTime(now + ROUND_BREAK_DURATION);
      setRoundEndTime(now + ROUND_BREAK_DURATION + ROUND_DURATION);
      setIsAttackerDone(false);
      setIsRunnerDone(false);
    } else {
      setIsGameActive(false);
      console.log('Game over!');
    }
  }, [currentRound]);

  useEffect(() => {
    if (!isGameActive) return;

    const timer = setTimeout(() => {
      if (Date.now() >= roundEndTime) {
        startNextRound();
      }
    }, roundEndTime - Date.now());

    return () => {
      clearTimeout(timer);
    };
  }, [roundEndTime, startNextRound, isGameActive]);

  const handleMoveMade = (
    attackerCoords: Coordinates,
    runnerCoords: Coordinates,
    moving: Chip['type']
  ) => {
    console.log('Move made:', {
      attacker: attackerCoords,
      runner: runnerCoords,
    });
    setChips((prevChips) => {
      return prevChips.map((chip) => {
        if (chip.type === 'attacker') {
          return { ...chip, coordinates: attackerCoords };
        } else if (chip.type === 'runner') {
          return { ...chip, coordinates: runnerCoords };
        }
        return chip;
      });
    });

    if (moving === 'attacker') {
      setIsAttackerDone(true);
    }
    if (moving === 'runner') {
      setIsRunnerDone(true);
    }
  };

  const handleInitialPlacement = (attackerChip: Chip, runnerChip: Chip) => {
    setChips([attackerChip, runnerChip]);
  };

  if (!isGameActive) {
    return <div>Game over!</div>;
  }

  return (
    <div>
      <h1>Chain Charge</h1>
      <GameBoard
        chips={chips}
        roundStartTime={roundStartTime}
        roundEndTime={roundEndTime}
        currentRound={currentRound}
        isAttackerDone={isAttackerDone}
        isRunnerDone={isRunnerDone}
        players={initialPlayers}
        onMoveMade={handleMoveMade}
        onInitialPlacement={handleInitialPlacement}
      />
    </div>
  );
};

export default GameWrapper;
