'use client';

import React, { useState, useEffect, useCallback } from 'react';
import GameBoard from '@/features/game/GameBoard/GameBoard';
import { ApiGame, Chip, Coordinates, PlayerChips } from '@/features/game/types';
import {
  convertCoordToXY,
  convertXYToCoord,
  generateGameInitialPlayers,
  updatePlayerPositions,
} from '../utils';
import { useGameState } from '../hooks/useGameState';
import { useGameTimer } from '../hooks/useGameTimer';

const ROUND_DURATION = 10000;
const ROUND_BREAK_DURATION = 5000;
const TOTAL_ROUNDS = 10;

interface GameWrapperProps {
  game: ApiGame;
}

const GameWrapper: React.FC<GameWrapperProps> = ({ game }) => {
  const [players, setPlayers] = useState<PlayerChips[]>(() =>
    generateGameInitialPlayers(99)
  );
  // console.log('🚀 ~ players:', players);

  const {
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
  } = useGameState();

  const {
    roundStartTime,
    roundEndTime,
    isRoundActive,
    timeLeft,
    // startNextRound,
  } = useGameTimer({
    currentRound,
    setCurrentRound,
    isGameActive,
    setIsGameActive,
    setIsAttackerDone,
    setIsRunnerDone,
    ROUND_DURATION,
    ROUND_BREAK_DURATION,
    TOTAL_ROUNDS,
  });

  useEffect(() => {
    if (currentRound > 0) {
      setPlayers(updatePlayerPositions(players));
    }
  }, [currentRound, setIsGameActive]);

  useEffect(() => {
    if (currentRound === 0 && chips.length === 0) {
      const initialChips = players.slice(0, 2).map(
        (player, index) =>
          ({
            id: `player-${index === 0 ? 'attacker' : 'runner'}`,
            type: index === 0 ? 'attacker' : 'runner',
            coordinates: convertCoordToXY(
              index === 0 ? player.attacker_coord : player.runner_coord
            ),
            score: index === 0 ? player.attacker_points : player.runner_points,
          } as Chip)
      );
      setChips(initialChips);
    }
  }, [currentRound, chips, players, setChips]);

  const handleMoveMade = useCallback(
    (
      attackerCoords: Coordinates,
      runnerCoords: Coordinates,
      moving: Chip['type']
    ) => {
      setChips((prevChips) =>
        prevChips.map((chip) =>
          chip.type === 'attacker'
            ? { ...chip, coordinates: attackerCoords }
            : chip.type === 'runner'
            ? { ...chip, coordinates: runnerCoords }
            : chip
        )
      );

      if (moving === 'attacker') {
        setIsAttackerDone(true);
      }
      if (moving === 'runner') {
        setIsRunnerDone(true);
      }

      setPlayers((prevPlayers) =>
        prevPlayers.map((player, index) =>
          index < 2
            ? {
                ...player,
                attacker_coord: convertXYToCoord(attackerCoords),
                runner_coord: convertXYToCoord(runnerCoords),
              }
            : player
        )
      );
    },
    [setChips, setIsAttackerDone, setIsRunnerDone]
  );

  const handleInitialPlacement = useCallback(
    (attackerChip: Chip, runnerChip: Chip) => {
      setChips([attackerChip, runnerChip]);
    },
    [setChips]
  );

  useEffect(() => {
    if (isRoundActive) {
      setIsAttackerDone(false);
      setIsRunnerDone(false);
    }
  }, [isRoundActive, setIsAttackerDone, setIsRunnerDone]);

  if (!isGameActive) {
    return <div>Game over!</div>;
  }

  return (
    <div>
      <GameBoard
        chips={chips}
        roundStartTime={roundStartTime}
        roundEndTime={roundEndTime}
        currentRound={currentRound}
        isAttackerDone={isAttackerDone}
        isRunnerDone={isRunnerDone}
        players={players}
        onMoveMade={handleMoveMade}
        onInitialPlacement={handleInitialPlacement}
        isRoundActive={isRoundActive}
        timeLeft={timeLeft}
      />
    </div>
  );
};

export default GameWrapper;
